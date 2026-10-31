/**
 * Web Crypto & Security Utilities
 * Works natively in Cloudflare Workers and modern Node.js environments.
 */

// Format buffer to hex string
export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert hex string back to Uint8Array
export function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Constant-time string equality check to prevent timing attacks
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Generate cryptographically secure random salt (16 bytes)
 */
export function generateSalt(): string {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return bufferToHex(salt);
}

/**
 * Hash password using PBKDF2 with SHA-256 and 100,000 iterations
 */
export async function hashPassword(password: string, saltHex: string): Promise<string> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const saltBytes = hexToUint8Array(saltHex);
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes as unknown as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const rawKey = await crypto.subtle.exportKey('raw', derivedKey);
  return bufferToHex(rawKey);
}

/**
 * Verify password against stored hash and salt
 */
export async function verifyPassword(password: string, storedHash: string, saltHex: string): Promise<boolean> {
  const computedHash = await hashPassword(password, saltHex);
  return constantTimeCompare(computedHash, storedHash);
}

/**
 * Generate secure session token (32 bytes = 64 hex characters)
 */
export function generateSessionToken(): string {
  const token = new Uint8Array(32);
  crypto.getRandomValues(token);
  return bufferToHex(token);
}

/**
 * Generate 6-digit numeric email verification code
 */
export function generateVerificationCode(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  // Guarantee 6 digits: 100000 to 999999
  const code = 100000 + (array[0] % 900000);
  return code.toString();
}

/**
 * Generate human-readable, unique Redemption Receipt ID
 * Format: MBX-RDM-XXXX-XXXX
 */
export function generateRedemptionCode(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const part1 = bufferToHex(bytes.subarray(0, 2)).toUpperCase();
  const part2 = bufferToHex(bytes.subarray(2, 4)).toUpperCase();
  const timestampPart = Date.now().toString(36).toUpperCase().slice(-4);
  return `MBX-RDM-${timestampPart}-${part1}${part2}`;
}

/**
 * Generate License Key for approved software rewards
 * Format: APX-XXXX-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(appCode: string): string {
  const prefix = appCode.substring(0, 3).toUpperCase();
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const hex = bufferToHex(bytes).toUpperCase();
  return `${prefix}-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}`;
}

/**
 * Input sanitization utility to prevent XSS and malformed input
 */
export function sanitize(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 2000);
}

/**
 * Base64URL encoding (RFC 7636 for PKCE and OAuth 2.0)
 */
export function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = typeof btoa === 'function' ? btoa(binary) : Buffer.from(bytes).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Generate PKCE Code Verifier (RFC 7636)
 */
export function generateCodeVerifier(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

/**
 * Generate PKCE Code Challenge using SHA-256 (RFC 7636)
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(digest));
}

/**
 * Generate cryptographically secure random state (32 hex characters)
 */
export function generateState(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bufferToHex(bytes);
}

/**
 * Generate cryptographically secure random nonce (32 hex characters)
 */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bufferToHex(bytes);
}

/**
 * Email syntax validation
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(
    email.trim()
  );
}

