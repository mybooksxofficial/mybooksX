/**
 * Ojas Task Engine
 * Autonomous AI agent managing conversational form automation,
 * entity extraction, multi-turn state, safe previews, and confirmed execution.
 */

import { OjasActionTools, AVAILABLE_PRODUCTS, type ProductInfo } from './ojasActionTools';
import { formStateService, type EnquiryFormData } from './formStateService';
import { validateEmail, validatePhone, processEnquirySubmission } from '../server/enquiryHandler';

export type TaskStage =
  | 'idle'
  | 'collecting_information'
  | 'draft_ready'
  | 'awaiting_confirmation'
  | 'submitting'
  | 'submitted'
  | 'failed'
  | 'cancelled';

export interface TaskState {
  taskId: string;
  stage: TaskStage;
  targetProduct: ProductInfo | null;
  draft: EnquiryFormData;
  missingFields: string[];
  validationErrors: Partial<Record<keyof EnquiryFormData, string>>;
  hasUserReviewedPreview: boolean;
  confirmationRequested: boolean;
  submissionResult?: {
    success: boolean;
    inquiryId?: string;
    message: string;
    timestamp?: string;
  };
}

export interface TaskEngineResult {
  isTaskAction: boolean;
  response: string;
  taskState: TaskState;
  showPreviewCard?: boolean;
  showConfirmationControls?: boolean;
}

export class OjasTaskEngine {
  private static activeTask: TaskState = {
    taskId: `task-${Date.now()}`,
    stage: 'idle',
    targetProduct: null,
    draft: formStateService.getData(),
    missingFields: ['name', 'phone', 'email'],
    validationErrors: {},
    hasUserReviewedPreview: false,
    confirmationRequested: false
  };

  public static getActiveTask(): TaskState {
    return {
      ...this.activeTask,
      draft: formStateService.getData()
    };
  }

  public static resetTask(): void {
    this.activeTask = {
      taskId: `task-${Date.now()}`,
      stage: 'idle',
      targetProduct: null,
      draft: formStateService.getData(),
      missingFields: ['name', 'phone', 'email'],
      validationErrors: {},
      hasUserReviewedPreview: false,
      confirmationRequested: false
    };
    formStateService.clear();
  }

