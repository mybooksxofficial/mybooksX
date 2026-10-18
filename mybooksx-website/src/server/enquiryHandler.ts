/**
 * MyBooks Backend Enquiry API Handler
 * Handles validation, rate-limiting, idempotency, and submission processing
 * Compatible with Vite Connect middleware, Node.js http/express, and serverless handlers
 */

export interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  businessType?: string;
  service: string;
  details?: string;
  promoCode?: string;
  idempotencyToken?: string;
  source?: 'website_form' | 'ojas_agent';
}

export interface EnquiryResponse {
  success: boolean;
  inquiryId?: string;
  isDuplicate?: boolean;
  status?: 'confirmed' | 'failed' | 'rate_limited';
  message: string;
  timestamp?: string;
  data?: {
    name: string;
    email: string;
    phone: string;
    businessType: string;
    service: string;
    details: string;
    promoCode?: string;
    pricingEstimate: {
      basePrice: number;
      discountAmount: number;
      finalTotal: number;
    };
  };
  validationErrors?: Partial<Record<keyof EnquiryPayload, string>>;
}

// In-memory stores for rate limiting and idempotency (server-side)
const rateLimitStore = new Map<string, number[]>();
const idempotencyStore = new Map<string, EnquiryResponse>();

// Clean up stale idempotency records lazily or via unref timer
function cleanupStaleIdempotency() {
  const now = Date.now();
  for (const [key, val] of idempotencyStore.entries()) {
    if (val.timestamp && now - new Date(val.timestamp).getTime() > 10 * 60 * 1000) {
      idempotencyStore.delete(key);
    }
  }
}


export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Basic anti-XSS
    .slice(0, 1000);
}

export function validatePhone(phone: string): { isValid: boolean; normalized: string } {
  // Strip common non-digits like spaces, dashes, brackets, plus
  const digitsOnly = phone.replace(/\D/g, '');

  // Support Indian 10-digit mobile: e.g. 9644570828, or with country code 919644570828, or with 0: 09644570828
  if (digitsOnly.length === 10 && /^[6-9]\d{9}$/.test(digitsOnly)) {
    return { isValid: true, normalized: digitsOnly };
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0') && /^[6-9]\d{9}$/.test(digitsOnly.slice(1))) {
    return { isValid: true, normalized: digitsOnly.slice(1) };
  }
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91') && /^[6-9]\d{9}$/.test(digitsOnly.slice(2))) {
    return { isValid: true, normalized: digitsOnly.slice(2) };
  }

  // International format fallback (minimum 7 digits, maximum 15)
  if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
    return { isValid: true, normalized: digitsOnly };
  }

  return { isValid: false, normalized: phone };
}

export function validateEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

export function calculateEstimatedPrice(serviceName: string, promoCode?: string): {
  basePrice: number;
  discountAmount: number;
  finalTotal: number;
} {
  let basePrice = 24999;
  const s = serviceName.toLowerCase();

  if (s.includes('android app') || s.includes('29,999') || s.includes('29999')) basePrice = 29999;
  else if (s.includes('resto-x') && s.includes('permanent')) basePrice = 24999;
  else if (s.includes('resto-x') && s.includes('5,999')) basePrice = 5999;
  else if (s.includes('resto-x') && (s.includes('4,999') || s.includes('yearly'))) basePrice = 4999;
  else if (s.includes('event-x') || s.includes('wedding')) basePrice = 2999;
  else if (s.includes('ojas ai') && s.includes('permanent')) basePrice = 1999;
  else if (s.includes('ojas ai')) basePrice = 999;
  else if (s.includes('fitness-x') && s.includes('permanent')) basePrice = 2999;
  else if (s.includes('fitness-x')) basePrice = 999;
  else if (s.includes('social media') && s.includes('35,000')) basePrice = 35000;
  else if (s.includes('social media') && s.includes('22,000')) basePrice = 22000;
  else if (s.includes('social media')) basePrice = 12000;
  else if (s.includes('email') && s.includes('25,000')) basePrice = 25000;
  else if (s.includes('email') && s.includes('15,000')) basePrice = 15000;
  else if (s.includes('email')) basePrice = 8000;
  else if (s.includes('website') || s.includes('24,999')) basePrice = 24999;

  let discountAmount = 0;
  if (promoCode) {
    const code = promoCode.toUpperCase();
    if (code.includes('20') || code.includes('SPECIAL20') || code.includes('WHEEL20')) {
      discountAmount = Math.round((basePrice * 20) / 100);
    } else if (code.includes('10') || code.includes('QUIZ10')) {
      discountAmount = Math.round((basePrice * 10) / 100);
    } else if (code.includes('1000') || code.includes('FLAT1000')) {
      discountAmount = 1000;
    }
  }

  const finalTotal = Math.max(0, basePrice - discountAmount);
  return { basePrice, discountAmount, finalTotal };
}

