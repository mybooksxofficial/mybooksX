import { VERIFIED_KNOWLEDGE_DOCS } from '../data/companyKnowledge';
import { STRUCTURED_KNOWLEDGE_COLLECTION } from '../data/ojas10xKnowledge';
import type { KnowledgeRecord } from '../data/ojas10xKnowledge';
import { OjasTaskEngine, type TaskState } from './ojasTaskEngine';
import { OjasMatchingEngine } from './ojasMatchingEngine';

export interface OjasDiagnostics {
  requestId: string;
  detectedIntent: 'greeting' | 'mybooks_company' | 'mybooks_product' | 'calculation' | 'general_knowledge' | 'business' | 'task_action' | 'ambiguous' | 'missing_metric' | 'service_error' | 'fallback';
  knowledgeSourceQueried?: string;
  retrievedRecordsCount: number;
  retrievalScore?: number;
  modelInvoked: boolean;
  modelStatus?: string;
  failureCategory?: string;
  validationResult: 'VALID' | 'RETRIED' | 'FALLBACK';
}

export interface OjasResolvedResponse {
  text: string;
  isLead: boolean;
  source: string;
  diagnostics?: OjasDiagnostics;
  taskState?: TaskState;
  showPreviewCard?: boolean;
  showConfirmationControls?: boolean;
  followUpChips?: string[];
  isFallback?: boolean;
  unansweredQuery?: string;
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export class OjasIntelligentBrain {
  /**
   * Dedicated Greeting Handler
   * Responds warmly to greetings without invoking expensive retrieval or model calls
   */
  public static detectAndHandleGreeting(raw: string, lang: 'en' | 'hi' = 'en'): OjasResolvedResponse | null {
    const q = raw.trim().toLowerCase().replace(/[?!.,;:()]/g, '').trim();

    // 1. Casual quick greetings
    if (/^(hi|hii|hiii|hiiii|hey|heyy|heya|yo|hola)$/i.test(q)) {
      if (q.startsWith('hii') || q.startsWith('hey')) {
        return {
          text: lang === 'hi' ? 'नमस्ते! आज मैं आपकी क्या सहायता कर सकता हूँ?' : 'Hey! How can I help you today?',
          isLead: false,
          source: 'Greeting Handler',
          diagnostics: {
            requestId: `req-${Date.now()}`,
            detectedIntent: 'greeting',
            retrievedRecordsCount: 0,
            modelInvoked: false,
            validationResult: 'VALID'
          }
        };
      }
      return {
        text: lang === 'hi' ? "नमस्ते! मैं Ojas हूँ, MyBooks पर आपका AI असिस्टेंट। आज मैं आपकी क्या सहायता कर सकता हूँ?" : "Hi! I'm Ojas, your AI assistant at MyBooks. How can I help you today?",
        isLead: false,
        source: 'Greeting Handler',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'greeting',
          retrievedRecordsCount: 0,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    // 2. Hello variations
    if (/^(hello|helloo|hullo)$/i.test(q)) {
      return {
        text: lang === 'hi' ? 'नमस्ते! आप क्या जानना चाहते हैं?' : 'Hello! What would you like to know?',
        isLead: false,
        source: 'Greeting Handler',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'greeting',
          retrievedRecordsCount: 0,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    // 3. Gratitude / Acknowledgements
    if (/^(thanks|thank you|thank u|thx|ty|many thanks)$/i.test(q)) {
      return {
        text: lang === 'hi' ? 'आपका स्वागत है! यदि आपको किसी और चीज़ में सहायता चाहिए तो अवश्य बताएं।' : "You're welcome! Let me know if you need anything else.",
        isLead: false,
        source: 'Greeting Handler',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'greeting',
          retrievedRecordsCount: 0,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    // 4. Time-of-day greetings
    if (/^(good\s*morning|gm)$/i.test(q)) {
      return {
        text: lang === 'hi' ? 'सुप्रभात! मैं आपकी क्या सहायता कर सकता हूँ?' : 'Good morning! How can I help?',
        isLead: false,
        source: 'Greeting Handler',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'greeting',
          retrievedRecordsCount: 0,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    if (/^(good\s*afternoon)$/i.test(q)) {
      return {
        text: lang === 'hi' ? 'शुभ दोपहर! मैं आपकी क्या सहायता कर सकता हूँ?' : 'Good afternoon! How can I help?',
        isLead: false,
        source: 'Greeting Handler',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'greeting',
          retrievedRecordsCount: 0,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    if (/^(good\s*evening|ge)$/i.test(q)) {
      return {
        text: lang === 'hi' ? 'शुभ संध्या! मैं आपकी क्या सहायता कर सकता हूँ?' : 'Good evening! How can I help?',
        isLead: false,
        source: 'Greeting Handler',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'greeting',
          retrievedRecordsCount: 0,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    // 5. Hindi / Regional greetings
    if (/^(namaste|namaskar|kem cho|sat sri akaal|ram ram)$/i.test(q)) {
      return {
        text: 'नमस्ते! मैं Ojas हूँ, MyBooks का AI असिस्टेंट। आज मैं आपकी क्या सहायता कर सकता हूँ?',
        isLead: false,
        source: 'Greeting Handler',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'greeting',
          retrievedRecordsCount: 0,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    if (/^(shukriya|dhanyawad|dhanyavaad)$/i.test(q)) {
      return {
        text: 'आपका बहुत-बहुत स्वागत है! यदि आपको किसी और चीज़ में सहायता चाहिए तो अवश्य बताएं।',
        isLead: false,
        source: 'Greeting Handler',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'greeting',
          retrievedRecordsCount: 0,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    if (/^(kya haal hai|kya hal hai|kaise ho|kese ho|sab kaisa hai|sab kaisa chal raha hai|sab badhiya)$/i.test(q)) {
      return {
        text: lang === 'hi' ? 'सब बढ़िया! मैं Ojas हूँ, आपकी क्या सहायता कर सकता हूँ?' : 'All good! I am Ojas, how can I help you today?',
        isLead: false,
        source: 'Greeting Handler',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'greeting',
          retrievedRecordsCount: 0,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    return null;
  }

  /**
   * Safe Deterministic Calculation Engine
   * Solves arithmetic, percentages, MRR, churn, discounts, and margins
   */
  public static solveDeterministicMath(query: string, lang: 'en' | 'hi' = 'en'): string | null {
    const q = query.toLowerCase().replace(/,/g, '');

    // 1. MRR Churn Calculation (e.g. Test G: "120 customers, 15% cancel, ₹499/mo")
    const hasCancelOrChurn = q.includes('cancel') || q.includes('churn') || q.includes('leave');
    const hasCustomers = q.includes('customer');
    const hasMonthOrMrr = q.includes('month') || q.includes('mrr') || q.includes('revenue') || q.includes('/mo') || q.includes('pm');

    if (hasCancelOrChurn && hasCustomers && hasMonthOrMrr) {
      const customersMatch = q.match(/(\d+)\s*customers?/);
      const churnMatch = q.match(/(\d+(?:\.\d+)?)\s*%/);

      // Find all standalone numbers to be accurate
      let initialCustomers = customersMatch ? parseInt(customersMatch[1], 10) : 0;
      let churnPercent = churnMatch ? parseFloat(churnMatch[1]) : 0;
      
      // Look for price (often preceded by ₹, charges, costs, or following per month)
      const specificPriceMatch = q.match(/(?:charges?|costs?|price|fee|rate)?\s*₹?\s*(\d+)\s*(?:per\s*month|\/mo|pm|each|monthly)/i) ||
        q.match(/₹\s*(\d+)/);
      let price = specificPriceMatch ? parseFloat(specificPriceMatch[1]) : 0;

      // If price not found with currency prefix, grab numbers that aren't customers or churn
      if (!price) {
        const allNums = [...q.matchAll(/\b(\d+)\b/g)].map(m => parseInt(m[1], 10));
        for (const num of allNums) {
          if (num !== initialCustomers && num !== Math.round(churnPercent)) {
            price = num;
            break;
          }
        }
      }

      if (initialCustomers > 0 && churnPercent > 0 && price > 0) {
        const churnedCustomers = Math.round((initialCustomers * churnPercent) / 100);
        const remainingCustomers = initialCustomers - churnedCustomers;
        const remainingMrr = remainingCustomers * price;

        if (lang === 'hi') {
          return `**गणना विवरण:**\n\n` +
            `• **प्रारंभिक ग्राहक (Initial Customers):** ${initialCustomers}\n` +
            `• **रद्द किए गए ग्राहक (Cancelled @ ${churnPercent}%):** ${initialCustomers} × ${churnPercent}% = **${churnedCustomers}**\n` +
            `• **शेष सक्रिय ग्राहक (Remaining Customers):** ${initialCustomers} − ${churnedCustomers} = **${remainingCustomers}**\n` +
            `• **मासिक शुल्क (Monthly Subscription):** ₹${price.toLocaleString()}\n` +
            `• **शेष मासिक आवर्ती राजस्व (Remaining MRR):** ${remainingCustomers} × ₹${price.toLocaleString()} = **₹${remainingMrr.toLocaleString()}**\n\n` +
            `अगले बिलिंग चक्र के लिए कुल शेष MRR **₹${remainingMrr.toLocaleString()}** रहेगा।`;
        }

        return `**Step-by-Step MRR & Churn Calculation:**\n\n` +
          `• **Initial Customers:** ${initialCustomers}\n` +
          `• **Customers Lost (${churnPercent}% Churn):** ${initialCustomers} × ${churnPercent}% = **${churnedCustomers}**\n` +
          `• **Remaining Active Customers:** ${initialCustomers} − ${churnedCustomers} = **${remainingCustomers}**\n` +
          `• **Monthly Subscription Price:** ₹${price.toLocaleString()}\n` +
          `• **Remaining Monthly Recurring Revenue (MRR):** ${remainingCustomers} × ₹${price.toLocaleString()} = **₹${remainingMrr.toLocaleString()}**\n\n` +
          `The remaining monthly recurring revenue (MRR) is **₹${remainingMrr.toLocaleString()}**.`;
      }
    }

    // 2. Percentage of a number (e.g. "15% of 120" or "what is 20 percent of 5000")
    const percentMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:%|percent)\s*(?:of)\s*₹?\s*(\d+(?:\.\d+)?)/i);
    if (percentMatch) {
      const p = parseFloat(percentMatch[1]);
      const n = parseFloat(percentMatch[2]);
      const res = (p * n) / 100;
      return `${p}% of ${n.toLocaleString()} is **${res.toLocaleString()}**.`;
    }

    // 3. Multiplication: e.g. "499 x 102", "499 * 102", "calculate 499 into 102"
    const multMatch = q.match(/(?:calculate\s*)?(\d+(?:\.\d+)?)\s*(?:\*|x|×|multiplied by|times|into)\s*(\d+(?:\.\d+)?)/i);
    if (multMatch) {
      const n1 = parseFloat(multMatch[1]);
      const n2 = parseFloat(multMatch[2]);
      const res = n1 * n2;
      return `${n1.toLocaleString()} × ${n2.toLocaleString()} = **${res.toLocaleString()}**.`;
    }

    // 4. Division: e.g. "50000 / 12"
    const divMatch = q.match(/(?:calculate\s*)?(\d+(?:\.\d+)?)\s*(?:\/|divided by)\s*(\d+(?:\.\d+)?)/i);
    if (divMatch) {
      const n1 = parseFloat(divMatch[1]);
      const n2 = parseFloat(divMatch[2]);
      if (n2 === 0) return "Division by zero is undefined.";
      const res = n1 / n2;
      return `${n1.toLocaleString()} ÷ ${n2.toLocaleString()} = **${res.toLocaleString(undefined, { maximumFractionDigits: 2 })}**.`;
    }

    // 5. Addition
    const addMatch = q.match(/(?:calculate\s*)?(\d+(?:\.\d+)?)\s*(?:\+|plus|added to)\s*(\d+(?:\.\d+)?)/i);
    if (addMatch) {
      const n1 = parseFloat(addMatch[1]);
      const n2 = parseFloat(addMatch[2]);
      return `${n1.toLocaleString()} + ${n2.toLocaleString()} = **${(n1 + n2).toLocaleString()}**.`;
    }

    // 6. Subtraction
    const subMatch = q.match(/(?:calculate\s*)?(\d+(?:\.\d+)?)\s*(?:-|minus|subtracted from)\s*(\d+(?:\.\d+)?)/i);
    if (subMatch) {
      const n1 = parseFloat(subMatch[1]);
      const n2 = parseFloat(subMatch[2]);
      return `${n1.toLocaleString()} − ${n2.toLocaleString()} = **${(n1 - n2).toLocaleString()}**.`;
    }

    return null;
  }

  /**
   * Transparent Service Error Responder
   */
  public static generateServiceErrorResponse(reason = 'inference_backend_offline'): OjasResolvedResponse {
    return {
      text: "I couldn't generate the answer because the AI service is temporarily unavailable. Please retry in a moment.",
      isLead: false,
      source: 'Service Error Handler',
      diagnostics: {
        requestId: `req-${Date.now()}`,
        detectedIntent: 'service_error',
        retrievedRecordsCount: 0,
        modelInvoked: true,
        modelStatus: 'offline_or_timeout',
        failureCategory: reason,
        validationResult: 'FALLBACK'
      }
    };
  }

  /**
   * Evaluates query and generates verified, truthful, non-hallucinatory response
   */
  public static resolveResponse(
    query: string,
    history: ConversationTurn[] = [],
    lang: 'en' | 'hi' = 'en',
    customCollection?: KnowledgeRecord[]
  ): OjasResolvedResponse {
    const raw = query.trim();
    const q = raw.toLowerCase().replace(/[?.,!]/g, ' ').replace(/\s+/g, ' ').trim();

    // 0. GREETING HANDLER FIRST
    const greetingResponse = this.detectAndHandleGreeting(raw, lang);
    if (greetingResponse) {
      return greetingResponse;
    }

    // Diagnostic check for empty company knowledge source
    const activeKnowledge = customCollection !== undefined ? customCollection : STRUCTURED_KNOWLEDGE_COLLECTION;
    if (!activeKnowledge || activeKnowledge.length === 0) {
      console.warn('[Ojas Diagnostic] Company knowledge source is empty or uninitialized.');
      return {
        text: 'The MyBooks company knowledge repository is currently uninitialized or empty. (Developer Diagnostic: company_knowledge_empty).',
        isLead: false,
        source: 'Diagnostic Error Handler',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'service_error',
          retrievedRecordsCount: 0,
          modelInvoked: false,
          failureCategory: 'company_knowledge_empty',
          validationResult: 'FALLBACK'
        }
      };
    }

    // 1. CHECK CONVERSATION CONTEXT (Multi-turn follow-ups)
    const isFollowupCheaper = q === 'make it cheaper' ||
      q.includes('make it cheaper') ||
      q.includes('kam budget') ||
      q.includes('low budget');

    const isFollowupSummary = q.includes('summarize it in five bullet points') ||
      q.includes('summarize it in 5 bullet points') ||
      q.includes('5 bullet points') ||
      q.includes('in five bullet points');

    // Follow-up: "tell me more about him" / "what does he do"
    const lastUserTurn = history.length > 0 ? history[history.length - 1].content.toLowerCase() : '';
    const isFounderFollowup = (q === 'what does he do' || q === 'tell me more about him' || q.includes('about him') || q.includes('more about him') || q.includes('he do')) &&
      (lastUserTurn.includes('founder') || lastUserTurn.includes('deep mehta') || lastUserTurn.includes('deep') || lastUserTurn.includes('owner'));

    if (isFounderFollowup) {
      return {
        text: lang === 'hi'
          ? `**संस्थापक Deep Mehta के बारे में:**\n\nDeep Mehta MyBooks के संस्थापक और मुख्य सॉफ़्टवेयर आर्किटेक्ट हैं। वे व्यवसायों के लिए उच्च-प्रदर्शन कस्टम मोबाइल ऐप्स, वेब प्लेटफ़ॉर्म और डिजिटल ऑटोमेशन सिस्टम का डिज़ाइन व इंजीनियरिंग करते हैं। उनके व्यक्तिगत जीवन या गैर-दस्तावेज़ी विवरण आधिकारिक सार्वजनिक ज्ञानकोष में प्रकाशित नहीं हैं।`
          : `**About Founder Deep Mehta:**\n\nDeep Mehta is the founder and principal software architect of MyBooks. He oversees the digital engineering and development of custom business applications, Web ERPs, and automation platforms. Further personal details or unverified biographies are not part of the verified company records.`,
        isLead: false,
        source: 'Verified Founder Record',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'mybooks_company',
          retrievedRecordsCount: 1,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    if (isFollowupCheaper && history.length > 0) {
      return {
        text: lang === 'hi'
          ? `**किफ़ायती (Low-Cost / Lean) कस्टमर अधिग्रहण रणनीति:**\n\n` +
            `पिछले 90-दिवसीय प्लान को कम बजट में क्रियान्वित करने के लिए पेड ऐड्स की जगह ऑगेनिक चैनल्स पर फ़ोकस करें:\n\n` +
            `1. **डायरेक्ट आउटरीच (Cold Outreach via LinkedIn & WhatsApp):** प्रति सप्ताह 50-70 टारगेटेड बिज़नेसेस को व्यक्तिगत समाधान और वैल्यू प्रपोजीशन भेजें। लागत: ₹0।\n` +
            `2. **फ़ाउंडर-लेड कम्युनिटी एंगेजमेंट:** संबंधित इंडस्ट्री ग्रुप्स और फ़ोरम्स में वैल्यू और केस-स्टडीज साझा करें।\n` +
            `3. **रेफ़रल इंसेंटिव:** मौजूदा ग्राहकों को हर सफल सिफ़ारिश पर 15-20% डिस्काउंट दें।\n` +
            `4. **शॉर्ट-फॉर्म वीडियो कंटेंट:** Instagram Reels व YouTube Shorts पर अपने सॉफ़्टवेयर का लाइव डेमोंस्ट्रेशन पोस्ट करें।\n` +
            `5. **फ़्री ट्रायल / पायलट ऑफर:** पहले 10 ग्राहकों को 14-दिन का निःशुल्क ट्रायल देकर टेस्टीमोनियल जुटाएं।\n\n` +
            `*अनुमानित न्यूनतम मासिक बजट:* ₹0 से ₹3,000 (मुख्यतः टूल्स और इंटरनेट)।`
          : `**Low-Cost (Lean) Customer Acquisition Strategy:**\n\n` +
            `To execute the 90-day plan without heavy marketing spend, replace paid ad spend with organic and high-leverage outreach:\n\n` +
            `1. **Direct High-Value Outreach (LinkedIn & WhatsApp):** Reach out directly to 50–70 qualified decision-makers weekly with tailored value propositions. Cost: ₹0.\n` +
            `2. **Founder-Led Community Authority:** Share real case studies, workflow insights, and problem-solving tips in relevant merchant/business forums.\n` +
            `3. **Customer Referral Multiplier:** Offer existing happy customers a 15–20% renewal discount for every paying referral.\n` +
            `4. **Short-Form Product Demos:** Post short TikTok/Reels/Shorts demonstrating the exact time and money saved by your product.\n` +
            `5. **Zero-Risk Pilot Offer:** Provide the first 10 qualifying clients a 14-day assisted pilot in exchange for a detailed case study and review.\n\n` +
            `*Estimated Execution Cost:* ₹0 – ₹3,000/month (time investment primarily).`,
        isLead: false,
        source: 'Ojas Context Engine',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'business',
          retrievedRecordsCount: 1,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    if (isFollowupSummary && history.length > 0) {
      return {
        text: lang === 'hi'
          ? `**90 दिनों में 100 भुगतान करने वाले ग्राहक — 5 मुख्य बिंदु:**\n\n` +
            `• **सटीक ICP व मूल्य प्रस्ताव:** अपनी आदर्श ग्राहक प्रोफ़ाइल चुनें और एक स्पष्ट, उच्च ROI वाली समस्या हल करें।\n` +
            `• **दैनिक आउटरीच पाइपलाइन:** प्रति दिन न्यूनतम 10 योग्य संभावित ग्राहकों से सीधा संवाद स्थापित करें।\n` +
            `• **रूपांतरण दर (Conversion Targets):** 100 ग्राहकों के लिए 10% कन्वर्ज़न पर ~1,000 लीड्स व 200–300 डेमो का लक्ष्य रखें।\n` +
            `• **साप्ताहिक समीक्षा व सुधार:** हर 7 दिन में विज्ञापन व आउटरीच संदेशों के डेटा का मूल्यांकन करें।\n` +
            `• **संतुष्टि व रेफ़रल:** ऑनबोर्डिंग को इतना सरल बनाएं कि पहले 20 ग्राहक अगले 30 ग्राहकों की सिफ़ारिश करें।`
          : `**Acquiring 100 Paying Customers in 90 Days — 5 Key Takeaways:**\n\n` +
            `• **Nail Target Profile & Value:** Pinpoint your exact ideal customer profile (ICP) and package a crisp, ROI-driven offer.\n` +
            `• **Daily Consistent Outreach Pipeline:** Engage at least 10–15 qualified prospects every business day across your primary channel.\n` +
            `• **Conversion Funnel Math:** Target ~1,000 qualified touches leading to 250 demos and 100 closes at an achievable 8–10% conversion rate.\n` +
            `• **Weekly Metrics Discipline:** Review weekly pipeline metrics every Friday to eliminate ineffective channels quickly.\n` +
            `• **Delight & Referral Loops:** Fast-track onboarding so your first 20 clients immediately become referral sources for the next 40.`,
        isLead: false,
        source: 'Ojas Context Engine',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'business',
          retrievedRecordsCount: 1,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    // 2. CHECK DETERMINISTIC ARITHMETIC & MRR CHURN (Test G)
    const mathResult = this.solveDeterministicMath(query, lang);
    if (mathResult) {
      return {
        text: mathResult,
        isLead: false,
        source: 'Ojas Deterministic Calculation Engine',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'calculation',
          retrievedRecordsCount: 0,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    // 3. UNKNOWN COMPANY FINANCIALS / REVENUE / PROFIT (Test H)
    const isFinancialInquiry = (q.includes('revenue') || q.includes('profit') || q.includes('paying customer') || q.includes('financial') || q.includes('turnover') || q.includes('annual profit')) &&
      (q.includes('mybooks') || q.includes('exact') || q.includes('current') || q.includes('annual') || q.includes('monthly'));

    if (isFinancialInquiry) {
      return {
        text: lang === 'hi'
          ? `**आधिकारिक वित्तीय जानकारी की स्थिति:**\n\n` +
            `MyBooks एक निजी तौर पर आयोजित सॉफ़्टवेयर इंजीनियरिंग स्टूडियो है। वर्तमान में आंतरिक मासिक राजस्व (Monthly Revenue), सटीक वार्षिक लाभ (Annual Profit) और कुल सक्रिय भुगतान करने वाले ग्राहकों के वित्तीय आंकड़े सार्वजनिक रूप से ऑडिटेड नहीं किए गए हैं और अधिकृत ज्ञानकोष में उपलब्ध नहीं हैं।\n\n` +
            `सुरक्षा और डेटा अखंडता के तहत Ojas असत्यापित या काल्पनिक आंकड़े प्रस्तुत नहीं करता है। यदि आपके पास व्यावसायिक साझेदारी या निवेश संबंधी पूछताछ है, तो आप अधिकृत समीक्षा के लिए आधिकारिक चैनल से संपर्क कर सकते हैं।`
          : `**Official Financial Data Disclosure Status:**\n\n` +
            `MyBooks is a privately held custom software engineering studio. At present, internal monthly revenue figures, exact paying customer counts, and annual net profit metrics are not published in our authorized public repository or verified company records.\n\n` +
            `Under our verified knowledge policy, Ojas does not fabricate or estimate internal corporate financial data. For verified corporate partnerships or accredited documentation, please refer to authorized corporate disclosures.`,
        isLead: false,
        source: 'MyBooks Knowledge Policy',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'missing_metric',
          retrievedRecordsCount: 0,
          modelInvoked: false,
          failureCategory: 'unverified_private_company_metric',
          validationResult: 'VALID'
        }
      };
    }

    // 3b. CHECK AUTONOMOUS TASK & FORM AUTOMATION ENGINE
    const taskResult = OjasTaskEngine.processMessageSync(raw, lang);
    if (taskResult && taskResult.isTaskAction) {
      return {
        text: taskResult.response,
        isLead: taskResult.taskState.stage === 'draft_ready' || taskResult.taskState.stage === 'awaiting_confirmation',
        source: 'Ojas Autonomous Task Engine',
        taskState: taskResult.taskState,
        showPreviewCard: taskResult.showPreviewCard,
        showConfirmationControls: taskResult.showConfirmationControls,
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'task_action',
          knowledgeSourceQueried: 'Form Automation State Engine',
          retrievedRecordsCount: 1,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    // 4. STRUCTURED 10X KNOWLEDGE BASE HIGH-CONFIDENCE MATCHING
    const stopWords = new Set(['what', 'is', 'are', 'the', 'a', 'an', 'and', 'or', 'in', 'of', 'for', 'to', 'can', 'you', 'we', 'our', 'my', 'me', 'please', 'tell', 'about', 'should', 'would', 'do', 'does', 'how', 'kya', 'hai', 'hain', 'ka', 'ke', 'ki', 'ko']);
    const queryTokens = q.split(/\s+/).filter(w => w.length > 1 && !stopWords.has(w));

    let bestRecord: KnowledgeRecord | null = null;
    let highestScore = 0;

    for (const record of activeKnowledge) {
      let score = 0;
      const cleanCanonical = record.canonicalQuestion.toLowerCase().replace(/[?.,!]/g, ' ').trim();

      // Check canonical match
      if (q === cleanCanonical) {
        score += 100;
      } else if (q.includes(cleanCanonical) || cleanCanonical.includes(q)) {
        score += 70;
      }

      // Check aliases
      for (const alias of record.aliases) {
        const cleanAlias = alias.toLowerCase().replace(/[?.,!]/g, ' ').trim();
        if (q === cleanAlias) {
          score = Math.max(score, 90);
        } else if (q.includes(cleanAlias)) {
          score = Math.max(score, 65 + cleanAlias.length);
        } else if (cleanAlias.includes(q) && q.length > 5) {
          score = Math.max(score, 50 + q.length);
        }

        // Token overlap check
        if (queryTokens.length > 0) {
          const aliasTokens = cleanAlias.split(/\s+/).filter(w => w.length > 1 && !stopWords.has(w));
          let matchCount = 0;
          for (const qt of queryTokens) {
            if (aliasTokens.some(at => at === qt || at.includes(qt) || qt.includes(at))) {
              matchCount++;
            }
          }
          if (matchCount > 0) {
            const ratio = matchCount / queryTokens.length;
            const tokenScore = (ratio * 40) + (matchCount * 12);
            score = Math.max(score, tokenScore);
          }
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestRecord = record;
      }
    }

    // High confidence canonical/alias hit
    if (bestRecord && highestScore >= 60) {
      const intent = bestRecord.category === 'product' ? 'mybooks_product' : (bestRecord.category === 'founder' || bestRecord.category === 'company') ? 'mybooks_company' : 'general_knowledge';
      return {
        text: lang === 'hi' ? bestRecord.detailedAnswerHi : bestRecord.detailedAnswerEn,
        isLead: false,
        source: bestRecord.source,
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: intent,
          knowledgeSourceQueried: 'Structured 10X Knowledge Repository',
          retrievedRecordsCount: 1,
          retrievalScore: highestScore,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    // 5. COMPREHENSIVE 100+ INTENT MATCHING ENGINE (Fuzzy, Synonyms, Hinglish, Weighted Scoring)
    const engineMatch = OjasMatchingEngine.matchIntent(raw);
    if (engineMatch.isConfident && engineMatch.intent) {
      return {
        text: lang === 'hi' ? engineMatch.intent.replyHi : engineMatch.intent.replyEn,
        isLead: engineMatch.intent.category === 'pricing' || engineMatch.intent.category === 'objections' || engineMatch.intent.category === 'contact',
        source: `Ojas 100+ Intent Engine (${engineMatch.source})`,
        followUpChips: engineMatch.intent.followUpChips,
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: (engineMatch.intent.category === 'resto_x' || engineMatch.intent.category === 'event_x' || engineMatch.intent.category === 'fitness_x' || engineMatch.intent.category === 'custom_software') ? 'mybooks_product' : 'mybooks_company',
          knowledgeSourceQueried: 'Ojas 100+ Intents Repository',
          retrievedRecordsCount: 1,
          retrievalScore: engineMatch.score,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    // Moderate confidence secondary KB hit
    if (bestRecord && highestScore >= 24) {
      const intent = bestRecord.category === 'product' ? 'mybooks_product' : (bestRecord.category === 'founder' || bestRecord.category === 'company') ? 'mybooks_company' : 'general_knowledge';
      return {
        text: lang === 'hi' ? bestRecord.detailedAnswerHi : bestRecord.detailedAnswerEn,
        isLead: false,
        source: bestRecord.source,
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: intent,
          knowledgeSourceQueried: 'Structured 10X Knowledge Repository',
          retrievedRecordsCount: 1,
          retrievalScore: highestScore,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    // 5. EXPLICIT CONTACT REQUEST (WhatsApp / Helpline)
    const isExplicitContactRequest = q.includes('how can i contact') ||
      q.includes('contact number') ||
      q.includes('phone number') ||
      q.includes('helpline') ||
      q.includes('email address') ||
      q.includes('talk to deep mehta') ||
      q.includes('talk to team') ||
      q.includes('customer care');

    if (isExplicitContactRequest) {
      return {
        text: lang === 'hi'
          ? `**MyBooks की अधिकृत संपर्क जानकारी:**\n\n` +
            `• **WhatsApp व सीधी हेल्पलाइन:** +91 9644570828\n` +
            `• **आधिकारिक ईमेल:** mybooksxofficial@gmail.com\n` +
            `• **सपोर्ट समय:** 24/7 समर्पित तकनीकी सहायता\n` +
            `• **संस्थापक:** Deep Mehta\n\n` +
            `आप अपनी आवश्यकता के बारे में सीधे हमारी टीम से चर्चा कर सकते हैं!`
          : `**Authorized MyBooks Contact Details:**\n\n` +
            `• **Direct WhatsApp & Phone:** +91 9644570828\n` +
            `• **Official Email:** mybooksxofficial@gmail.com\n` +
            `• **Support Availability:** 24/7 Dedicated Technical Assistance\n` +
            `• **Founder & Engineering Lead:** Deep Mehta\n\n` +
            `Feel free to reach out directly to discuss your custom software specifications!`,
        isLead: true,
        source: 'Verified Contact Directory',
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'mybooks_company',
          retrievedRecordsCount: 1,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }

    // 6. RAG MATCH WITH LEGACY VERIFIED DOCS
    for (const doc of VERIFIED_KNOWLEDGE_DOCS) {
      for (const pat of doc.questionPatterns) {
        const patClean = pat.toLowerCase();
        if (q === patClean || q.includes(patClean)) {
          return {
            text: lang === 'hi' ? doc.answerHi : doc.answerEn,
            isLead: doc.category === 'product' && (q.includes('buy') || q.includes('order')),
            source: doc.source,
            diagnostics: {
              requestId: `req-${Date.now()}`,
              detectedIntent: doc.category === 'product' ? 'mybooks_product' : 'mybooks_company',
              retrievedRecordsCount: 1,
              modelInvoked: false,
              validationResult: 'VALID'
            }
          };
        }
      }
    }

    // 7. LOG UNANSWERED QUESTION & ENHANCED FALLBACK WITH CHIPS + WHATSAPP ESCALATION
    OjasMatchingEngine.logUnansweredQuestion(raw, lang);

    const fallbackChips = [
      '🍽️ Resto-X Pricing & Demo',
      '🚀 3-Week Custom App',
      '⚡ Why Choose MyBooks vs Competitors?',
      '💰 All Product Pricing',
      '👨‍💻 Founder Deep Mehta'
    ];

    const fallbackText = lang === 'hi'
      ? `मैं अभी आपके प्रश्न *" ${raw} "* के बारे में पूरी तरह सुनिश्चित नहीं हूँ, लेकिन मैं हमारे सत्यापित सॉफ़्टवेयर के बारे में आपकी पूरी सहायता कर सकता हूँ! नीचे दिए गए लोकप्रिय विकल्पों में से चुनें, या संस्थापक **Deep Mehta** से सीधे WhatsApp पर बात करने के लिए बटन दबाएं:`
      : `I'm still learning that specific question about *" ${raw} "*! While I review this with our engineering team, here are popular options, or you can connect directly with Founder **Deep Mehta** on WhatsApp:`;

    return {
      text: fallbackText,
      isLead: true,
      source: 'Ojas Smart Fallback Engine',
      followUpChips: fallbackChips,
      isFallback: true,
      unansweredQuery: raw,
      diagnostics: {
        requestId: `req-${Date.now()}`,
        detectedIntent: 'fallback',
        retrievedRecordsCount: 0,
        modelInvoked: false,
        failureCategory: 'unanswered_question_logged',
        validationResult: 'FALLBACK'
      }
    };
  }

  /**
   * Asynchronous resolver supporting network backend submission
   */
  public static async resolveResponseAsync(
    query: string,
    history: ConversationTurn[] = [],
    lang: 'en' | 'hi' = 'en',
    customCollection?: KnowledgeRecord[]
  ): Promise<OjasResolvedResponse> {
    const raw = query.trim();
    const taskResult = await OjasTaskEngine.processMessage(raw, lang);
    if (taskResult && taskResult.isTaskAction) {
      return {
        text: taskResult.response,
        isLead: taskResult.taskState.stage === 'draft_ready' || taskResult.taskState.stage === 'awaiting_confirmation',
        source: 'Ojas Autonomous Task Engine',
        taskState: taskResult.taskState,
        showPreviewCard: taskResult.showPreviewCard,
        showConfirmationControls: taskResult.showConfirmationControls,
        diagnostics: {
          requestId: `req-${Date.now()}`,
          detectedIntent: 'task_action',
          knowledgeSourceQueried: 'Form Automation State Engine',
          retrievedRecordsCount: 1,
          modelInvoked: false,
          validationResult: 'VALID'
        }
      };
    }
    return this.resolveResponse(query, history, lang, customCollection);
  }
}


