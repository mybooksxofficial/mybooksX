/**
 * Deep High-Capacity Intelligence Knowledge Base for Ojas AI
 * Answers general questions, mathematics, technology, company info,
 * founder facts, product specs, pricing, and buy intent without external localhost dependencies.
 */

export interface KnowledgeEntry {
  patterns: string[];
  responseEn: string;
  responseHi: string;
  category: 'identity' | 'founder' | 'pricing' | 'math' | 'tech' | 'process' | 'general' | 'lead';
}

export const DEEP_KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  // 1. Identity & Name questions (Strictly answer assistant's name: Ojas)
  {
    patterns: [
      'what is your name', 'whats your name', 'who are you', 'tell me your name',
      'aapka naam kya hai', 'naam kya hai', 'tumhara naam', 'tum kaun ho', 'what is ojas'
    ],
    responseEn: "My name is Ojas. I am the intelligent AI assistant engineered for MyBooks to help you with software planning, product inquiries, pricing, architecture, and general problem-solving.",
    responseHi: "मेरा नाम Ojas है। मैं MyBooks का इंटेलिजेंट AI असिस्टेंट हूँ, जो सॉफ़्टवेयर प्लानिंग, प्रॉडक्ट इनक्वायरी, प्राइसिंग और समस्या समाधान में आपकी सहायता करता हूँ।",
    category: 'identity'
  },

  // 2. Founder questions (Answer: Deep Mehta is founder of MyBooks)
  {
    patterns: [
      'who is the founder', 'who founded mybooks', 'founder of mybooks', 'founder name',
      'malik kaun hai', 'owner of mybooks', 'deep mehta', 'founder kaun hai', 'who started mybooks'
    ],
    responseEn: "Deep Mehta is the founder of MyBooks.",
    responseHi: "Deep Mehta MyBooks के संस्थापक (Founder) हैं।",
    category: 'founder'
  },

  // 3. Greetings & Casual
  {
    patterns: ['hi', 'hello', 'hey', 'namaste', 'kem cho', 'good morning', 'good evening', 'yo'],
    responseEn: "Hello! I am Ojas. How can I help you and your business today? Feel free to ask about our custom Android apps, Resto-X, pricing, or any technical question!",
    responseHi: "नमस्ते! मैं Ojas हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ? आप मुझसे कस्टम Android ऐप्स, Resto-X, प्राइसिंग या किसी भी तकनीकी सवाल के बारे में पूछ सकते हैं!",
    category: 'general'
  },

  // 4. Mathematics & Calculations
  {
    patterns: ['17 multiplied by 24', '17 * 24', '17x24', '17 into 24', 'multiply 17 and 24'],
    responseEn: "17 multiplied by 24 is **408**.",
    responseHi: "17 गुणा 24 का उत्तर **408** है।",
    category: 'math'
  },

  // 5. Programming & Tech: Python
  {
    patterns: ['explain python', 'what is python', 'python programming', 'python kya hai'],
    responseEn: "**Python** is a high-level, interpreted, general-purpose programming language known for its clean, human-readable syntax. It is widely used in:\n• **Artificial Intelligence & Machine Learning** (PyTorch, TensorFlow)\n• **Backend Web Development** (Django, FastAPI, Flask)\n• **Data Science & Analytics** (Pandas, NumPy)\n• **Automation & Scripting**",
    responseHi: "**Python** एक लोकप्रिय और सरल प्रोग्रामिंग भाषा है। इसे समझना और कोड करना काफ़ी आसान है। इसका मुख्य उपयोग AI/ML, वेब बैकएंड (Django/FastAPI), डेटा साइंस और ऑटोमेशन में होता है।",
    category: 'tech'
  },

  // 6. Programming: JavaScript / React
  {
    patterns: ['what is react', 'explain react', 'javascript', 'frontend framework'],
    responseEn: "**React** is an open-source JavaScript library developed by Meta for building interactive, component-based user interfaces for web and mobile applications with high performance via its Virtual DOM.",
    responseHi: "**React** एक मॉडर्न जावास्क्रिप्ट लाइब्रेरी है जिसका उपयोग तेज़ और इंटरैक्टिव यूज़र इंटरफ़ेस (UI) बनाने के लिए किया जाता है।",
    category: 'tech'
  },

  // 7. Resto-X Pricing & Details
  {
    patterns: ['resto-x', 'resto price', 'restaurant software', 'restaurant pos', 'kot', 'table qr'],
    responseEn: "**Resto-X Restaurant Suite Pricing:**\n• **Yearly License:** ₹4,999/year (priority cloud sync & support)\n• **Permanent Lifetime:** ₹24,999 (one-time fee with 100% full source code & complimentary Android waiter app)\n• **Ojas AI Bot Add-on:** Just +₹999/yr or +₹2,500 permanent.",
    responseHi: "**Resto-X रेस्टोरेंट सुइट की क़ीमत:**\n• **इयरली लाइसेंस:** ₹4,999/साल\n• **परमानेंट लाइफटाइम:** ₹24,999 (एकमुश्त शुल्क, फुल सोर्स कोड और मुफ़्त Android वेटर ऐप सहित)\n• **Ojas AI बॉट जोड़ें:** मात्र +₹999/साल या +₹2,500 परमानेंट।",
    category: 'pricing'
  },

  // 8. Ojas AI Pricing
  {
    patterns: ['ojas price', 'ojas cost', 'bot price', 'ojas subscription', 'ai assistant cost'],
    responseEn: "**Ojas AI Copilot Pricing:**\n• **Yearly License:** ₹999/year\n• **Permanent Lifetime:** ₹1,999 (one-time purchase)\nIncludes 24/7 bilingual customer lead replies and receipt OCR data extraction.",
    responseHi: "**Ojas AI कोपायलट की क़ीमत:**\n• **इयरली:** ₹999/साल\n• **परमानेंट लाइफटाइम:** ₹1,999 (एक बार का पेमेंट)",
    category: 'pricing'
  },

  // 9. Event-X & Fitness-X Pricing
  {
    patterns: ['event-x', 'wedding app', 'fitness-x', 'gym app', 'shaadi app'],
    responseEn: "• **Event-X Royal Wedding Suite:** ₹2,999 Permanent Lifetime (guest RSVP, photo vault, GPS map)\n• **Fitness-X Gym Manager:** ₹999/yr or ₹2,999 Permanent Lifetime (QR check-in & WhatsApp renewal alerts).",
    responseHi: "• **Event-X वेडिंग सुइट:** ₹2,999 परमानेंट लाइफटाइम (RSVP व फोटो वॉल्ट)\n• **Fitness-X जिम सुइट:** ₹999/साल या ₹2,999 परमानेंट लाइफटाइम (QR अटेंडेंस व रिन्यूअल अलर्ट्स)।",
    category: 'pricing'
  },

  // 10. Custom Software & Mobile App Delivery
  {
    patterns: ['custom android', 'build app', 'app development', 'custom software', 'website development', 'time lagega', 'duration'],
    responseEn: "**MyBooks Custom Engineering:**\n• **Custom Mobile Application:** ₹29,999 launch offer (native performance, production ready)\n• **Custom Responsive Website:** ₹24,999\n• **Delivery Timeline:** 3 weeks (21 days) with 100% full source code & database ownership.",
    responseHi: "**MyBooks कस्टम इंजीनियरिंग:**\n• **कस्टम मोबाइल ऐप्लिकेशन:** ₹29,999 स्पेशल ऑफर (प्रोडक्शन रेडी लॉन्च सहित)\n• **कस्टम वेबसाइट:** ₹24,999\n• **डिलीवरी समय:** सिर्फ़ 3 हफ़्ते (21 दिन) और 100% फुल सोर्स कोड ओनरशिप।",
    category: 'process'
  },

  // 11. Why Choose Us
  {
    patterns: ['why choose', 'why you', 'kyun chune', 'fayda', 'advantage', 'better'],
    responseEn: "**Why Businesses Choose MyBooks:**\n1. **100% Code Ownership:** No recurring hostage charges. Full source code delivered.\n2. **Rapid 3-Week Delivery:** Production-ready custom builds in 21 days.\n3. **24/7 Direct WhatsApp Support:** Direct access to lead architects.\n4. **Lightweight Native Performance:** Optimized for high speed without crashes.",
    responseHi: "**MyBooks को क्यों चुनें:**\n1. **100% सोर्स कोड ओनरशिप:** कोई छुपा हुआ शुल्क नहीं।\n2. **3 हफ़्तों में डिलीवरी:** 21 दिनों में प्रोडक्शन रेडी ऐप।\n3. **24/7 सीधा WhatsApp सपोर्ट:** लीड डेवलपर्स से सीधी बात।\n4. **लाइटवेट हाई-स्पीड परफॉरमेंस:** तेज़ और क्रैश-फ्री परफॉरमेंस।",
    category: 'identity'
  },

  // 12. Buy / Order Intent
  {
    patterns: ['buy', 'purchase', 'order', 'book', 'hire', 'take my details', 'contact owner', 'chahiye', 'deal'],
    responseEn: "Excellent! I can connect you directly with Founder Deep Mehta and our lead engineering architect. Please share your phone number or click the WhatsApp button below to start immediately!",
    responseHi: "बहुत बढ़िया! मैं आपको सीधे संस्थापक Deep Mehta और हमारी लीड इंजीनियरिंग टीम से जोड़ देता हूँ। नीचे दिए गए WhatsApp बटन पर क्लिक करके आप तुरंत बात कर सकते हैं!",
    category: 'lead'
  }
];