/**
 * Core business logic for processing an enquiry
 */
export function processEnquirySubmission(
  payload: EnquiryPayload,
  clientIp = '127.0.0.1'
): { statusCode: number; response: EnquiryResponse } {
  cleanupStaleIdempotency();
  // 1. Rate Limiting Check (Max 10 per 5 mins per IP)
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const ipRequests = rateLimitStore.get(clientIp) || [];
  const validRequests = ipRequests.filter(ts => now - ts < windowMs);

  if (validRequests.length >= 10) {
    return {
      statusCode: 429,
      response: {
        success: false,
        status: 'rate_limited',
        message: 'Too many enquiry requests. Please try again after a few minutes.'
      }
    };
  }
  validRequests.push(now);
  rateLimitStore.set(clientIp, validRequests);

  // 2. Idempotency Check
  if (payload.idempotencyToken && idempotencyStore.has(payload.idempotencyToken)) {
    const cached = idempotencyStore.get(payload.idempotencyToken)!;
    return {
      statusCode: 200,
      response: {
        ...cached,
        isDuplicate: true
      }
    };
  }

  // 3. Validation
  const validationErrors: Partial<Record<keyof EnquiryPayload, string>> = {};

  const name = sanitizeString(payload.name);
  if (!name || name.length < 2) {
    validationErrors.name = 'Full name must be at least 2 characters.';
  }

  const email = sanitizeString(payload.email);
  if (!email || !validateEmail(email)) {
    validationErrors.email = 'Please provide a valid email address (e.g. name@domain.com).';
  }

  const rawPhone = sanitizeString(payload.phone);
  const phoneValidation = validatePhone(rawPhone);
  if (!rawPhone || !phoneValidation.isValid) {
    validationErrors.phone = 'Please provide a valid 10-digit mobile number.';
  }

  const service = sanitizeString(payload.service) || 'Customized Website Development (Offer ₹24,999)';
  const businessType = sanitizeString(payload.businessType) || 'General Business';
  const details = sanitizeString(payload.details);
  const promoCode = sanitizeString(payload.promoCode);

  if (Object.keys(validationErrors).length > 0) {
    return {
      statusCode: 400,
      response: {
        success: false,
        status: 'failed',
        message: 'Validation failed. Please correct the highlighted errors.',
        validationErrors
      }
    };
  }

  // 4. Generate Official Reference and Pricing
  const inquiryId = `MBX-ENQ-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = new Date().toISOString();
  const pricingEstimate = calculateEstimatedPrice(service, promoCode);

  const successResponse: EnquiryResponse = {
    success: true,
    inquiryId,
    status: 'confirmed',
    message: `Enquiry #${inquiryId} submitted successfully to MyBooks executive engineering desk.`,
    timestamp,
    data: {
      name,
      email,
      phone: phoneValidation.normalized,
      businessType,
      service,
      details,
      promoCode: promoCode || undefined,
      pricingEstimate
    }
  };

  // Cache idempotency response if token provided
  if (payload.idempotencyToken) {
    idempotencyStore.set(payload.idempotencyToken, successResponse);
  }

  return {
    statusCode: 200,
    response: successResponse
  };
}
