/**
 * Authoritative MyBooks Company Knowledge & Verified Identity
 * Strictly configured according to master system guidelines:
 * - Company / Organization Name: MyBooks (MyBooksX)
 * - Founder: Deep Mehta
 * - AI Assistant: Ojas
 */

export interface CompanyFact {
  id: string;
  category: 'core' | 'product' | 'founder' | 'support' | 'policy';
  questionPatterns: string[];
  answerEn: string;
  answerHi: string;
  source: string;
  verified: boolean;
}

export interface MyBooksCompanyProfile {
  officialName: string;
  brandName: string;
  founder: string;
  aiAssistantName: string;
  mission: string;
  missionHi: string;
  description: string;
  descriptionHi: string;
  officialHotline: string;
  officialEmail: string;
  verifiedFacts: Record<string, string>;
  lastUpdated: string;
}

export const AUTHORITATIVE_COMPANY_PROFILE: MyBooksCompanyProfile = {
  officialName: "MyBooks (MyBooksX Software Studio)",
  brandName: "MyBooks",
  founder: "Deep Mehta",
  aiAssistantName: "Ojas",
  mission: "Engineering high-performance, custom software ecosystems and intelligent digital growth infrastructure for businesses with 100% code ownership.",
  missionHi: "100% सोर्स कोड ओनरशिप के साथ बिज़नेस के लिए हाई-परफॉरमेंस कस्टम सॉफ़्टवेयर और डिजिटल ग्रोथ इंफ़्रास्ट्रक्चर तैयार करना।",
  description: "MyBooks is a premier bespoke digital engineering studio specializing in custom mobile application development, Web ERPs, dining automation (Resto-X), wedding platforms (Event-X), fitness suites (Fitness-X), and digital growth marketing.",
  descriptionHi: "MyBooks एक प्रमुख कस्टम डिजिटल इंजीनियरिंग स्टूडियो है जो कस्टम Android ऐप्स, Web ERPs, रेस्टोरेंट ऑटोमेशन (Resto-X), और डिजिटल ग्रोथ सर्विसेज में विशेषज्ञता रखता है।",
  officialHotline: "+91 9644570828",
  officialEmail: "mybooksxofficial@gmail.com",
  verifiedFacts: {
    "founder": "Deep Mehta",
    "company": "MyBooks",
    "ai_assistant": "Ojas",
    "code_ownership": "100% Full Source Code & Database Ownership Delivered",
    "delivery_cycle": "Rapid 3-Week (21-Day) Custom Production Delivery",
    "support_availability": "24/7 Direct Engineering WhatsApp & Call Support"
  },
  lastUpdated: "2026-10-16"
};

