/**
 * Shared Form State Service for MyBooks
 * Provides synchronized, reactive two-way binding between Ojas AI and CustomSolutionForm.
 */

import { validateEmail, validatePhone } from '../server/enquiryHandler';
import { EnquirySubmissionService } from './enquirySubmissionService';
import type { EnquiryResponse } from '../server/enquiryHandler';

export interface EnquiryFormData {
  businessType: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  promoCode: string;
  details: string;
}

export type FormFieldKey = keyof EnquiryFormData;

export interface FormValidationResult {
  isValid: boolean;
  errors: Partial<Record<FormFieldKey, string>>;
  missingFields: FormFieldKey[];
}

type FormListener = (data: EnquiryFormData) => void;
type HighlightListener = () => void;

class FormStateServiceManager {
  private currentData: EnquiryFormData = {
    businessType: '',
    name: '',
    phone: '',
    email: '',
    service: 'Customized Website Development (Offer ₹24,999)',
    promoCode: '',
    details: ''
  };

  private listeners: Set<FormListener> = new Set();
  private highlightListeners: Set<HighlightListener> = new Set();
  private lastSubmissionResult: EnquiryResponse | null = null;

  constructor() {
    // Attempt to restore promo from localStorage if available
    try {
      const savedCode = localStorage.getItem('mybooksx_wheel_code') || localStorage.getItem('mybooksx_quiz_code') || '';
      if (savedCode) {
        this.currentData.promoCode = savedCode;
      }
    } catch {}
  }

  public getData(): EnquiryFormData {
    return { ...this.currentData };
  }

  public updateData(partial: Partial<EnquiryFormData>): void {
    this.currentData = {
      ...this.currentData,
      ...partial
    };
    this.notify();
  }

  public setField<K extends FormFieldKey>(field: K, value: EnquiryFormData[K]): void {
    this.currentData[field] = value;
    this.notify();
  }

  public clear(): void {
    this.currentData = {
      businessType: '',
      name: '',
      phone: '',
      email: '',
      service: 'Customized Website Development (Offer ₹24,999)',
      promoCode: '',
      details: ''
    };
    this.lastSubmissionResult = null;
    this.notify();
  }

  public reset(): void {
    this.clear();
  }

  public subscribe(listener: FormListener): () => void {
    this.listeners.add(listener);
    // Call immediately with current state
    listener(this.getData());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onHighlight(listener: HighlightListener): () => void {
    this.highlightListeners.add(listener);
    return () => {
      this.highlightListeners.delete(listener);
    };
  }

  public triggerHighlightAndScroll(): void {
    for (const hl of this.highlightListeners) {
      try {
        hl();
      } catch {}
    }
    if (typeof document !== 'undefined') {
      const elem = document.getElementById('custom-solution');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  public validate(data = this.currentData): FormValidationResult {
    const errors: Partial<Record<FormFieldKey, string>> = {};
    const missingFields: FormFieldKey[] = [];

    // 1. Name
    if (!data.name || !data.name.trim()) {
      errors.name = 'Full name is required.';
      missingFields.push('name');
    } else if (data.name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    }

    // 2. Email
    if (!data.email || !data.email.trim()) {
      errors.email = 'Email address is required.';
      missingFields.push('email');
    } else if (!validateEmail(data.email)) {
      errors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    // 3. Phone
    if (!data.phone || !data.phone.trim()) {
      errors.phone = 'Phone number is required.';
      missingFields.push('phone');
    } else {
      const phoneCheck = validatePhone(data.phone);
      if (!phoneCheck.isValid) {
        errors.phone = 'Please provide a valid 10-digit mobile number.';
      }
    }

    // 4. Service
    if (!data.service || !data.service.trim()) {
      errors.service = 'Please select a product or service.';
      missingFields.push('service');
    }

    const isValid = Object.keys(errors).length === 0;

    return {
      isValid,
      errors,
      missingFields
    };
  }

  public async submitToBackend(): Promise<EnquiryResponse> {
    const validation = this.validate();
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Cannot submit: draft contains validation errors.',
        validationErrors: validation.errors
      };
    }

    const result = await EnquirySubmissionService.submitEnquiry({
      name: this.currentData.name,
      email: this.currentData.email,
      phone: this.currentData.phone,
      businessType: this.currentData.businessType || 'General Business',
      service: this.currentData.service,
      details: this.currentData.details,
      promoCode: this.currentData.promoCode,
      source: 'ojas_agent'
    });

    this.lastSubmissionResult = result;
    return result;
  }

  public getLastSubmissionResult(): EnquiryResponse | null {
    return this.lastSubmissionResult;
  }

  private notify(): void {
    const data = this.getData();
    for (const listener of this.listeners) {
      try {
        listener(data);
      } catch (e) {
        console.error('Error notifying form listener:', e);
      }
    }
  }
}

export const formStateService = new FormStateServiceManager();