  /**
   * Primary entry point: process user message through task pipeline
   */
  public static async processMessage(query: string, lang: 'en' | 'hi' = 'en'): Promise<TaskEngineResult | null> {
    const rawLower = query.toLowerCase().trim();

    // 1. Check if user is canceling active task
    if (this.isCancellationIntent(rawLower)) {
      OjasActionTools.cancelEnquiry();
      this.activeTask.stage = 'cancelled';
      const response = lang === 'hi'
        ? "पूछताछ (Enquiry) रद्द कर दी गई है और फ़ॉर्म साफ़ कर दिया गया है। यदि आपको किसी अन्य सेवा या जानकारी की आवश्यकता हो तो अवश्य बताएं!"
        : "The enquiry draft has been cancelled and the form has been cleared. Let me know if you would like help with anything else!";
      return {
        isTaskAction: true,
        response,
        taskState: this.getActiveTask()
      };
    }

    // 1b. Check if user is asking for submission status ("Tell me whether the submission succeeded.")
    if (
      rawLower.includes('whether the submission succeeded') ||
      rawLower.includes('submission succeeded') ||
      rawLower.includes('did it succeed') ||
      rawLower.includes('submission status') ||
      rawLower.includes('status of submission') ||
      rawLower.includes('status of my enquiry')
    ) {
      const lastResult = this.activeTask.submissionResult || formStateService.getLastSubmissionResult();
      if (lastResult && lastResult.success && lastResult.inquiryId) {
        const response = lang === 'hi'
          ? `✅ **सबमिशन सफल रहा है!**\n\nआपकी पूछताछ संदर्भ संख्या \`${lastResult.inquiryId}\` के तहत MyBooks इंजीनियरिंग डेस्क पर दर्ज है।`
          : `✅ **Yes, your submission succeeded!**\n\nYour enquiry has been successfully registered with MyBooks under Reference ID \`${lastResult.inquiryId}\` (${lastResult.timestamp || 'Recorded'}). Founder Deep Mehta and our engineering architects have received your request.`;
        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask()
        };
      } else {
        const response = lang === 'hi'
          ? `वर्तमान सत्र में अभी तक कोई सफल सबमिशन दर्ज नहीं हुआ है। जब आप चाहें, मुझे पूछताछ तैयार या सबमिट करने के लिए कह सकते हैं!`
          : `No confirmed submission has been recorded in the current session yet. You can ask me to prepare or submit an enquiry whenever you are ready!`;
        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask()
        };
      }
    }

    // 1c. Check if user asks "Show me [Product]" (e.g. "Show me Resto-X.")
    if (rawLower.startsWith('show me ') || rawLower.startsWith('show ')) {
      const prod = this.detectProduct(rawLower);
      if (prod) {
        formStateService.triggerHighlightAndScroll();
        const response = `Here is **${prod.name}**!\n\n` +
          `• **Pricing:** ${prod.pricingSummary}\n` +
          `• **Capabilities:**\n${prod.keyFeatures.map(f => `  - ${f}`).join('\n')}\n\n` +
          `I have also navigated you to the solution form. Would you like me to prepare an official quotation enquiry for your business?`;
        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask()
        };
      }
    }

    // 1c-2. Check "Book me something" or "Book something"
    if (rawLower.includes('book me something') || rawLower === 'book something' || rawLower === 'book me') {
      formStateService.triggerHighlightAndScroll();
      this.activeTask.stage = 'collecting_information';
      this.activeTask.targetProduct = AVAILABLE_PRODUCTS['resto-x'];
      formStateService.updateData({ service: 'Resto-X (Yearly: ₹4,999)' });

      const response = `I would love to prepare a booking or solution enquiry for you!\n\n` +
        `Our flagship products include:\n` +
        `• **Resto-X:** Complete Restaurant POS, Table QR Ordering & KOT Suite (Yearly ₹4,999 or Permanent ₹24,999)\n` +
        `• **Event-X:** Luxury Wedding & Event Companion (Permanent ₹2,999)\n` +
        `• **Custom Mobile Apps & Web ERPs:** Built in 21 days with 100% source code ownership\n\n` +
        `You can tell me your **Business Type** (e.g. restaurant, gym, retail) or provide your **Name, Phone, or Email** (feel free to share whatever you prefer!) to prepare your quotation right away.`;

      return {
        isTaskAction: true,
        response,
        taskState: this.getActiveTask()
      };
    }

    // 1c-3. Check Permanent / Lifetime tier ("permanent", "permnt", "lifetime", "one time")
    if (this.isPermanentTierIntent(rawLower)) {
      formStateService.triggerHighlightAndScroll();
      const draft = formStateService.getData();
      let newService = 'Resto-X (Permanent: ₹24,999)';
      const cur = (draft.service || '').toLowerCase();

      if (cur.includes('resto') && cur.includes('ojas')) {
        newService = 'Resto-X + Ojas AI (Permanent: ₹27,499)';
      } else if (cur.includes('resto')) {
        newService = 'Resto-X (Permanent: ₹24,999)';
      } else if (cur.includes('event')) {
        newService = 'Event-X (Permanent: ₹2,999)';
      } else if (cur.includes('fitness')) {
        newService = 'Fitness-X (Permanent: ₹2,999)';
      } else if (cur.includes('ojas')) {
        newService = 'Ojas AI (Permanent: ₹1,999)';
      } else if (cur.includes('app') || cur.includes('android')) {
        newService = 'Customized Android App Development (Offer ₹29,999)';
      }

      formStateService.updateData({ service: newService });
      if (this.activeTask.stage === 'idle') {
        this.activeTask.stage = 'collecting_information';
        this.activeTask.targetProduct = AVAILABLE_PRODUCTS['resto-x'];
      }
      this.activeTask.hasUserReviewedPreview = false;
      this.activeTask.confirmationRequested = false;

      const validation = formStateService.validate();
      let response = `Selected the **Permanent Lifetime Ownership** tier: **${newService}**!\n\n` +
        `• **Ownership Guarantee:** 100% source code delivered, database ownership, and zero annual subscription renewal fees.\n\n`;

      if (validation.isValid) {
        response += `Your draft is complete! Would you like me to submit your enquiry, or review the preview card?`;
      } else {
        response += `To complete your permanent license quotation, you can share your **Name, Business Type, Phone Number, or Email** (feel free to share whatever you prefer!).`;
      }

      return {
        isTaskAction: true,
        response,
        taskState: this.getActiveTask(),
        showPreviewCard: validation.isValid,
        showConfirmationControls: validation.isValid
      };
    }

    // 1d. Check "Use those details in the enquiry form."
    if (rawLower.includes('use those details') || rawLower.includes('use these details')) {
      formStateService.triggerHighlightAndScroll();
      const preview = OjasActionTools.getEnquiryPreview();
      const response = `I've populated those details in the official enquiry form:\n\n${preview.formattedPreview}\n` +
        (preview.validation.isValid
          ? `Everything looks complete! Would you like me to submit this enquiry now?`
          : `Please provide the remaining missing details to complete the submission.`);
      return {
        isTaskAction: true,
        response,
        taskState: this.getActiveTask(),
        showPreviewCard: true,
        showConfirmationControls: preview.validation.isValid
      };
    }

    // 2. Check if user asks for preview / "check the form before submitting" / "show me the form"
    if (this.isPreviewIntent(rawLower)) {
      formStateService.triggerHighlightAndScroll();
      const preview = OjasActionTools.getEnquiryPreview();
      this.activeTask.hasUserReviewedPreview = true;
      this.activeTask.confirmationRequested = true;
      this.activeTask.stage = preview.validation.isValid ? 'awaiting_confirmation' : 'collecting_information';

      let response = preview.formattedPreview;
      if (preview.validation.isValid) {
        response += `\nWould you like me to submit this enquiry to the MyBooks engineering desk now? Please confirm to proceed, or let me know if you want to change any details.`;
      } else {
        response += `\nPlease provide the missing details so we can complete and verify your quotation estimate.`;
      }

      return {
        isTaskAction: true,
        response,
        taskState: this.getActiveTask(),
        showPreviewCard: true,
        showConfirmationControls: preview.validation.isValid
      };
    }

    // 3. Check if user is confirming submission
    if (this.isConfirmationIntent(rawLower)) {
      // Must have valid draft
      const validation = formStateService.validate();
      if (!validation.isValid) {
        const missing = validation.missingFields.join(', ');
        const response = lang === 'hi'
          ? `फ़ॉर्म अभी पूरा नहीं हुआ है। कृपया निम्नलिखित जानकारी प्रदान करें: **${missing}**। उसके बाद हम इसे सबमिट करेंगे।`
          : `We cannot submit yet because required information is missing: **${missing}**. Please share these details first.`;
        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask()
        };
      }

      // If user says "submit it" without having reviewed the preview card, show preview first!
      if (!this.activeTask.hasUserReviewedPreview) {
        this.activeTask.hasUserReviewedPreview = true;
        this.activeTask.confirmationRequested = true;
        this.activeTask.stage = 'awaiting_confirmation';
        const preview = OjasActionTools.getEnquiryPreview();
        const response = `Please review your enquiry before I submit it:\n\n${preview.formattedPreview}\n` +
          `**Please confirm to proceed with official submission.**`;
        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask(),
          showPreviewCard: true,
          showConfirmationControls: true
        };
      }

      // Execute real backend submission
      this.activeTask.stage = 'submitting';
      try {
        const result = await OjasActionTools.submitConfirmedEnquiry();

        if (result.success && result.inquiryId) {
          this.activeTask.stage = 'submitted';
          this.activeTask.submissionResult = {
            success: true,
            inquiryId: result.inquiryId,
            message: result.message,
            timestamp: result.timestamp
          };

          const draft = formStateService.getData();
          const response = lang === 'hi'
            ? `🎉 **पूछताछ सफलतापूर्वक दर्ज की गई!**\n\n` +
              `• **संदर्भ संख्या (Reference ID):** \`${result.inquiryId}\`\n` +
              `• **क्लाइंट:** ${draft.name} (${draft.phone})\n` +
              `• **सॉल्यूशन:** ${draft.service}\n` +
              `• **स्टेटस:** MyBooks इंजीनियरिंग टीम को प्राप्त हो गया है।\n\n` +
              `संस्थापक Deep Mehta एवं हमारी टीम आपसे शीघ्र ही संपर्क करेगी। आप नीचे दिए गए बटन से WhatsApp पर भी सीधे इनवॉइस खोल सकते हैं!`
            : `🎉 **Enquiry Submitted Successfully to MyBooks!**\n\n` +
              `• **Reference ID:** \`${result.inquiryId}\`\n` +
              `• **Client:** ${draft.name} (${draft.phone})\n` +
              `• **Selected Solution:** ${draft.service}\n` +
              `• **Status:** Official record confirmed in MyBooks backend.\n\n` +
              `Founder Deep Mehta and the software architecture team have been notified. We will reach out to you shortly!`;

          return {
            isTaskAction: true,
            response,
            taskState: this.getActiveTask()
          };
        } else {
          this.activeTask.stage = 'failed';
          const errMsg = result.message || 'Backend rejected the submission.';
          const response = `⚠️ **Submission Failed:** ${errMsg}\nYour entered details have been preserved. You can edit the fields or retry submission when ready.`;
          return {
            isTaskAction: true,
            response,
            taskState: this.getActiveTask()
          };
        }
      } catch (err: any) {
        this.activeTask.stage = 'failed';
        const response = `⚠️ **Network / Service Error:** Unable to reach MyBooks backend. Your entered details are safely preserved in the form. Please check your connection and retry.`;
        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask()
        };
      }
    }

    // 4. Check for Field Updates & Corrections (e.g. "change phone number to 9876543210")
    const fieldUpdate = this.extractFieldCorrection(query);
    if (fieldUpdate) {
      // Invalidate preview confirmation because draft changed
      this.activeTask.hasUserReviewedPreview = false;
      this.activeTask.confirmationRequested = false;

      OjasActionTools.updateEnquiryDraft(fieldUpdate);
      const validation = formStateService.validate();
      this.activeTask.stage = validation.isValid ? 'draft_ready' : 'collecting_information';

      const updatedKeys = Object.keys(fieldUpdate).join(', ');
      let response = `Updated **${updatedKeys}** in your enquiry draft.\n\n`;

      if (validation.isValid) {
        response += `All required details are now complete! Would you like to review the preview before submitting?`;
      } else {
        response += `We still need: **${validation.missingFields.join(', ')}**. What should I add?`;
      }

      return {
        isTaskAction: true,
        response,
        taskState: this.getActiveTask()
      };
    }

    // 5. Check if message contains new customer entity data (Name, Email, Phone, etc.)
    const extractedEntities = this.extractEntities(query);
    const hasAnyEntity = Object.keys(extractedEntities).length > 0;
    const hasContactDetails = Boolean(extractedEntities.name || extractedEntities.email || extractedEntities.phone);

    // 6. Check if user is initiating an enquiry/booking request
    const isEnquiryStart = this.isEnquiryInitiation(rawLower);

    const shouldEngage = !this.isInformationalQuestion(rawLower) && (
      isEnquiryStart ||
      hasContactDetails ||
      (hasAnyEntity && this.activeTask.stage !== 'idle')
    );

    if (shouldEngage) {
      // Detect product if specified
      const detectedProduct = this.detectProduct(rawLower);
      if (detectedProduct) {
        this.activeTask.targetProduct = detectedProduct;
        formStateService.updateData({ service: detectedProduct.defaultFormServiceValue });
      }

      // If entities provided, update draft
      if (hasAnyEntity) {
        // Any change invalidates prior confirmation
        this.activeTask.hasUserReviewedPreview = false;
        this.activeTask.confirmationRequested = false;
        OjasActionTools.updateEnquiryDraft(extractedEntities);
      }

      // Scroll and highlight form on page
      formStateService.triggerHighlightAndScroll();

      const draft = formStateService.getData();
      const validation = formStateService.validate(draft);

      if (validation.isValid) {
        this.activeTask.stage = 'draft_ready';
        const preview = OjasActionTools.getEnquiryPreview();
        const response = (isEnquiryStart && !hasAnyEntity)
          ? `I've opened the enquiry form for **${this.activeTask.targetProduct?.name || draft.service}**.\n\n` +
            `Please share your Name, Email, and Phone number to prepare your quotation estimate.`
          : `Got it! I have populated your details in the official enquiry form:\n\n` +
            `${preview.formattedPreview}\n` +
            `Would you like me to submit this enquiry to MyBooks, or would you like to make any changes?`;

        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask(),
          showPreviewCard: true,
          showConfirmationControls: true
        };
      } else {
        this.activeTask.stage = 'collecting_information';
        this.activeTask.missingFields = validation.missingFields;

        const missing = validation.missingFields;
        const missingDesc = missing
          .map(m => (m === 'name' ? 'Full Name' : m === 'email' ? 'Email Address' : m === 'phone' ? 'Phone Number' : m))
          .join(', ');

        const prodName = this.activeTask.targetProduct?.name || 'MyBooks software';
        let response = '';

        if (rawLower.includes('book resto-x') || rawLower.includes('book restox')) {
          response = `**Resto-X** is MyBooks' complete restaurant POS and digital ordering software suite. I will gladly set up your software enquiry and quotation.\n\n`;
        } else if (isEnquiryStart || !hasContactDetails) {
          response = `I'll prepare the enquiry form for **${prodName}**.\n\n`;
        } else {
          response = `Thanks! I've added your details to your enquiry draft.\n\n`;
        }

        response += `To complete the form, you can share your **${missingDesc}** (or provide your **Name, Business Type, Phone, or Email** — whichever is convenient for you!).`;

        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask()
        };
      }
    }

    // Not an action task request
    return null;
  }

  /**
   * Synchronous entry point: process user message through task pipeline synchronously
   */
  public static processMessageSync(query: string, lang: 'en' | 'hi' = 'en'): TaskEngineResult | null {
    const rawLower = query.toLowerCase().trim();

    // 1. Cancellation
    if (this.isCancellationIntent(rawLower)) {
      OjasActionTools.cancelEnquiry();
      this.activeTask.stage = 'cancelled';
      const response = lang === 'hi'
        ? "पूछताछ (Enquiry) रद्द कर दी गई है और फ़ॉर्म साफ़ कर दिया गया है। यदि आपको किसी अन्य सेवा या जानकारी की आवश्यकता हो तो अवश्य बताएं!"
        : "The enquiry draft has been cancelled and the form has been cleared. Let me know if you would like help with anything else!";
      return {
        isTaskAction: true,
        response,
        taskState: this.getActiveTask()
      };
    }

    // 1b. Submission status check
    if (
      rawLower.includes('whether the submission succeeded') ||
      rawLower.includes('submission succeeded') ||
      rawLower.includes('did it succeed') ||
      rawLower.includes('submission status') ||
      rawLower.includes('status of submission') ||
      rawLower.includes('status of my enquiry')
    ) {
      const lastResult = this.activeTask.submissionResult || formStateService.getLastSubmissionResult();
      if (lastResult && lastResult.success && lastResult.inquiryId) {
        const response = lang === 'hi'
          ? `✅ **सबमिशन सफल रहा है!**\n\nआपकी पूछताछ संदर्भ संख्या \`${lastResult.inquiryId}\` के तहत MyBooks इंजीनियरिंग डेस्क पर दर्ज है।`
          : `✅ **Yes, your submission succeeded!**\n\nYour enquiry has been successfully registered with MyBooks under Reference ID \`${lastResult.inquiryId}\` (${lastResult.timestamp || 'Recorded'}). Founder Deep Mehta and our engineering architects have received your request.`;
        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask()
        };
      } else {
        const response = lang === 'hi'
          ? `वर्तमान सत्र में अभी तक कोई सफल सबमिशन दर्ज नहीं हुआ है। जब आप चाहें, मुझे पूछताछ तैयार या सबमिट करने के लिए कह सकते हैं!`
          : `No confirmed submission has been recorded in the current session yet. You can ask me to prepare or submit an enquiry whenever you are ready!`;
        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask()
        };
      }
    }

    // 1c. Show me product
    if (rawLower.startsWith('show me ') || rawLower.startsWith('show ')) {
      const prod = this.detectProduct(rawLower);
      if (prod) {
        formStateService.triggerHighlightAndScroll();
        const response = `Here is **${prod.name}**!\n\n` +
          `• **Pricing:** ${prod.pricingSummary}\n` +
          `• **Capabilities:**\n${prod.keyFeatures.map(f => `  - ${f}`).join('\n')}\n\n` +
          `I have also navigated you to the solution form. Would you like me to prepare an official quotation enquiry for your business?`;
        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask()
        };
      }
    }

    // 1c-2. Check "Book me something" or "Book something" (sync)
    if (rawLower.includes('book me something') || rawLower === 'book something' || rawLower === 'book me') {
      formStateService.triggerHighlightAndScroll();
      this.activeTask.stage = 'collecting_information';
      this.activeTask.targetProduct = AVAILABLE_PRODUCTS['resto-x'];
      formStateService.updateData({ service: 'Resto-X (Yearly: ₹4,999)' });

      const response = `I would love to prepare a booking or solution enquiry for you!\n\n` +
        `Our flagship products include:\n` +
        `• **Resto-X:** Complete Restaurant POS, Table QR Ordering & KOT Suite (Yearly ₹4,999 or Permanent ₹24,999)\n` +
        `• **Event-X:** Luxury Wedding & Event Companion (Permanent ₹2,999)\n` +
        `• **Custom Mobile Apps & Web ERPs:** Built in 21 days with 100% source code ownership\n\n` +
        `You can tell me your **Business Type** (e.g. restaurant, gym, retail) or provide your **Name, Phone, or Email** (feel free to share whatever you prefer!) to prepare your quotation right away.`;

      return {
        isTaskAction: true,
        response,
        taskState: this.getActiveTask()
      };
    }

    // 1c-3. Check Permanent / Lifetime tier (sync)
    if (this.isPermanentTierIntent(rawLower)) {
      formStateService.triggerHighlightAndScroll();
      const draft = formStateService.getData();
      let newService = 'Resto-X (Permanent: ₹24,999)';
      const cur = (draft.service || '').toLowerCase();

      if (cur.includes('resto') && cur.includes('ojas')) {
        newService = 'Resto-X + Ojas AI (Permanent: ₹27,499)';
      } else if (cur.includes('resto')) {
        newService = 'Resto-X (Permanent: ₹24,999)';
      } else if (cur.includes('event')) {
        newService = 'Event-X (Permanent: ₹2,999)';
      } else if (cur.includes('fitness')) {
        newService = 'Fitness-X (Permanent: ₹2,999)';
      } else if (cur.includes('ojas')) {
        newService = 'Ojas AI (Permanent: ₹1,999)';
      } else if (cur.includes('app') || cur.includes('android')) {
        newService = 'Customized Android App Development (Offer ₹29,999)';
      }

      formStateService.updateData({ service: newService });
      if (this.activeTask.stage === 'idle') {
        this.activeTask.stage = 'collecting_information';
        this.activeTask.targetProduct = AVAILABLE_PRODUCTS['resto-x'];
      }
      this.activeTask.hasUserReviewedPreview = false;
      this.activeTask.confirmationRequested = false;

      const validation = formStateService.validate();
      let response = `Selected the **Permanent Lifetime Ownership** tier: **${newService}**!\n\n` +
        `• **Ownership Guarantee:** 100% source code delivered, database ownership, and zero annual subscription renewal fees.\n\n`;

      if (validation.isValid) {
        response += `Your draft is complete! Would you like me to submit your enquiry, or review the preview card?`;
      } else {
        response += `To complete your permanent license quotation, you can share your **Name, Business Type, Phone Number, or Email** (feel free to share whatever you prefer!).`;
      }

      return {
        isTaskAction: true,
        response,
        taskState: this.getActiveTask(),
        showPreviewCard: validation.isValid,
        showConfirmationControls: validation.isValid
      };
    }

    // 1d. Use those details
    if (rawLower.includes('use those details') || rawLower.includes('use these details')) {
      formStateService.triggerHighlightAndScroll();
      const preview = OjasActionTools.getEnquiryPreview();
      const response = `I've populated those details in the official enquiry form:\n\n${preview.formattedPreview}\n` +
        (preview.validation.isValid
          ? `Everything looks complete! Would you like me to submit this enquiry now?`
          : `Please provide the remaining missing details to complete the submission.`);
      return {
        isTaskAction: true,
        response,
        taskState: this.getActiveTask(),
        showPreviewCard: true,
        showConfirmationControls: preview.validation.isValid
      };
    }

    // 2. Preview intent
    if (this.isPreviewIntent(rawLower)) {
      formStateService.triggerHighlightAndScroll();
      const preview = OjasActionTools.getEnquiryPreview();
      this.activeTask.hasUserReviewedPreview = true;
      this.activeTask.confirmationRequested = true;
      this.activeTask.stage = preview.validation.isValid ? 'awaiting_confirmation' : 'collecting_information';

      let response = preview.formattedPreview;
      if (preview.validation.isValid) {
        response += `\nWould you like me to submit this enquiry to the MyBooks engineering desk now? Please confirm to proceed, or let me know if you want to change any details.`;
      } else {
        response += `\nPlease provide the missing details so we can complete and verify your quotation estimate.`;
      }

      return {
        isTaskAction: true,
        response,
        taskState: this.getActiveTask(),
        showPreviewCard: true,
        showConfirmationControls: preview.validation.isValid
      };
    }

    // 3. Confirmation intent
    if (this.isConfirmationIntent(rawLower)) {
      const validation = formStateService.validate();
      if (!validation.isValid) {
        const missing = validation.missingFields.join(', ');
        const response = lang === 'hi'
          ? `फ़ॉर्म अभी पूरा नहीं हुआ है। कृपया निम्नलिखित जानकारी प्रदान करें: **${missing}**। उसके बाद हम इसे सबमिट करेंगे।`
          : `We cannot submit yet because required information is missing: **${missing}**. Please share these details first.`;
        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask()
        };
      }

      if (!this.activeTask.hasUserReviewedPreview) {
        this.activeTask.hasUserReviewedPreview = true;
        this.activeTask.confirmationRequested = true;
        this.activeTask.stage = 'awaiting_confirmation';
        const preview = OjasActionTools.getEnquiryPreview();
        const response = `Please review your enquiry before I submit it:\n\n${preview.formattedPreview}\n` +
          `**Please confirm to proceed with official submission.**`;
        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask(),
          showPreviewCard: true,
          showConfirmationControls: true
        };
      }

      // Synchronous direct submission
      this.activeTask.stage = 'submitting';
      const draft = formStateService.getData();
      const directResult = processEnquirySubmission({
        name: draft.name,
        email: draft.email,
        phone: draft.phone,
        businessType: draft.businessType || 'General Business',
        service: draft.service,
        details: draft.details,
        promoCode: draft.promoCode,
        source: 'ojas_agent'
      });
      const result = directResult.response;

      if (result.success && result.inquiryId) {
        this.activeTask.stage = 'submitted';
        this.activeTask.submissionResult = {
          success: true,
          inquiryId: result.inquiryId,
          message: result.message,
          timestamp: result.timestamp
        };

        const response = lang === 'hi'
          ? `🎉 **पूछताछ सफलतापूर्वक दर्ज की गई!**\n\n` +
            `• **संदर्भ संख्या (Reference ID):** \`${result.inquiryId}\`\n` +
            `• **क्लाइंट:** ${draft.name} (${draft.phone})\n` +
            `• **सॉल्यूशन:** ${draft.service}\n` +
            `• **स्टेटस:** MyBooks इंजीनियरिंग टीम को प्राप्त हो गया है।\n\n` +
            `संस्थापक Deep Mehta एवं हमारी टीम आपसे शीघ्र ही संपर्क करेगी।`
          : `🎉 **Enquiry Submitted Successfully to MyBooks!**\n\n` +
            `• **Reference ID:** \`${result.inquiryId}\`\n` +
            `• **Client:** ${draft.name} (${draft.phone})\n` +
            `• **Selected Solution:** ${draft.service}\n` +
            `• **Status:** Official record confirmed in MyBooks backend.\n\n` +
            `Founder Deep Mehta and the software architecture team have been notified. We will reach out to you shortly!`;

        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask()
        };
      } else {
        this.activeTask.stage = 'failed';
        const errMsg = result.message || 'Backend rejected the submission.';
        const response = `⚠️ **Submission Failed:** ${errMsg}\nYour entered details have been preserved. You can edit the fields or retry submission when ready.`;
        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask()
        };
      }
    }

    // 4. Field corrections
    const fieldUpdate = this.extractFieldCorrection(query);
    if (fieldUpdate) {
      this.activeTask.hasUserReviewedPreview = false;
      this.activeTask.confirmationRequested = false;

      OjasActionTools.updateEnquiryDraft(fieldUpdate);
      const validation = formStateService.validate();
      this.activeTask.stage = validation.isValid ? 'draft_ready' : 'collecting_information';

      const updatedKeys = Object.keys(fieldUpdate).join(', ');
      let response = `Updated **${updatedKeys}** in your enquiry draft.\n\n`;

      if (validation.isValid) {
        response += `All required details are now complete! Would you like to review the preview before submitting?`;
      } else {
        response += `We still need: **${validation.missingFields.join(', ')}**. What should I add?`;
      }

      return {
        isTaskAction: true,
        response,
        taskState: this.getActiveTask()
      };
    }

    // 5. Entities extracted
    const extractedEntities = this.extractEntities(query);
    const hasAnyEntity = Object.keys(extractedEntities).length > 0;
    const hasContactDetails = Boolean(extractedEntities.name || extractedEntities.email || extractedEntities.phone);

    // 6. Enquiry initiation
    const isEnquiryStart = this.isEnquiryInitiation(rawLower);

    const shouldEngage = !this.isInformationalQuestion(rawLower) && (
      isEnquiryStart ||
      hasContactDetails ||
      (hasAnyEntity && this.activeTask.stage !== 'idle')
    );

    if (shouldEngage) {
      const detectedProduct = this.detectProduct(rawLower);
      if (detectedProduct) {
        this.activeTask.targetProduct = detectedProduct;
        formStateService.updateData({ service: detectedProduct.defaultFormServiceValue });
      }

      if (hasAnyEntity) {
        this.activeTask.hasUserReviewedPreview = false;
        this.activeTask.confirmationRequested = false;
        OjasActionTools.updateEnquiryDraft(extractedEntities);
      }

      formStateService.triggerHighlightAndScroll();

      const draft = formStateService.getData();
      const validation = formStateService.validate(draft);

      if (validation.isValid) {
        this.activeTask.stage = 'draft_ready';
        const preview = OjasActionTools.getEnquiryPreview();
        const response = (isEnquiryStart && !hasAnyEntity)
          ? `I've opened the enquiry form for **${this.activeTask.targetProduct?.name || draft.service}**.\n\n` +
            `Please share your Name, Email, and Phone number to prepare your quotation estimate.`
          : `Got it! I have populated your details in the official enquiry form:\n\n` +
            `${preview.formattedPreview}\n` +
            `Would you like me to submit this enquiry to MyBooks, or would you like to make any changes?`;

        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask(),
          showPreviewCard: true,
          showConfirmationControls: true
        };
      } else {
        this.activeTask.stage = 'collecting_information';
        this.activeTask.missingFields = validation.missingFields;

        const missing = validation.missingFields;
        const missingDesc = missing
          .map(m => (m === 'name' ? 'Full Name' : m === 'email' ? 'Email Address' : m === 'phone' ? 'Phone Number' : m))
          .join(', ');

        const prodName = this.activeTask.targetProduct?.name || 'MyBooks software';
        let response = '';

        if (rawLower.includes('book resto-x') || rawLower.includes('book restox')) {
          response = `**Resto-X** is MyBooks' complete restaurant POS and digital ordering software suite. I will gladly set up your software enquiry and quotation.\n\n`;
        } else if (isEnquiryStart || !hasContactDetails) {
          response = `I'll prepare the enquiry form for **${prodName}**.\n\n`;
        } else {
          response = `Thanks! I've added your details to your enquiry draft.\n\n`;
        }

        response += `To complete the form, you can share your **${missingDesc}** (or provide your **Name, Business Type, Phone, or Email** — whichever is convenient for you!).`;

        return {
          isTaskAction: true,
          response,
          taskState: this.getActiveTask()
        };
      }
    }

    return null;
  }

  /**
   * Check if query is an informational or knowledge question rather than a task action
   */
  public static isInformationalQuestion(q: string): boolean {
    const trimmed = q.trim().toLowerCase().replace(/[?!.,]+$/, '');

    // Standalone action words or phrases override informational markers
    const hasExplicitAction =
      trimmed.includes('i want to enquire') ||
      trimmed.includes('enquire about') ||
      trimmed.includes('book resto-x') ||
      trimmed.includes('book me something') ||
      trimmed.includes('book something') ||
      trimmed.includes('book me') ||
      trimmed.includes('permnt') ||
      trimmed.includes('permanent') ||
      trimmed.includes('lifetime') ||
      trimmed.includes('fill the enquiry form') ||
      trimmed.includes('fill enquiry form') ||
      trimmed.includes('fill form') ||
      trimmed.includes('fill in the form') ||
      trimmed.includes('submit it') ||
      trimmed.includes('submit the form') ||
      trimmed.includes('check the form');

    if (hasExplicitAction) return false;

    if (
      trimmed.startsWith('what is') ||
      trimmed.startsWith('what are') ||
      trimmed.startsWith('who is') ||
      trimmed.startsWith('who was') ||
      trimmed.startsWith('who founded') ||
      trimmed.startsWith('who created') ||
      trimmed.startsWith('who owns') ||
      trimmed.startsWith('why should') ||
      trimmed.startsWith('why choose') ||
      trimmed.startsWith('explain') ||
      trimmed.startsWith('tell me about') ||
      trimmed.startsWith('describe') ||
      trimmed.startsWith('how does') ||
      trimmed.startsWith('how do') ||
      trimmed.startsWith('how can i use') ||
      trimmed.startsWith('how to') ||
      trimmed.includes('owener') ||
      trimmed.includes('founder') ||
      trimmed.includes('malik') ||
      trimmed.endsWith('kya hai') ||
      trimmed.endsWith('kya h') ||
      trimmed.endsWith('kon hai') ||
      trimmed.endsWith('kon h') ||
      trimmed.includes('deep learning')
    ) {
      return true;
    }

    return false;
  }

  /**
   * Intent: Is user starting an enquiry or booking?
   */
  private static isEnquiryInitiation(q: string): boolean {
    const lower = q.toLowerCase();

    if (this.isInformationalQuestion(lower)) return false;

    // Check standalone word "book" or "booking" (must NOT be part of "mybooks")
    const words = lower.split(/[^a-z0-9-]+/).filter(Boolean);
    const hasBookWord = words.some(w => (w === 'book' || w === 'booking' || w === 'reserve') && !w.includes('mybooks'));

    return (
      lower.includes('enquire') ||
      lower.includes('inquire') ||
      lower.includes('enquiry') ||
      lower.includes('inquiry') ||
      hasBookWord ||
      lower.includes('permnt') ||
      lower.includes('permanent') ||
      lower.includes('lifetime') ||
      lower.includes('fill the enquiry form') ||
      lower.includes('fill enquiry form') ||
      lower.includes('fill form') ||
      lower.includes('fill in the form') ||
      lower.includes('fill the form') ||
      lower.includes('quote') ||
      lower.includes('quotation') ||
      lower.includes('get quotation') ||
      lower.includes('order resto-x') ||
      lower.includes('buy resto-x') ||
      lower.includes('i want resto-x') ||
      lower.includes('i want event-x') ||
      lower.includes('i want custom') ||
      lower.includes('demo')
    );
  }

  /**
   * Intent: Is user asking for preview or checking the form?
   */
  private static isPreviewIntent(q: string): boolean {
    return (
      q.includes('preview') ||
      q.includes('check the form') ||
      q.includes('check form') ||
      q.includes('show me the enquiry') ||
      q.includes('show me the form') ||
      q.includes('show form') ||
      q.includes('review the form') ||
      q.includes('review draft') ||
      q.includes('show draft')
    );
  }

  /**
   * Intent: Is user confirming submission?
   */
  private static isConfirmationIntent(q: string): boolean {
    const clean = q.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    return (
      clean === 'submit' ||
      clean === 'submit it' ||
      clean === 'submit the form' ||
      clean === 'submit enquiry' ||
      clean.includes('submit after i confirm') ||
      clean.includes('submit the enquiry after i confirm') ||
      clean === 'yes submit' ||
      clean === 'yes please submit' ||
      clean === 'confirm and submit' ||
      clean === 'confirmed' ||
      clean === 'confirm' ||
      clean === 'proceed' ||
      clean === 'send it' ||
      clean === 'send enquiry' ||
      clean === 'haan bhej do' ||
      clean === 'submit kar do'
    );
  }

  /**
   * Intent: Is user cancelling task?
   */
  private static isCancellationIntent(q: string): boolean {
    const clean = q.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    return (
      clean === 'cancel' ||
      clean === 'cancel enquiry' ||
      clean === 'cancel this enquiry' ||
      clean === 'stop' ||
      clean === 'reset form' ||
      clean === 'radd kar do'
    );
  }

  /**
   * Intent: Does query select the Permanent / Lifetime tier?
   */
  public static isPermanentTierIntent(q: string): boolean {
    const clean = q.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    const words = clean.split(' ');
    return (
      clean.includes('permnt') ||
      clean.includes('perman') ||
      clean.includes('permanent') ||
      clean.includes('permenant') ||
      clean.includes('lifetime') ||
      clean.includes('life time') ||
      clean.includes('one time') ||
      clean.includes('full ownership') ||
      words.includes('permnt') ||
      words.includes('perman')
    );
  }

  /**
   * Extract field corrections (e.g. "change my phone number to 9876543210")
   */
  private static extractFieldCorrection(q: string): Partial<EnquiryFormData> | null {
    const raw = q.toLowerCase();

    // 1. Phone correction
    if (raw.includes('phone') || raw.includes('number') || raw.includes('mobile')) {
      if (raw.includes('change') || raw.includes('update') || raw.includes('correct') || raw.includes('set')) {
        const phoneMatch = q.match(/(\+?\d[\d\s-]{8,14}\d)/);
        if (phoneMatch) {
          const val = validatePhone(phoneMatch[1]);
          if (val.isValid) {
            return { phone: val.normalized };
          }
        }
      }
    }

    // 2. Email correction
    if (raw.includes('email')) {
      if (raw.includes('change') || raw.includes('update') || raw.includes('set')) {
        const emailMatch = q.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch && validateEmail(emailMatch[1])) {
          return { email: emailMatch[1] };
        }
      }
    }

    // 3. Name correction
    if (raw.includes('name')) {
      if (raw.includes('change') || raw.includes('update') || raw.includes('set')) {
        const nameMatch = q.match(/(?:name to|name as|name is)\s+([A-Za-z\s]{2,40})/i);
        if (nameMatch) {
          return { name: nameMatch[1].trim() };
        }
      }
    }

    return null;
  }

  /**
   * Extract all entities from a natural-language message
   */
  public static extractEntities(query: string): Partial<EnquiryFormData> {
    const extracted: Partial<EnquiryFormData> = {};

    // 1. Extract Email
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const emailMatch = query.match(emailRegex);
    if (emailMatch && validateEmail(emailMatch[1])) {
      extracted.email = emailMatch[1].trim();
    }

    // 2. Extract Phone
    // Match potential Indian phone sequence (10 digits, or with +91, with spaces/dashes)
    const phoneRegex = /(?:\+?91[\s-]?)?[6-9]\d{9}|\b[6-9]\d{4}[\s-]?\d{5}\b|\b\d{10}\b/;
    const phoneMatch = query.match(phoneRegex);
    if (phoneMatch) {
      const val = validatePhone(phoneMatch[0]);
      if (val.isValid) {
        extracted.phone = val.normalized;
      }
    }

    // 3. Extract Name
    // Pattern A: "My name is Rahul Sharma" / "I am Rahul Sharma" / "name: Rahul Sharma"
    const nameRegexA = /(?:my name is|i am|name is|name[:\s]+)\s*([A-Za-z]+(?:\s+[A-Za-z]+){1,3})/i;
    const matchA = query.match(nameRegexA);
    if (matchA && matchA[1].trim().length > 1) {
      const potentialName = matchA[1].trim();
      // Ensure it doesn't accidentally capture words like "and" or "my"
      if (!['my', 'email', 'phone', 'resto', 'event'].includes(potentialName.toLowerCase())) {
        extracted.name = potentialName;
      }
    }

    // 4. Extract Business Type
    const bizRegex = /(?:for my|business is|company is|running a|store is)\s+([A-Za-z\s]{2,30}?)(?=[,.]|$|and)/i;
    const bizMatch = query.match(bizRegex);
    if (bizMatch && bizMatch[1].trim()) {
      extracted.businessType = bizMatch[1].trim();
    } else {
      if (query.toLowerCase().includes('restaurant') || query.toLowerCase().includes('cafe') || query.toLowerCase().includes('hotel')) {
        extracted.businessType = 'Restaurant / Hospitality';
      } else if (query.toLowerCase().includes('wedding') || query.toLowerCase().includes('event')) {
        extracted.businessType = 'Event & Wedding';
      } else if (query.toLowerCase().includes('gym') || query.toLowerCase().includes('fitness')) {
        extracted.businessType = 'Gym & Fitness';
      }
    }

    // 5. Extract Service if explicitly mentioned with intent or during active form flow
    const isExplicitServiceIntent = 
      query.toLowerCase().includes('for ') ||
      query.toLowerCase().includes('about ') ||
      query.toLowerCase().includes('interested in') ||
      query.toLowerCase().includes('product:') ||
      query.toLowerCase().includes('service:') ||
      query.toLowerCase().includes('want ') ||
      query.toLowerCase().includes('book ') ||
      query.toLowerCase().includes('enquire');

    if (isExplicitServiceIntent || this.activeTask.stage !== 'idle') {
      const prod = this.detectProduct(query.toLowerCase());
      if (prod) {
        extracted.service = prod.defaultFormServiceValue;
      }
    }

    // 6. Extract Details / Notes
    if (query.toLowerCase().includes('requirements:') || query.toLowerCase().includes('notes:')) {
      const notesMatch = query.match(/(?:requirements|notes|details)[:\s]+([^.\n]+)/i);
      if (notesMatch) {
        extracted.details = notesMatch[1].trim();
      }
    }

    return extracted;
  }

  /**
   * Helper: Match product in string
   */
  public static detectProduct(lower: string): ProductInfo | null {
    if (lower.includes('resto-x') || lower.includes('restox') || lower.includes('restaurant pos') || lower.includes('dining')) {
      return AVAILABLE_PRODUCTS['resto-x'];
    }
    if (lower.includes('event-x') || lower.includes('eventx') || lower.includes('wedding')) {
      return AVAILABLE_PRODUCTS['event-x'];
    }
    if (lower.includes('custom app') || lower.includes('android app') || lower.includes('custom mobile')) {
      return AVAILABLE_PRODUCTS['custom-apps'];
    }
    if (lower.includes('fitness-x') || lower.includes('fitnessx') || lower.includes('gym')) {
      return AVAILABLE_PRODUCTS['fitness-x'];
    }
    if (lower.includes('website') || lower.includes('web development')) {
      return AVAILABLE_PRODUCTS['website-development'];
    }
    if (lower.includes('social media') || lower.includes('marketing') || lower.includes('email campaign')) {
      return AVAILABLE_PRODUCTS['digital-growth'];
    }
    return null;
  }
}