export const VERIFIED_KNOWLEDGE_DOCS: CompanyFact[] = [
  {
    id: "kb-founder",
    category: "founder",
    questionPatterns: ["who is the founder", "who founded", "founder of mybooks", "founder name", "malik kaun hai", "founder", "deep mehta"],
    answerEn: "Deep Mehta is the founder of MyBooks.",
    answerHi: "Deep Mehta MyBooks के संस्थापक (Founder) हैं।",
    source: "Official Company Verification Document • Owner Stated",
    verified: true
  },
  {
    id: "kb-ojas-identity",
    category: "core",
    questionPatterns: ["what is ojas", "who are you", "who is ojas", "ojas kya hai", "tum kaun ho", "ojas ai"],
    answerEn: "I am Ojas, the intelligent AI assistant associated with MyBooks. I assist with software architecture guidance, product inquiries, business automation, and general problem solving.",
    answerHi: "मैं Ojas हूँ, MyBooks से जुड़ा आधिकारिक इंटेलिजेंट AI असिस्टेंट। मैं सॉफ़्टवेयर आर्किटेक्चर, प्रॉडक्ट इनक्वायरी, और बिज़नेस ऑटोमेशन में आपकी सहायता करता हूँ।",
    source: "Ojas AI System Architecture Spec",
    verified: true
  },
  {
    id: "kb-resto-x",
    category: "product",
    questionPatterns: ["resto-x", "restaurant pos", "table qr", "kitchen display", "kot", "restaurant software"],
    answerEn: "Resto-X is MyBooks' complete dining POS suite featuring table QR ordering, live Kitchen Order Ticket (KOT) sync, raw material inventory, and GST billing. Priced at ₹4,999/yr or ₹24,999 Permanent Lifetime with a complimentary Android waiter app.",
    answerHi: "Resto-X MyBooks का रेस्टोरेंट POS सुइट है जिसमें टेबल QR ऑर्डरिंग, किचन डिस्प्ले (KOT), इन्वेंटरी और GST बिलिंग शामिल है। क़ीमत: ₹4,999/साल या ₹24,999 परमानेंट लाइफटाइम (कॉम्प्लिमेंट्री Android ऐप सहित)।",
    source: "Resto-X Flagship Product Spec",
    verified: true
  },
  {
    id: "kb-event-x",
    category: "product",
    questionPatterns: ["event-x", "wedding suite", "wedding app", "guest rsvp", "shaadi", "photo vault"],
    answerEn: "Event-X is MyBooks' Royal Wedding Suite for couple itineraries, guest RSVP, interactive photo vaults, and venue GPS maps. Available at ₹2,999 Permanent Lifetime.",
    answerHi: "Event-X MyBooks का रॉयल वेडिंग सुइट है जो गेस्ट RSVP, फोटो वॉल्ट और वेन्यू GPS मैप्स उपलब्ध कराता है। क़ीमत: ₹2,999 परमानेंट लाइफटाइम।",
    source: "Event-X Flagship Product Spec",
    verified: true
  },
  {
    id: "kb-fitness-x",
    category: "product",
    questionPatterns: ["fitness-x", "gym app", "gym management", "gym attendance", "workout"],
    answerEn: "Fitness-X is MyBooks' gym and wellness app with QR attendance check-in, automated WhatsApp renewal reminders, and trainer schedules. Priced at ₹999/yr or ₹2,999 Permanent Lifetime.",
    answerHi: "Fitness-X MyBooks का जिम और वेलनेस मैनेजमेंट ऐप है जिसमें QR अटेंडेंस और ऑटोमेटेड WhatsApp रिन्यूअल अलर्ट्स शामिल हैं। क़ीमत: ₹999/साल या ₹2,999 परमानेंट लाइफटाइम।",
    source: "Fitness-X Product Spec",
    verified: true
  },
  {
    id: "kb-custom-android",
    category: "product",
    questionPatterns: ["custom app", "app cost", "build app", "app development", "mobile application"],
    answerEn: "MyBooks engineers custom native-grade mobile applications tailored to your exact business workflow in 3 weeks. Available on special launch offer at ₹29,999 with complete production setup.",
    answerHi: "MyBooks आपके बिज़नेस के लिए सिर्फ़ 3 हफ़्तों में कस्टम मोबाइल ऐप्लिकेशन तैयार करता है। स्पेशल ऑफर क़ीमत ₹29,999 (प्रोडक्शन सेटअप सहित)।",
    source: "Mobile Engineering Catalog",
    verified: true
  },
  {
    id: "kb-digital-growth",
    category: "product",
    questionPatterns: ["social media", "email marketing", "digital growth", "smm", "newsletter", "campaign"],
    answerEn: "MyBooks offers full Digital Growth Services: Social Media Management (starting at ₹12,000/mo) and Email Marketing & Campaign Automation (starting at ₹8,000/mo) with bespoke content calendars and segment retention.",
    answerHi: "MyBooks डिजिटल ग्रोथ सर्विसेज भी प्रदान करता है: सोशल मीडिया मैनेजमेंट (₹12,000/माह से) और ईमेल मार्केटिंग (₹8,000/माह से)।",
    source: "Digital Growth Division Spec",
    verified: true
  },
  {
    id: "kb-why-choose",
    category: "core",
    questionPatterns: ["why choose mybooks", "why you", "kyun chune", "advantages", "benefits"],
    answerEn: "Why choose MyBooks: 1) 100% full source code ownership (no vendor lock-in), 2) Rapid 3-week custom delivery, 3) 24/7 direct WhatsApp & lead architect support, and 4) Lightweight high-speed mobile app performance.",
    answerHi: "MyBooks को क्यों चुनें: 1) 100% फुल सोर्स कोड ओनरशिप, 2) सिर्फ 3 हफ़्तों में कस्टम डिलीवरी, 3) 24/7 सीधा WhatsApp सपोर्ट, और 4) हाई-स्पीड लाइटवेट मोबाइल ऐप परफॉरमेंस।",
    source: "Engineering Core Pillars",
    verified: true
  }
];
