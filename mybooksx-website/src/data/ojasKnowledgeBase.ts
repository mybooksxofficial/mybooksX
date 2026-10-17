export interface OjasKnowledgeItem {
  keywords: string[];
  responseEn: string;
  responseHi: string;
  category: 'pricing' | 'company' | 'product' | 'process' | 'contact' | 'booking';
}

export const OJAS_KNOWLEDGE_BASE: OjasKnowledgeItem[] = [
  // Greeting / Intro
  {
    keywords: ['hi', 'hello', 'hey', 'namaste', 'kem cho', 'hola', 'start', 'shuru'],
    responseEn: "Hello! I am Ojas AI, the official intelligence copilot of MyBooksX. May I know your name so I can assist your business better?",
    responseHi: "नमस्ते! मैं Ojas AI हूँ, MyBooksX का आधिकारिक इंटेलिजेंस कोपायलट। क्या मैं आपका शुभ नाम जान सकता हूँ ताकि मैं आपके बिज़नेस की बेहतर सहायता कर सकूँ?",
    category: 'company'
  },
  // Why Choose Us
  {
    keywords: ['why choose', 'why you', 'kyu chune', 'fayda', 'advantage', 'better', 'special', 'difference', 'kyun'],
    responseEn: "Businesses choose MyBooksX because: 1) You get 100% full source code & database ownership (no vendor hostage!), 2) Rapid 3-week custom delivery from scratch, 3) 24/7 direct WhatsApp & developer support, and 4) Tailored offline-resilient architecture built for real Indian & global operations.",
    responseHi: "बिज़नेसेस MyBooksX को इसलिए चुनते हैं क्योंकि: 1) 100% फुल सोर्स कोड और डेटा का मालिकाना हक आपका होता है (कोई वेंडर बंधक नहीं), 2) सिर्फ 3 हफ़्तों में कस्टम डिलीवरी, 3) 24/7 सीधा WhatsApp और डेवलपर सपोर्ट, और 4) बिना किसी रेडीमेड टेम्पलेट के पूरी तरह आपके बिज़नेस वर्कफ़्लो के अनुसार कस्टमाइज़्ड सॉफ़्टवेयर।",
    category: 'company'
  },
  // Pricing: Resto-X
  {
    keywords: ['resto', 'restaurant', 'pos', 'dining', 'table', 'kot', 'kitchen'],
    responseEn: "Resto-X Restaurant Suite pricing: Yearly License is ₹4,999/yr. Permanent Lifetime Ownership is ₹24,999 (one-time payment with complete source code & free complimentary Android waiter app). You can also add Ojas AI Bot for just +₹999/yr or +₹2,500 permanent!",
    responseHi: "Resto-X रेस्टोरेंट सुइट की क़ीमत: इयरली लाइसेंस ₹4,999/साल है और परमानेंट लाइफटाइम ओनरशिप ₹24,999 (एक बार का पेमेंट, जिसमें पूरा सोर्स कोड और कॉम्प्लिमेंट्री Android वेटर ऐप मुफ़्त शामिल है)। आप सिर्फ़ +₹999/साल या +₹2,500 परमानेंट में Ojas AI बॉट भी इंटीग्रेट कर सकते हैं!",
    category: 'pricing'
  },
  // Pricing: Ojas AI
  {
    keywords: ['ojas price', 'ojas ai cost', 'ai bot price', 'ojas subscription', 'bot cost'],
    responseEn: "Ojas AI Copilot standalone pricing: ₹999/year license or ₹1,999 Permanent Lifetime. It supports Hindi & English bilingual replies, automated WhatsApp lead handling, and invoice OCR scanning.",
    responseHi: "Ojas AI कोपायलट की क़ीमत: ₹999 प्रति वर्ष या ₹1,999 परमानेंट लाइफटाइम। यह हिंदी और इंग्लिश दोनों में 24/7 ऑटोमेटेड लीड रिप्लाई और इनवॉइस OCR स्कैनिंग प्रदान करता है।",
    category: 'pricing'
  },
  // Pricing: Event-X / Wedding
  {
    keywords: ['event', 'wedding', 'shaadi', 'vivah', 'invitation', 'rsvp', 'photo'],
    responseEn: "Event-X Royal Wedding Suite is available for a one-time fee of ₹2,999 Permanent Lifetime! Includes guest RSVP portal, photo sharing vault, ceremony countdown, and venue GPS maps.",
    responseHi: "Event-X रॉयल वेडिंग सुइट की क़ीमत सिर्फ़ ₹2,999 परमानेंट लाइफटाइम है! इसमें गेस्ट RSVP, डिजिटल फोटो वॉल्ट, सेरेमनी काउंटडाउन और वेन्यू GPS मैप्स शामिल हैं।",
    category: 'pricing'
  },
  // Pricing: Fitness-X
  {
    keywords: ['fitness', 'gym', 'workout', 'trainer', 'membership', 'attendance'],
    responseEn: "Fitness-X Gym & Wellness Suite is priced at ₹999/year or ₹2,999 Permanent Lifetime! Features QR member check-in, automated WhatsApp membership renewals, and trainer scheduling.",
    responseHi: "Fitness-X जिम सुइट की क़ीमत ₹999 प्रति वर्ष या ₹2,999 परमानेंट लाइफटाइम है! इसमें QR मेंबर अटेंडेंस, ऑटोमेटेड WhatsApp रिन्यूअल अलर्ट्स और डाइट/ट्रेनर शेड्यूलिंग शामिल है।",
    category: 'pricing'
  },
  // Pricing: Social Media Management
  {
    keywords: ['social media', 'smm', 'instagram', 'facebook', 'linkedin', 'post design', 'content calendar'],
    responseEn: "Social Media Management plans: Starter is ₹12,000/mo (1 platform, 8 posts, calendar & captions), Growth is ₹22,000/mo (up to 3 platforms, 12 posts, scheduling & report), and Premium is ₹35,000/mo (up to 4 platforms, 16 posts, strategy & triage).",
    responseHi: "सोशल मीडिया मैनेजमेंट प्लान्स: स्टार्टर ₹12,000/माह (1 प्लेटफ़ॉर्म, 8 पोस्ट्स, कंटेंट कैलेंडर व कैप्शन), ग्रोथ ₹22,000/माह (3 प्लेटफ़ॉर्म, 12 पोस्ट्स व शेड्यूलिंग), और प्रीमियम ₹35,000/माह (4 प्लेटफ़ॉर्म, 16 पोस्ट्स व स्ट्रैटेजी समीक्षा)।",
    category: 'product'
  },
  // Pricing: Email Marketing
  {
    keywords: ['email marketing', 'newsletter', 'email campaign', 'mailchimp', 'brevo', 'email automation'],
    responseEn: "Email Marketing plans: Starter is ₹8,000/mo (2 campaigns, template design & copywriting), Growth is ₹15,000/mo (4 campaigns, list segmentation & 1 automated sequence), and Premium is ₹25,000/mo (8 campaigns, lifecycle drips & deliverability optimization).",
    responseHi: "ईमेल मार्केटिंग प्लान्स: स्टार्टर ₹8,000/माह (2 कैंपेन, न्यूज़लेटर डिज़ाइन व कॉपीराइटिंग), ग्रोथ ₹15,000/माह (4 कैंपेन, ऑडियंस सेग्मेंटेशन व वेलकम फ्लो), और प्रीमियम ₹25,000/माह (8 कैंपेन व ड्रिप ऑटोमेशन)।",
    category: 'product'
  },
  // General Pricing overview
  {
    keywords: ['price', 'pricing', 'rate', 'cost', 'kitna lagega', 'paisa', 'charges', 'fees', 'budget'],
    responseEn: "Here are our transparent plans:\n• Resto-X: ₹4,999/yr or ₹24,999 Lifetime\n• Ojas AI: ₹999/yr or ₹1,999 Lifetime\n• Event-X: ₹2,999 Lifetime\n• Fitness-X: ₹999/yr or ₹2,999 Lifetime\n• Social Media Management: from ₹12,000/mo\n• Email Marketing: from ₹8,000/mo\n• Custom Software & Mobile Apps: Engineered in 3 weeks.",
    responseHi: "हमारे सभी ट्रांसपेरेंट प्लान्स:\n• Resto-X: ₹4,999/साल या ₹24,999 लाइफटाइम\n• Ojas AI: ₹999/साल या ₹1,999 लाइफटाइम\n• Event-X: ₹2,999 लाइफटाइम\n• Fitness-X: ₹999/साल या ₹2,999 लाइफटाइम\n• सोशल मीडिया मैनेजमेंट: ₹12,000/माह से शुरू\n• ईमेल मार्केटिंग: ₹8,000/माह से शुरू\n• कस्टम Android ऐप: 3 हफ़्ते में रेडी।",
    category: 'pricing'
  },
  // Planning & Process
  {
    keywords: ['planning', 'process', 'kaise kaam', 'steps', 'timeline', 'how long', 'duration', 'kitna time'],
    responseEn: "Our 5-Stage Engineering Process: 1) Architecture Blueprint (Day 1-3), 2) Interactive UI/UX Prototype (Day 4-7), 3) Sprint Development (Day 8-16), 4) Rigorous QA & Load Testing (Day 17-19), and 5) Production Deployment & Play Store Publishing (Day 20-21). You get direct progress updates every few days!",
    responseHi: "हमारा 5-चरणीय प्रोसेस: 1) आर्किटेक्चर ब्लूप्रिंट (1-3 दिन), 2) इंटरैक्टिव UI/UX प्रोटोटाइप (4-7 दिन), 3) कोर स्प्रिंट डेवलपमेंट (8-16 दिन), 4) टेस्टिंग और सिक्योरिटी ऑडिट (17-19 दिन), और 5) प्ले स्टोर पब्लिशिंग व लाइव डिप्लॉयमेंट (20-21 दिन)।",
    category: 'process'
  },
  // Lead Capture / Buy Intent
  {
    keywords: ['buy', 'purchase', 'khareedna', 'order', 'book', 'take my details', 'contact me', 'chahiye', 'deal'],
    responseEn: "Wonderful! I would love to connect you directly with our founding architect. Please share your Phone Number and Business Name here, or simply click the 'Connect via WhatsApp' button below to dispatch your request instantly!",
    responseHi: "बहुत बढ़िया! मैं आपको सीधे हमारे फ़ाउंडर और लीड आर्किटेक्ट से कनेक्ट करवा देता हूँ। कृपया अपना फ़ोन नंबर और बिज़नेस का नाम यहाँ बताएँ, या नीचे दिए गए 'WhatsApp से भेजें' बटन पर क्लिक करें!",
    category: 'booking'
  },
  // Contact details
  {
    keywords: ['contact', 'phone', 'number', 'email', 'call', 'whatsapp', 'support', 'owner'],
    responseEn: "You can reach MyBooksX directly at:\n• WhatsApp / Call: +91 9644570828\n• Email: mybooksxofficial@gmail.com\n• Support Hours: 24/7 Dedicated Assistance",
    responseHi: "आप MyBooksX से सीधे संपर्क कर सकते हैं:\n• WhatsApp / कॉल: +91 9644570828\n• ईमेल: mybooksxofficial@gmail.com\n• सपोर्ट: 24/7 उपलब्ध",
    category: 'contact'
  }
];

