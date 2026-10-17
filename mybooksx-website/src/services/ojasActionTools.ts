/**
 * Ojas Action Tool Layer
 * Typed, authorized action functions for autonomous execution.
 */

import { formStateService, type EnquiryFormData, type FormValidationResult } from './formStateService';
import type { EnquiryResponse } from '../server/enquiryHandler';

export interface ProductInfo {
  id: string;
  name: string;
  category: 'pos' | 'event' | 'fitness' | 'mobile_app' | 'web' | 'marketing';
  pricingSummary: string;
  keyFeatures: string[];
  workflowType: 'enquiry' | 'quote';
  defaultFormServiceValue: string;
}

export const AVAILABLE_PRODUCTS: Record<string, ProductInfo> = {
  'resto-x': {
    id: 'resto-x',
    name: 'Resto-X Restaurant POS & Dining Suite',
    category: 'pos',
    pricingSummary: '₹4,999/year license OR ₹24,999 Permanent Lifetime ownership (100% source code delivered)',
    keyFeatures: [
      'Table QR digital menu ordering',
      'Live Kitchen Order Ticket (KOT) sync to chef screens',
      'Recipe raw material inventory depletion',
      'Automated GST billing & daily reports',
      'Complimentary Android waiter app & digital ordering'
    ],
    workflowType: 'enquiry',
    defaultFormServiceValue: 'Resto-X (Yearly: ₹4,999)'
  },
  'event-x': {
    id: 'event-x',
    name: 'Event-X Royal Wedding & Ceremony Suite',
    category: 'event',
    pricingSummary: '₹2,999 one-time payment for permanent lifetime access',
    keyFeatures: [
      'Interactive couple timeline & ceremony itinerary',
      'Digital guest RSVP management',
      'Interactive photo vault with live guest uploads',
      'Venue GPS navigation & accommodations map'
    ],
    workflowType: 'enquiry',
    defaultFormServiceValue: 'Event-X (Permanent: ₹2,999)'
  },
  'custom-apps': {
    id: 'custom-apps',
    name: 'Custom Android Applications & Business ERPs',
    category: 'mobile_app',
    pricingSummary: 'Starting at ₹29,999 special launch rate with 100% full source code ownership',
    keyFeatures: [
      'Rapid 3-week (21 days) production delivery',
      '100% full source code, backend APIs, and database ownership',
      'Google Play Store release support',
      'Direct WhatsApp developer communication (+91 9644570828)'
    ],
    workflowType: 'enquiry',
    defaultFormServiceValue: 'Customized Android App Development (Offer ₹29,999)'
  },
  'fitness-x': {
    id: 'fitness-x',
    name: 'Fitness-X Gym & Wellness Manager',
    category: 'fitness',
    pricingSummary: '₹999/year OR ₹2,999 Permanent Lifetime',
    keyFeatures: [
      'Member QR attendance check-in',
      'Automated WhatsApp payment renewal reminders',
      'Trainer scheduling and class booking'
    ],
    workflowType: 'enquiry',
    defaultFormServiceValue: 'Fitness-X (Yearly: ₹999)'
  },
  'website-development': {
    id: 'website-development',
    name: 'Customized Business Website Development',
    category: 'web',
    pricingSummary: 'Special offer ₹24,999 with 100% code ownership',
    keyFeatures: [
      'Fast responsive custom web design',
      'SEO optimization & analytics integration',
      'Custom solution calculator & lead capture forms'
    ],
    workflowType: 'enquiry',
    defaultFormServiceValue: 'Customized Website Development (Offer ₹24,999)'
  },
  'digital-growth': {
    id: 'digital-growth',
    name: 'Digital Growth: Social Media & Email Marketing',
    category: 'marketing',
    pricingSummary: 'Starter packages from ₹8,000/mo (Email) and ₹12,000/mo (Social Media)',
    keyFeatures: [
      'Full monthly content calendar & creatives',
      'Lifecycle email automation & drip sequences',
      'Lead generation campaigns'
    ],
    workflowType: 'enquiry',
    defaultFormServiceValue: 'Social Media Management - Starter (₹12,000/mo)'
  }
};

export class OjasActionTools {
  /**
   * Tool 1: list_available_products
   */
  public static listAvailableProducts(): ProductInfo[] {
    return Object.values(AVAILABLE_PRODUCTS);
  }

  /**
   * Tool 2: get_product_information
   */
  public static getProductInformation(productIdOrName: string): ProductInfo | null {
    const query = productIdOrName.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [key, prod] of Object.entries(AVAILABLE_PRODUCTS)) {
      const cleanKey = key.replace(/[^a-z0-9]/g, '');
      const cleanName = prod.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanKey.includes(query) || query.includes(cleanKey) || cleanName.includes(query)) {
        return prod;
      }
    }
    return null;
  }

  /**
   * Tool 3: start_product_enquiry
   */
  public static startProductEnquiry(targetProductQuery?: string): {
    product: ProductInfo;
    draft: EnquiryFormData;
  } {
    const product = (targetProductQuery ? this.getProductInformation(targetProductQuery) : null) || AVAILABLE_PRODUCTS['resto-x'];
    formStateService.updateData({
      service: product.defaultFormServiceValue
    });
    formStateService.triggerHighlightAndScroll();

    return {
      product,
      draft: formStateService.getData()
    };
  }

  /**
   * Tool 4: update_enquiry_draft
   */
  public static updateEnquiryDraft(partialDraft: Partial<EnquiryFormData>): {
    draft: EnquiryFormData;
    validation: FormValidationResult;
  } {
    formStateService.updateData(partialDraft);
    const draft = formStateService.getData();
    const validation = formStateService.validate(draft);

    return {
      draft,
      validation
    };
  }

  /**
   * Tool 5: validate_enquiry_draft
   */
  public static validateEnquiryDraft(): FormValidationResult {
    return formStateService.validate();
  }

  /**
   * Tool 6: get_enquiry_preview
   */
  public static getEnquiryPreview(): {
    draft: EnquiryFormData;
    validation: FormValidationResult;
    formattedPreview: string;
  } {
    const draft = formStateService.getData();
    const validation = formStateService.validate(draft);

    const formattedPreview =
      `### 📋 Official Enquiry Preview for MyBooks\n\n` +
      `• **Client Name:** ${draft.name || '*(Missing)*'}\n` +
      `• **Email Address:** ${draft.email || '*(Missing)*'}\n` +
      `• **Contact Phone:** ${draft.phone || '*(Missing)*'}\n` +
      `• **Business / Industry:** ${draft.businessType || 'General Business'}\n` +
      `• **Selected Solution:** ${draft.service}\n` +
      (draft.promoCode ? `• **Voucher Applied:** ${draft.promoCode}\n` : '') +
      `• **Requirements:** ${draft.details || 'Standard initial deployment'}\n\n` +
      (validation.isValid
        ? `✅ **All required fields are complete and validated.**\n`
        : `⚠️ **Please provide:** ${validation.missingFields.join(', ')}\n`);

    return {
      draft,
      validation,
      formattedPreview
    };
  }

  /**
   * Tool 7: submit_confirmed_enquiry
   */
  public static async submitConfirmedEnquiry(): Promise<EnquiryResponse> {
    return await formStateService.submitToBackend();
  }

  /**
   * Tool 8: cancel_enquiry
   */
  public static cancelEnquiry(): { success: boolean; message: string } {
    formStateService.clear();
    return {
      success: true,
      message: 'Enquiry draft cancelled and form reset.'
    };
  }
}