export function resolveOjasIntelligentAnswer(query: string, lang: 'en' | 'hi'): {
  text: string;
  isLead: boolean;
  source?: string;
} {
  const clean = query.toLowerCase().replace(/[?.,!]/g, ' ').trim();

  // Special Math parser (evaluates basic expressions safely)
  const mathMatch = clean.match(/(\d+)\s*(?:\*|x|multiplied by|into|times)\s*(\d+)/);
  if (mathMatch) {
    const n1 = parseInt(mathMatch[1], 10);
    const n2 = parseInt(mathMatch[2], 10);
    const product = n1 * n2;
    return {
      text: lang === 'hi' 
        ? `${n1} गुणा ${n2} का उत्तर **${product.toLocaleString()}** है।` 
        : `${n1} multiplied by ${n2} is **${product.toLocaleString()}**.`,
      isLead: false,
      source: "Ojas Math Engine"
    };
  }

  const addMatch = clean.match(/(\d+)\s*(?:\+|plus|and|added to)\s*(\d+)/);
  if (addMatch) {
    const n1 = parseInt(addMatch[1], 10);
    const n2 = parseInt(addMatch[2], 10);
    return {
      text: `${n1} + ${n2} = **${(n1 + n2).toLocaleString()}**.`,
      isLead: false,
      source: "Ojas Math Engine"
    };
  }

  // Exact & partial keyword matching
  let bestEntry: KnowledgeEntry | null = null;
  let highestScore = 0;

  for (const entry of DEEP_KNOWLEDGE_ENTRIES) {
    let score = 0;
    for (const pat of entry.patterns) {
      if (clean === pat) {
        score += 25;
      } else if (clean.includes(pat)) {
        score += pat.length + 5;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && highestScore > 0) {
    return {
      text: lang === 'hi' ? bestEntry.responseHi : bestEntry.responseEn,
      isLead: bestEntry.category === 'lead',
      source: "MyBooks Verified Intelligence"
    };
  }

  // Live date inquiry
  if (clean.includes('date') || clean.includes('today') || clean.includes('tarikh') || clean.includes('aaj')) {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return {
      text: lang === 'hi'
        ? `आज का दिन और तारीख है: **${formatted}**`
        : `Today's current date is **${formatted}**.`,
      isLead: false,
      source: "Live System Clock"
    };
  }

  // Helpful conversational fallback
  return {
    text: lang === 'hi'
      ? "मैं Ojas हूँ, MyBooks का AI असिस्टेंट। आप मुझसे सॉफ़्टवेयर आर्किटेक्चर, कस्टम मोबाइल ऐप्स, Resto-X, गणित के सवाल या टेक्नोलॉजी के बारे में कुछ भी पूछ सकते हैं!"
      : "I am Ojas, the AI assistant for MyBooks. I can answer questions about custom mobile applications, Resto-X, pricing, mathematics, Python, and software architecture. How can I assist you right now?",
    isLead: false,
    source: "Ojas Core Knowledge"
  };
}