export function findBestOjasResponse(query: string, userName?: string): { textEn: string; textHi: string; isLeadIntent: boolean } {
  const clean = query.toLowerCase().trim();

  // Check if user is sharing their name (e.g. "my name is Rahul", "I am Priya", "Rahul")
  const namePatterns = [
    /(?:my name is|i am|mera naam|naam hai|this is)\s+([a-zA-Z\s]+)/i,
    /^(?:i am|im)\s+([a-zA-Z\s]+)$/i
  ];

  for (const pat of namePatterns) {
    const match = clean.match(pat);
    if (match && match[1]) {
      const extractedName = match[1].trim();
      return {
        textEn: `Nice to meet you, ${extractedName}! How can I help your business grow today? Ask me about our custom Android apps, Resto-X, Event-X, or our 3-week delivery process!`,
        textHi: `आपसे मिलकर खुशी हुई, ${extractedName} जी! आज मैं आपके बिज़नेस को आगे बढ़ाने में कैसे मदद कर सकता हूँ? आप मुझसे कस्टम ऐप्स, Resto-X, Event-X, या हमारे प्रोसेस के बारे में कुछ भी पूछ सकते हैं!`,
        isLeadIntent: false
      };
    }
  }

  // Check lead intent
  const leadKeywords = ['buy', 'purchase', 'khareedna', 'order', 'book', 'take my details', 'mera detail', 'phone no', 'call me', 'chahiye'];
  const isLeadIntent = leadKeywords.some(k => clean.includes(k));

  let bestMatch: OjasKnowledgeItem | null = null;
  let maxScore = 0;

  for (const item of OJAS_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (clean.includes(kw)) {
        score += kw.length; // weight longer matches more
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && maxScore > 0) {
    let textEn = bestMatch.responseEn;
    let textHi = bestMatch.responseHi;
    if (userName) {
      textEn = `${userName}, ` + textEn.charAt(0).toLowerCase() + textEn.slice(1);
      textHi = `${userName} जी, ` + textHi;
    }
    return { textEn, textHi, isLeadIntent };
  }

  // Default context-aware fallback
  return {
    textEn: userName 
      ? `${userName}, I understand you're inquiring about our software engineering solutions. We specialize in custom Android apps, Web ERPs, Resto-X, and AI automation delivered in 3 weeks. What specific feature does your business need?`
      : "I understand you're inquiring about our engineering solutions. We specialize in custom Android apps, Web ERPs, Resto-X, and AI automation delivered in 3 weeks. Could you tell me more about your requirements or share your phone number?",
    textHi: userName
      ? `${userName} जी, मैं समझ गया कि आप हमारे सॉफ़्टवेयर सॉल्यूशंस के बारे में जानना चाहते हैं। हम सिर्फ़ 3 हफ़्तों में कस्टम Android ऐप्स, ERPs, Resto-X और AI बॉट्स तैयार करते हैं। आपके बिज़नेस की मुख्य ज़रूरत क्या है?`
      : "मैं समझ गया कि आप हमारे सॉफ़्टवेयर सॉल्यूशंस के बारे में जानना चाहते हैं। हम सिर्फ़ 3 हफ़्तों में कस्टम Android ऐप्स, ERPs, Resto-X और AI बॉट्स तैयार करते हैं। क्या आप अपने प्रोजेक्ट के बारे में कुछ और जानकारी या संपर्क नंबर साझा करना चाहेंगे?",
    isLeadIntent
  };
}
