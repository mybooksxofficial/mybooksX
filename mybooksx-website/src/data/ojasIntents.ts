/**
* Ojas AI Comprehensive Knowledge Base & Intent Repository
* Contains 110+ high-fidelity intents across all MyBooks products, services, objections,
* competitor comparisons, timelines, pricing, FAQs, and conversational dialogs.
* 
* Each intent includes:
* - id: Unique string identifier
* - category: Category grouping
* - topic: Topic identifier for multi-turn context retention
* - keywords: English search terms and phrases
* - hinglishKeywords: Hinglish / Romanized Hindi phrases
* - replyEn: Detailed English reply with Markdown formatting
* - replyHi: Detailed Hindi / Hinglish reply
* - followUpChips: 2 to 4 interactive follow-up question chips
*/

export interface OjasIntent {
  id: string;
  category:
  | 'objections'
  | 'competitors'
  | 'company'
  | 'founder'
  | 'resto_x'
  | 'event_x'
  | 'fitness_x'
  | 'custom_software'
  | 'digital_growth'
  | 'pricing'
  | 'timeline'
  | 'support'
  | 'process'
  | 'faqs'
  | 'demo'
  | 'contact'
  | 'smalltalk'
  | 'tech';
  topic: string;
  keywords: string[];
  hinglishKeywords: string[];
  replyEn: string;
  replyHi: string;
  followUpChips: string[];
}

export const OJAS_INTENTS: OjasIntent[] = [
  // =========================================================================
  // 1. OBJECTIONS & COMPETITORS (Core Battlecards & Failed Questions)
  // =========================================================================
  {
    id: 'objection_cheaper_competitor',
    category: 'objections',
    topic: 'pricing_comparison',
    keywords: [
      'why other software is cheaper', 'other software is cheaper', 'competitor is cheaper',
      'why is competitor cheaper', 'someone is giving cheaper', 'cheaper options',
      'low price competitor', 'why other software giving cheaper', 'why cheap'
    ],
    hinglishKeywords: [
      'dusra software sasta kyu hai', 'dusre sasta de rahe hai', 'dusra software sasta',
      'market me sasta mil raha hai', 'dusri company saste me de rahi', 'itna sasta kaise',
      'sasta kyu de rahe', 'sasta option', 'dusra app sasta hai', 'competitor sasta hai'
    ],
    replyEn: `**Why other software appears cheaper (and the hidden costs):**\n\nMost "cheap" software providers lock you into recurring monthly fees, take 2–5% transaction commissions, and **never give you the source code or database**. Over 2 years, a ₹1,000/month tool ends up costing ₹24,000+ with zero asset value.\n\n**With MyBooks:**\n1. **100% Lifetime Source Code Ownership:** You own the software permanently. No recurring rental trap.\n2. **Zero Commission on Orders:** Keep 100% of your earnings.\n3. **100% Offline-First Billing:** Never stops working when the internet cuts out.\n4. **Customized to Your Exact Workflow:** No rigid templates.\n\n*Cheaper software sells you a temporary rental; MyBooks builds you a permanent business asset.*`,
    replyHi: `**अन्य सॉफ़्टवेयर सस्ते क्यों लगते हैं (और उनका छिपा सच):**\n\nबाज़ार के अधिकांश "सस्ते" सॉफ़्टवेयर आपको हर महीने रेंटल फीस में बांधते हैं, प्रति ऑर्डर कमीशन काटते हैं, और **कभी भी सोर्स कोड या डेटाबेस का मालिकाना हक नहीं देते**। 2 साल में ₹1,000/माह का टूल ₹24,000+ खा जाता है और हाथ कुछ नहीं लगता।\n\n**MyBooks के साथ:**\n1. **100% लाइफटाइम सोर्स कोड ओनरशिप:** सॉफ़्टवेयर स्थायी रूप से आपका है। कोई मंथली रेंट नहीं।\n2. **0% कमीशन:** आपकी कमाई का 100% हिस्सा आपका।\n3. **100% ऑफ़लाइन बिलिंग:** बिना इंटरनेट के भी सुपरफास्ट काम करता है।\n4. **पूरी तरह कस्टमाइज़्ड:** आपके बिज़नेस के हिसाब से तैयार।\n\n*सस्ता सॉफ़्टवेयर आपको किरायेदार बनाता है, MyBooks आपको सॉफ़्टवेयर का मालिक बनाता है।*`,
    followUpChips: ['Why choose MyBooks?', 'Resto-X Lifetime Price', 'Connect on WhatsApp', 'Show all pricing']
  },
  {
    id: 'objection_better_than_competitors',
    category: 'competitors',
    topic: 'competitors',
    keywords: [
      'why are you better than other competitor', 'why better than competitor', 'why choose mybooks over others',
      'what makes you better', 'why should i choose you', 'mybooks advantages', 'competitor comparison',
      'difference between you and competitors', 'why best'
    ],
    hinglishKeywords: [
      'dusro se behtar kyu ho', 'tum me kya khas hai', 'dusri company se achha kyu',
      'competitor se better kaise', 'fayda kya hai mybooks ka', 'kyu le tumse',
      'kya alag hai', 'dusro se alag kya hai', 'kyun chune mybooks'
    ],
    replyEn: `**What makes MyBooks superior to conventional SaaS platforms:**\n\n• **100% Source Code & Data Ownership:** Unlike Zoho, Petpooja, or Shopify, you own the full source code and database. You are never held hostage by vendor price hikes.\n• **Rapid 3-Week Custom Delivery:** We build tailored applications from blueprint to Play Store/deployment in 21 days.\n• **100% Offline Resilience:** Our software runs on local SQLite databases and syncs automatically when online—never freezes during busy hours.\n• **Direct Founder & Engineering Support:** 24/7 dedicated WhatsApp support directly with developers, not an offshore call center.\n• **Zero Revenue Cuts:** We charge no hidden per-transaction commissions.`,
    replyHi: `**MyBooks बाज़ार के अन्य टूल्स से बेहतर क्यों है:**\n\n• **100% सोर्स कोड और डेटा ओनरशिप:** Zoho या Petpooja के विपरीत, कोड और डेटा आपका होता है। कंपनी कभी दाम बढ़ाकर आपको बंधक नहीं बना सकती।\n• **3 हफ़्तों में कस्टम डिलीवरी:** सिर्फ़ 21 दिनों में ब्लूप्रिंट से लेकर प्ले स्टोर तक लाइव।\n• **100% ऑफ़लाइन ऑपरेशन:** इंटरनेट बंद होने पर भी बिलिंग और ऑर्डर बिना रुके चलते हैं।\n• **सीधा डेवलपर और फ़ाउंडर सपोर्ट:** 24/7 WhatsApp पर सीधे इंजीनियर्स से बात होती है, किसी ऑटोमेटेड कॉल सेंटर से नहीं।\n• **0% कमीशन:** आपके हर ऑर्डर की पूरी कमाई आपकी होती है।`,
    followUpChips: ['Compare with Zoho', 'Compare with Petpooja', '3-Week Process', 'Talk to Deep Mehta']
  },
  {
    id: 'objection_vs_zoho',
    category: 'competitors',
    topic: 'competitors',
    keywords: [
      'why not zoho', 'zoho vs mybooks', 'zoho alternative', 'compare zoho', 'is zoho better',
      'zoho difference', 'zoho books comparison'
    ],
    hinglishKeywords: [
      'zoho kyu nahi', 'zoho se compare karo', 'zoho achha hai ya mybooks',
      'zoho books se behtar kaise', 'zoho chhod kar mybooks kyu lu'
    ],
    replyEn: `**MyBooks vs Zoho Comparison:**\n\n| Feature | MyBooks | Zoho |\n|---|---|---|\n| **Ownership** | 100% Full Source Code & Database | Rental Subscription Only |\n| **Offline Billing** | Fully Offline SQLite Engine | Requires Active Internet |\n| **Customization** | Tailored to your exact workflow | Rigid off-the-shelf templates |\n| **Support** | Direct WhatsApp with Engineers | Ticket Queue / Slow Email |\n| **Long-Term Cost** | One-time permanent license available | Perpetual monthly/annual fees |\n\n*Zoho is built for standardized enterprises; MyBooks gives you total ownership and custom speed.*`,
    replyHi: `**MyBooks बनाम Zoho तुलना:**\n\n• **ओनरशिप:** MyBooks में 100% फुल सोर्स कोड और डेटा आपका होता है; Zoho सिर्फ़ मंथली रेंट पर देता है।\n• **ऑफ़लाइन काम:** MyBooks बिना इंटरनेट के भी 100% चलता है; Zoho को हमेशा इंटरनेट चाहिए।\n• **कस्टमाइज़ेशन:** MyBooks आपके वर्कफ़्लो अनुसार बनता है; Zoho के सीमित टेम्पलेट्स होते हैं।\n• **सपोर्ट:** MyBooks में सीधा WhatsApp सपोर्ट; Zoho में ईमेल टिकट का इंतज़ार।\n• **लागत:** MyBooks में लाइफटाइम ओनरशिप विकल्प है; Zoho में आजीवन किराया देना पड़ता है।`,
    followUpChips: ['Why choose MyBooks?', 'Lifetime License Price', 'Custom Web ERP', 'Talk to Founder']
  },
  {
    id: 'objection_vs_petpooja',
    category: 'competitors',
    topic: 'competitors',
    keywords: [
      'why not petpooja', 'petpooja vs resto-x', 'compare petpooja', 'petpooja alternative',
      'resto-x vs petpooja', 'is petpooja better', 'petpooja pricing'
    ],
    hinglishKeywords: [
      'petpooja kyu nahi', 'petpooja se behtar kaise', 'petpooja vs resto x',
      'petpooja chhodkar resto x kyu lu', 'petpooja mehenga hai'
    ],
    replyEn: `**Resto-X vs Petpooja:**\n\n• **Lifetime Ownership vs Rental:** Petpooja charges ₹10,000–₹15,000+ every single year per outlet. Resto-X offers **₹24,999 Permanent Lifetime Ownership** with full source code!\n• **Free Waiter App:** Resto-X includes a complimentary Android waiter app; competitors charge extra device licenses.\n• **Offline Reliability:** Resto-X prints KOTs and bills instantly even when WiFi drops.\n• **No Vendor Lock-in:** You can host on your own server or run locally without being locked out if a renewal lapses.`,
    replyHi: `**Resto-X बनाम Petpooja:**\n\n• **लाइफटाइम ओनरशिप:** Petpooja हर साल ₹10,000–₹15,000+ रेंटल लेता है। Resto-X आपको **₹24,999 में लाइफटाइम परमानेंट ओनरशिप** और सोर्स कोड देता है!\n• **मुफ़्त वेटर ऐप:** Resto-X के साथ Android वेटर ऐप कॉम्प्लिमेंट्री मिलता है, जिसके लिए अन्य कंपनियाँ अलग चार्ज लेती हैं।\n• **100% ऑफ़लाइन KOT व बिलिंग:** इंटरनेट बंद होने पर भी एक सेकंड की रुकावट नहीं आती।\n• **कोई वेंडर लॉक-इन नहीं:** आपका डेटा और सॉफ़्टवेयर हमेशा आपके पास सुरक्षित रहता है।`,
    followUpChips: ['Resto-X Full Features', 'Resto-X Demo', 'Book Resto-X', 'Why other software cheaper']
  },
  {
    id: 'objection_vs_posist',
    category: 'competitors',
    topic: 'competitors',
    keywords: ['posist vs restox', 'why not posist', 'compare posist', 'posist alternative'],
    hinglishKeywords: ['posist kyu nahi', 'posist se behtar kaise', 'posist software vs resto x'],
    replyEn: `**Resto-X vs Posist (Restroworks):**\n\n• Posist is primarily targeted at enterprise chain restaurants with setup fees starting upwards of ₹40,000 plus expensive monthly recurring tiers.\n• Resto-X delivers enterprise features—multi-station KOT, recipe inventory, and table QR ordering—at a fraction of the cost (₹4,999/yr or ₹24,999 Lifetime) with zero commission on revenue.`,
    replyHi: `**Resto-X बनाम Posist:**\n\n• Posist बड़ी चेंज के लिए है जहाँ ₹40,000+ सेटअप फीस और भारी मासिक शुल्क होता है।\n• Resto-X वही एडवांस फ़ीचर्स (KOT, रेसिपी इन्वेंटरी, QR मेन्यू) बेहद किफ़ायती दर (₹4,999/साल या ₹24,999 लाइफटाइम) पर बिना किसी कमीशन के प्रदान करता है।`,
    followUpChips: ['Resto-X Features', 'Resto-X Pricing', 'Compare Petpooja', 'Book Demo']
  },
  {
    id: 'objection_vs_vyapar_khatabook',
    category: 'competitors',
    topic: 'competitors',
    keywords: ['vyapar vs mybooks', 'khatabook vs mybooks', 'why not vyapar', 'why not khatabook'],
    hinglishKeywords: ['vyapar app kyu nahi', 'khatabook se compare karo', 'vyapar se achha kyu'],
    replyEn: `**MyBooks vs Vyapar / Khatabook:**\n\n• Vyapar and Khatabook are simple ledger and billing apps for generic retail shops. They lack restaurant KOTs, multi-station order routing, table QR ordering, gym member biometric check-in, and full source code handover.\n• MyBooks builds specialized industry suites and custom tailored software built from scratch for your specific business.`,
    replyHi: `**MyBooks बनाम Vyapar / Khatabook:**\n\n• Vyapar और Khatabook साधारण खुदरा बहीखाता और बिलिंग ऐप हैं। उनमें रेस्टोरेंट KOT, टेबल QR ऑर्डरिंग, जिम बायोमेट्रिक अटेंडेंस या सोर्स कोड ओनरशिप की सुविधा नहीं होती।\n• MyBooks आपके विशिष्ट बिज़नेस वर्कफ़्लो के अनुसार कस्टमाइज़्ड सॉफ़्टवेयर तैयार करता है।`,
    followUpChips: ['Resto-X Overview', 'Custom Software', 'Why Choose MyBooks?', 'Show Pricing']
  },
  {
    id: 'objection_too_expensive',
    category: 'objections',
    topic: 'pricing',
    keywords: [
      'too expensive', 'high price', 'costly', 'why so expensive', 'price is too high',
      'out of budget', 'cant afford', 'very costly'
    ],
    hinglishKeywords: [
      'bahut mehenga hai', 'rate zyada hai', 'budget se bahar hai', 'paisa zyada hai',
      'itna mehenga kyu', 'kam karo na', 'sasta karo', 'itne paise nahi hai'
    ],
    replyEn: `**Understanding the True ROI of MyBooks:**\n\nOur pricing is engineered around **Lifetime Return on Investment (ROI)**, not recurring cost traps:\n\n1. **One-Time Investment:** Resto-X Permanent is ₹24,999 once. Over 3 years, rental tools cost ₹45,000+.\n2. **Custom Mobile Apps (₹29,999):** Agency quotes elsewhere start at ₹80,000 to ₹1.5 Lakhs for custom native code.\n3. **Full Source Code Included:** You receive the production-ready repository. It's a genuine business asset you can modify, rehost, or even show on your company valuation.\n4. **Milestone Payments:** You pay 50% upfront and 50% only after full approval upon completion.`,
    replyHi: `**MyBooks की सही वैल्यू और ROI समझिए:**\n\nहमारा प्राइसिंग मॉडल आपको जीवन भर के किराये से मुक्त करने के लिए बनाया गया है:\n\n1. **एक बार का निवेश:** Resto-X लाइफटाइम ₹24,999 सिर्फ़ एक बार है। 3 साल में किराये के टूल्स ₹45,000+ खा जाते हैं।\n2. **कस्टम ऐप्स (₹29,999):** बाज़ार की एजेंसियाँ कस्टम कोड के लिए ₹80,000 से ₹1.5 लाख मांगती हैं।\n3. **पूरा सोर्स कोड आपका:** आपको पूरा कोड मिलता है जिसे आप कभी भी मॉडिफाई या नए सर्वर पर ले जा सकते हैं।\n4. **आसान माइलस्टोन पेमेंट:** 50% काम शुरू होने पर और 50% पूरा होने और आपकी मंज़ूरी के बाद।`,
    followUpChips: ['Can I get a discount?', 'Payment terms', 'Show all pricing', 'Connect on WhatsApp']
  },
  {
    id: 'objection_discount_request',
    category: 'objections',
    topic: 'pricing',
    keywords: [
      'discount', 'best price', 'any discount', 'can you reduce price', 'bargain',
      'lower price', 'special offer', 'promo code', 'coupon'
    ],
    hinglishKeywords: [
      'kuch discount milega', 'kam karo', 'best rate do', 'kam rate me hoga',
      'kuch offer hai', 'thoda kam kar do', 'offer chal raha hai kya'
    ],
    replyEn: `**Current Offers & Discounts:**\n\n• **Launch Offer:** Custom Mobile Apps are currently reduced from ₹45,000 to **₹29,999** (save ₹15,000)!\n• **Bundle Discount:** Buy Resto-X Lifetime (₹24,999) and get the Ojas AI Bot integrated for just ₹1,999 (saving ₹1,000).\n• **Milestone Payment:** 50% to initiate architecture sprint, 50% upon final sign-off.\n\nTo see if your project qualifies for a custom bundle discount, chat directly with founder Deep Mehta on WhatsApp!`,
    replyHi: `**मौजूदा ऑफर्स और डिस्काउंट्स:**\n\n• **लॉन्च ऑफर:** कस्टम मोबाइल ऐप पर ₹45,000 की जगह सिर्फ़ **₹29,999** का स्पेशल रेट (₹15,000 की सीधी बचत)!\n• **बंडल डिस्काउंट:** Resto-X लाइफटाइम के साथ Ojas AI बॉट लेने पर विशेष छूट उपलब्ध है।\n• **माइलस्टोन भुगतान:** 50% शुरुआत में और 50% डिलीवरी पर।\n\nअपने प्रोजेक्ट के लिए स्पेशल बंडल ऑफर जानने हेतु सीधे फ़ाउंडर Deep Mehta से WhatsApp पर बात करें!`,
    followUpChips: ['Talk to Founder on WhatsApp', 'Resto-X Pricing', '3-Week Custom App', 'Start Project']
  },
  {
    id: 'objection_trust_advance',
    category: 'objections',
    topic: 'trust',
    keywords: [
      'can i trust you', 'advance payment risk', 'will you run away', 'is it safe',
      'how to trust', 'scam or legit', 'legit company', 'payment safety'
    ],
    hinglishKeywords: [
      'advance lene ke baad bhag toh nahi jaoge', 'trust kaise kare', 'bharosa kaise kare',
      'dhokha toh nahi hoga', 'safe hai kya', 'company real hai kya', 'advance dena safe hai'
    ],
    replyEn: `**Why You Can Trust MyBooks 100%:**\n\n1. **Milestone-Based Protection:** You don't pay 100% upfront. You pay 50% to kick off architecture & UX design, and the remaining 50% only after you review and approve the working build.\n2. **Direct Founder Accountability:** You have direct WhatsApp and phone access to Founder Deep Mehta (+91 9644570828).\n3. **Verifiable Client Work:** We demonstrate live portfolios, working product demos, and client implementations before you spend a single rupee.\n4. **Official GST Invoicing:** All agreements and milestone payments are backed by official business invoices and written agreements.`,
    replyHi: `**MyBooks पर आप 100% भरोसा क्यों कर सकते हैं:**\n\n1. **माइलस्टोन सुरक्षा:** आपको पूरा भुगतान पहले नहीं करना होता। 50% ब्लूप्रिंट व डिज़ाइन पर और बाकी 50% सॉफ़्टवेयर पूरा देखने व संतुष्ट होने के बाद।\n2. **सीधी फ़ाउंडर जवाबदेही:** आपके पास संस्थापक Deep Mehta का सीधा WhatsApp व कॉलिंग नंबर (+91 9644570828) होता है।\n3. **लाइव डेमो व पोर्टफ़ोलियो:** एक भी रुपया खर्च करने से पहले हम आपको लाइव वर्किंग डेमो दिखाते हैं।\n4. **आधिकारिक GST इनवॉइस:** सभी पेमेंट्स का पक्का इनवॉइस और लिखित समझौता दिया जाता है।`,
    followUpChips: ['Book Free Demo', 'Talk to Deep Mehta', 'Client Reviews', 'Start Project']
  },
  {
    id: 'objection_source_code_proof',
    category: 'objections',
    topic: 'custom_software',
    keywords: [
      'do you really give source code', 'source code ownership', 'will i get source code',
      'full source code', 'github repo', 'database access', 'code handover'
    ],
    hinglishKeywords: [
      'source code sach me doge kya', 'code milega kya', 'poora code doge',
      'source code kiska hoga', 'database ka access milega'
    ],
    replyEn: `**Yes, 100% Full Source Code Handover Guaranteed:**\n\nWhen you purchase a Lifetime plan or custom build:\n• You receive the complete clean Git repository (frontend, backend, database migrations, and build scripts).\n• You receive full administrative access to your database.\n• You can host it on AWS, DigitalOcean, VPS, or local on-premise servers.\n• You have zero dependency on us—any competent developer can maintain or expand the code in the future.`,
    replyHi: `**हाँ, 100% पूरा सोर्स कोड देने की पक्की गारंटी है:**\n\nजब आप लाइफटाइम प्लान या कस्टम सॉफ़्टवेयर बनवाते हैं:\n• आपको पूरा Git रिपॉजिटरी (फ्रंटएंड, बैकएंड, डेटाबेस और स्क्रिप्ट्स) हैंडओवर किया जाता है।\n• डेटाबेस का पूरा एडमिन एक्सेस आपको मिलता है।\n• आप इसे अपने AWS, सर्वर या लोकल कंप्यूटर पर होस्ट कर सकते हैं।\n• भविष्य में आप किसी भी डेवलपर से इसमें नए फ़ीचर्स जुड़वा सकते हैं—हम पर कोई निर्भरता नहीं रहती।`,
    followUpChips: ['Tech Stack Used', '3-Week Timeline', 'Custom App Price', 'Connect on WhatsApp']
  },
  {
    id: 'objection_future_customization',
    category: 'objections',
    topic: 'custom_software',
    keywords: [
      'future customization', 'change features later', 'what if i need changes',
      'updates after launch', 'adding new features', 'post launch edits'
    ],
    hinglishKeywords: [
      'baad me feature change karwana ho toh', 'baad me change hoga kya', 'naye feature judenge',
      'changes kar sakte hai', 'baad me koi issue aaya toh'
    ],
    replyEn: `**Post-Launch Customization & Support:**\n\n• **Included 30-Day Free Polish:** All bug fixes, minor UX adjustments, and performance tweaks are 100% free for 30 days after deployment.\n• **Modular Code Architecture:** We engineer code in modern clean modular architecture (React, Node, TypeScript), making future feature additions straightforward.\n• **Flexible Future Sprints:** You can hire us for focused 1-week upgrade sprints, or use your own developers since you own 100% of the source code.`,
    replyHi: `**लॉन्च के बाद बदलाव और कस्टमाइज़ेशन:**\n\n• **30 दिन का मुफ़्त सपोर्ट:** डिलीवरी के 30 दिनों तक सभी बग फिक्स और छोटे बदलाव पूरी तरह मुफ़्त होते हैं।\n• **मॉड्यूलर क्लीन कोड:** कोड को इतना साफ़ और आधुनिक बनाया जाता है कि भविष्य में कोई भी नया फ़ीचर आसानी से जुड़ सके।\n• **लचीले अपग्रेड स्प्रिंट्स:** भविष्य में नए बड़े फ़ीचर्स के लिए आप हमारी टीम से स्प्रिंट करवा सकते हैं या अपने किसी भी डेवलपर से काम ले सकते हैं।`,
    followUpChips: ['Support Details', '3-Week Process', 'Talk to Deep Mehta', 'Start Project']
  },
  {
    id: 'objection_hidden_charges',
    category: 'objections',
    topic: 'pricing',
    keywords: [
      'hidden charges', 'hidden fees', 'any extra cost', 'maintenance fee', 'amc charges',
      'server cost', 'surprise fees'
    ],
    hinglishKeywords: [
      'koi hidden charge toh nahi', 'extra kharcha toh nahi hai', 'baad me extra maangoge',
      'amc kitna hai', 'hidden cost kya hai'
    ],
    replyEn: `**100% Transparent Pricing — Zero Hidden Charges:**\n\n• What we quote is exactly what you pay. No surprise line items.\n• For Lifetime licenses, there are **no compulsory annual maintenance contracts (AMC)**.\n• Third-party infrastructure costs (like Play Store $25 one-time registration or cloud server $5/mo) are paid directly to Google/host with zero markup from us.`,
    replyHi: `**100% पारदर्शी प्राइसिंग — कोई छिपा हुआ चार्ज नहीं:**\n\n• जो कोटेशन में तय होता है, वही अंतिम बिल होता है। कोई बाद का सरप्राइज चार्ज नहीं।\n• लाइफटाइम लाइसेंस में **कोई अनिवार्य वार्षिक मेंटेनेंस (AMC) नहीं होता**।\n• बाहरी खर्च (जैसे Play Store की $25 वन-टाइम फीस या सर्वर) सीधे प्रोवाइडर को जाते हैं, MyBooks उस पर कोई मार्जिन नहीं जोड़ता।`,
    followUpChips: ['All Pricing Plans', 'Lifetime vs Rental', 'Resto-X Price', 'Contact Us']
  },

  // =========================================================================
  // 2. COMPANY & FOUNDER
  // =========================================================================
  {
    id: 'company_overview',
    category: 'company',
    topic: 'company',
    keywords: [
      'about mybooks', 'what is mybooks', 'tell me about mybooks', 'who are you guys',
      'company profile', 'company information', 'mybooksx overview', 'what do you do'
    ],
    hinglishKeywords: [
      'mybooks kya hai', 'mybooks company kya karti hai', 'mybooks ke baare me batao',
      'ye company kya banati hai', 'aap kya kaam karte ho'
    ],
    replyEn: `**About MyBooks (MyBooksX):**\n\nMyBooks is a premier custom software engineering studio and SaaS creator founded by **Deep Mehta**. We specialize in:\n\n1. **Tailored Business Operating Systems:** High-performance POS, ERPs, and mobile applications built for real-world reliability.\n2. **Ready-to-Deploy Products:** Resto-X (Restaurant Suite), Event-X (Royal Wedding Suite), and Fitness-X (Gym Manager).\n3. **100% Source Code Ownership:** We empower business owners with full software freedom.\n4. **Rapid 3-Week Delivery:** Custom web and mobile apps engineered from scratch in just 21 days.`,
    replyHi: `**MyBooks (MyBooksX) के बारे में:**\n\nMyBooks एक प्रीमियम सॉफ़्टवेयर इंजीनियरिंग स्टूडियो और प्रॉडक्ट क्रिएटर है, जिसकी स्थापना **Deep Mehta** ने की है। हमारी मुख्य विशेषताएँ:\n\n1. **कस्टम बिज़नेस ऑपरेटिंग सिस्टम्स:** हाई-स्पीड POS, ERPs और मोबाइल ऐप्स जो कभी हैंग नहीं होते।\n2. **रेडी प्रॉडक्ट्स:** Resto-X (रेस्टोरेंट सुइट), Event-X (वेडिंग मैनेजमेंट), और Fitness-X (जिम सुइट)।\n3. **100% सोर्स कोड ओनरशिप:** बिज़नेस को किसी वेंडर का गुलाम नहीं रहने देते।\n4. **सिर्फ़ 3 हफ़्ते में डिलीवरी:** कस्टम ऐप्स और वेब पोर्टल्स 21 दिनों में रेडी।`,
    followUpChips: ['Who is Founder?', 'Why Choose MyBooks?', 'Explore Resto-X', 'Start Project']
  },
  {
    id: 'founder_deep_mehta',
    category: 'founder',
    topic: 'founder',
    keywords: [
      'who is deep mehta', 'founder of mybooks', 'who founded mybooks', 'deep mehta',
      'owner of mybooks', 'who is the owner', 'who started mybooks', 'ceo of mybooks'
    ],
    hinglishKeywords: [
      'deep mehta kaun hai', 'founder kaun hai', 'mybooks ka malik kaun hai',
      'owner kaun hai', 'deep mehta ke baare me batao', 'kiska company hai'
    ],
    replyEn: `**Deep Mehta is the founder and principal software architect of MyBooks.**\n\nDeep Mehta leads software design, engineering, and product development at MyBooks. He specializes in designing offline-first database architectures, full-stack web and native mobile applications, and AI integrations for real-world enterprise operations.\n\nYou can reach Deep Mehta directly on WhatsApp at **+91 9644570828**.`,
    replyHi: `**Deep Mehta MyBooks के संस्थापक (Founder) और मुख्य सॉफ़्टवेयर आर्किटेक्ट हैं।**\n\nDeep Mehta MyBooks के पूरे तकनीकी विज़न, प्रोडक्ट डिज़ाइन और इंजीनियरिंग का नेतृत्व करते हैं। वे ऑफ़लाइन-फ़र्स्ट आर्किटेक्चर, फुल-स्टैक मोबाइल व वेब सिस्टम्स और AI ऑटोमेशन के विशेषज्ञ हैं।\n\nआप सीधे Deep Mehta से WhatsApp (+91 9644570828) पर संपर्क कर सकते हैं।`,
    followUpChips: ['Chat with Deep Mehta on WhatsApp', 'Why choose MyBooks?', '3-Week Process', 'Company Overview']
  },
  {
    id: 'founder_experience',
    category: 'founder',
    topic: 'founder',
    keywords: [
      'founder experience', 'deep mehta background', 'what does deep mehta do',
      'founder portfolio', 'founder qualification', 'about the founder'
    ],
    hinglishKeywords: [
      'deep mehta ka background kya hai', 'founder kitne saal se kaam kar rahe hai',
      'deep mehta kya karte hai', 'founder ki detail'
    ],
    replyEn: `**About Founder Deep Mehta's Engineering Philosophy:**\n\nDeep Mehta approaches software development with a focus on **speed, extreme offline reliability, and zero vendor lock-in**. Rather than pushing bloated off-the-shelf software with monthly fees, Deep architects bespoke solutions that give founders permanent ownership of their technology.\n\nHe directly reviews the architecture blueprint of every single client project undertaken at MyBooks.`,
    replyHi: `**संस्थापक Deep Mehta की इंजीनियरिंग फिलॉसफी:**\n\nDeep Mehta का विज़न सॉफ़्टवेयर को **तेज़, 100% ऑफ़लाइन-सक्षम और वेंडर-बंधक मुक्त** बनाना है। वे बिज़नेस ओनर्स को महंगे मंथली रेंटल से आज़ाद कर उनके अपने सॉफ़्टवेयर का स्थायी मालिक बनाने में विश्वास रखते हैं।\n\nMyBooks के हर क्लाइंट प्रोजेक्ट के आर्किटेक्चर ब्लूप्रिंट की वे स्वयं समीक्षा करते हैं।`,
    followUpChips: ['Talk to Deep Mehta', 'Company Overview', 'Custom Software', 'Start Project']
  },
  {
    id: 'company_location',
    category: 'company',
    topic: 'company',
    keywords: [
      'where are you located', 'company location', 'office address', 'where is mybooks',
      'city', 'headquarters', 'visit office'
    ],
    hinglishKeywords: [
      'office kaha hai', 'address kya hai', 'kaha par ho', 'office visit kar sakte hai',
      'kis city me hai', 'location batao'
    ],
    replyEn: `**MyBooks Headquarters & Global Service:**\n\n• **Engineering Base:** Madhya Pradesh & Delhi NCR, India.\n• **Service Reach:** We serve clients globally across India, UAE, UK, and the US via seamless virtual sprints, Google Meet walkthroughs, and direct WhatsApp project coordination.\n• **Direct Contact:** +91 9644570828 | mybooksxofficial@gmail.com`,
    replyHi: `**MyBooks लोकेशन और सेवाएँ:**\n\n• **इंजीनियरिंग बेस:** मध्य प्रदेश व दिल्ली NCR, भारत।\n• **ग्लोबल सर्विस:** हम पूरे भारत, UAE, UK और US के क्लाइंट्स को वर्चुअल स्प्रिंट्स, Google Meet और डायरेक्ट WhatsApp के ज़रिए सेवा प्रदान करते हैं।\n• **संपर्क:** +91 9644570828 | mybooksxofficial@gmail.com`,
    followUpChips: ['Connect on WhatsApp', 'Schedule Google Meet Demo', 'Show Pricing', 'Founder Info']
  },
  {
    id: 'company_mission',
    category: 'company',
    topic: 'company',
    keywords: ['mission', 'vision', 'company goal', 'why mybooks exists', 'core values'],
    hinglishKeywords: ['mission kya hai', 'vision kya hai', 'company ka lakshya kya hai'],
    replyEn: `**The MyBooks Mission:**\n\nTo democratize enterprise-grade software ownership. We believe businesses should own their technology assets rather than paying perpetual rental rent to closed SaaS monopolies. We deliver speed, full source code, and lifetime peace of mind.`,
    replyHi: `**MyBooks का मिशन:**\n\nहर बिज़नेस को उच्च-स्तरीय सॉफ़्टवेयर का वास्तविक मालिक बनाना। हमारा मानना है कि बिज़नेसेस को बड़ी SaaS कंपनियों को जीवन भर किराया देने की बजाय अपने सॉफ़्टवेयर और डेटा का पूर्ण स्वामी होना चाहिए।`,
    followUpChips: ['Why choose MyBooks?', 'Lifetime License', 'Resto-X Demo', 'Start Project']
  },
  {
    id: 'client_testimonials',
    category: 'company',
    topic: 'company',
    keywords: ['reviews', 'testimonials', 'client feedback', 'ratings', 'customer reviews', 'proof of work'],
    hinglishKeywords: ['client review kya hai', 'customer feedback', 'dusre client kya bolte hai', 'review dikhao'],
    replyEn: `**Client Feedback & Track Record:**\n\n• **Restaurant Owners:** "Resto-X eliminated our weekend billing lags completely. The KOTs never stop even when our WiFi drops."\n• **Event Planners:** "Event-X made RSVP tracking and photo collection effortless for a 700-guest royal wedding."\n• **Gym Founders:** "Automated WhatsApp payment alerts recovered over ₹40,000 in overdue membership fees in our first month."`,
    replyHi: `**क्लाइंट्स का अनुभव और फ़ीडबैक:**\n\n• **रेस्टोरेंट ओनर्स:** "Resto-X ने हमारे वीकेंड बिलिंग लैग को पूरी तरह खत्म कर दिया। WiFi बंद होने पर भी KOT कभी नहीं रुकती।"\n• **इवेंट प्लानर्स:** "Event-X ने 700 मेहमानों की शादी में RSVP और फोटो शेयरिंग को बेहद आसान बना दिया।"\n• **जिम ओनर्स:** "ऑटोमैटिक WhatsApp रिन्यूअल अलर्ट्स ने पहले ही महीने में ₹40,000 की पेंडिंग फीस रिकवर करवा दी।"`,
    followUpChips: ['Book Free Demo', 'Resto-X Features', 'Fitness-X Features', 'Connect on WhatsApp']
  },
  {
    id: 'security_privacy',
    category: 'company',
    topic: 'company',
    keywords: ['security', 'privacy', 'is data confidential', 'data protection', 'gdpr', 'ndas'],
    hinglishKeywords: ['data chori toh nahi hoga', 'security kaisi hai', 'nda sign karoge', 'privacy policy'],
    replyEn: `**Data Security & Strict Confidentiality:**\n\n• We sign standard mutual Non-Disclosure Agreements (NDA) before initiating bespoke engineering projects.\n• Your customer and revenue data belongs exclusively to you—we never mine, sell, or advertise against client records.\n• Offline-first SQLite local installations ensure your transaction ledger stays on your physical machines.`,
    replyHi: `**डेटा सुरक्षा और पूर्ण गोपनीयता:**\n\n• प्रोजेक्ट शुरू होने से पहले हम आधिकारिक NDA (Non-Disclosure Agreement) साइन करते हैं।\n• आपका कस्टमर और सेल्स डेटा सिर्फ़ आपका है—हम कभी डेटा बेचते या शेयर नहीं करते।\n• ऑफ़लाइन लोकल डेटाबेस के कारण आपका बिलिंग डेटा आपके अपने कंप्यूटर पर पूरी तरह सुरक्षित रहता है।`,
    followUpChips: ['Data Backup System', 'Why Choose MyBooks', 'Talk to Deep Mehta', 'Start Project']
  },

  // =========================================================================
  // 3. RESTO-X RESTAURANT OPERATING SUITE
  // =========================================================================
  {
    id: 'resto_x_overview',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: [
      'resto-x', 'resto x', 'restaurant software', 'restaurant pos', 'resto suite',
      'cafe software', 'food billing software', 'dining software'
    ],
    hinglishKeywords: [
      'resto x kya hai', 'restaurant ka software', 'cafe billing software',
      'hotel billing app', 'restaurant pos software', 'khana billing'
    ],
    replyEn: `**Resto-X — All-in-One Restaurant & Cafe Operating Suite:**\n\nResto-X is engineered for high-volume dining, cafes, QSRs, and cloud kitchens:\n\n• **Instant Billing & KOT:** Fire kitchen tickets in less than 2 seconds.\n• **100% Offline-Resilient:** Never stops during internet outages.\n• **Table QR Digital Menus:** Guests scan QR to order directly.\n• **Free Android Waiter App:** Waiters punch orders table-side.\n• **Live Stock & Recipe Inventory:** Automatic ingredient deduction.\n• **GST & Daily Cash Flow Reports:** Single-click accounting exports.`,
    replyHi: `**Resto-X — रेस्टोरेंट और कैफ़े के लिए संपूर्ण ऑपरेटिंग सुइट:**\n\nResto-X फ़ाइन डाइन, कैफ़े, QSR और क्लाउड किचन के लिए डिज़ाइन किया गया है:\n\n• **सुपरफास्ट बिलिंग व KOT:** सिर्फ़ 2 सेकंड में किचन टिकट प्रिंट।\n• **100% ऑफ़लाइन सक्षम:** इंटरनेट बंद होने पर भी बिलिंग कभी नहीं रुकती।\n• **टेबल QR डिजिटल मेन्यू:** ग्राहक QR स्कैन कर सीधे ऑर्डर कर सकते हैं।\n• **मुफ़्त Android वेटर ऐप:** वेटर टेबल पर खड़े होकर ऑर्डर ले सकते हैं।\n• **लाइव स्टॉक व रेसिपी इन्वेंटरी:** सामग्री की ऑटो-कटौती।\n• **GST व दैनिक सेल्स रिपोर्ट्स:** 1-क्लिक में एकाउंटिंग तैयार।`,
    followUpChips: ['Resto-X Pricing', 'Resto-X Demo', 'Does it work offline?', 'Free Waiter App']
  },
  {
    id: 'resto_x_pricing',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: [
      'resto-x price', 'resto x cost', 'restaurant pos price', 'resto license price',
      'resto subscription', 'how much for resto x'
    ],
    hinglishKeywords: [
      'resto x kitne ka hai', 'resto x price kya hai', 'restaurant software ka rate',
      'resto x kitna paisa lagega', 'resto x ki fees'
    ],
    replyEn: `**Resto-X Transparent Pricing Plans:**\n\n1. **Yearly License — ₹4,999/year**\n   • Unlimited orders, tables, and KOTs\n   • Cloud sync & automatic backup\n   • Priority 24/7 WhatsApp support\n\n2. **Permanent Lifetime Ownership — ₹24,999 (One-Time)**\n   • **100% Full Source Code & Database Ownership**\n   • **Complimentary Android Waiter App included (Free)**\n   • Run forever without renewal fees\n   • Optional Ojas AI integration: +₹2,500 permanent.`,
    replyHi: `**Resto-X प्राइसिंग प्लान्स:**\n\n1. **इयरली लाइसेंस — ₹4,999/साल**\n   • अनलिमिटेड ऑर्डर्स, टेबल्स व KOTs\n   • क्लाउड सिंक और ऑटो-बैकअप\n   • 24/7 प्राथमिकता WhatsApp सपोर्ट\n\n2. **परमानेंट लाइफटाइम ओनरशिप — ₹24,999 (एकमुश्त)**\n   • **100% फुल सोर्स कोड और डेटाबेस का मालिकाना हक**\n   • **मुफ़्त Android वेटर ऐप शामिल**\n   • बिना किसी वार्षिक रिन्यूअल फीस के जीवन भर इस्तेमाल करें\n   • Ojas AI बॉट ऐड-ऑन: मात्र +₹2,500 परमानेंट।`,
    followUpChips: ['Book Resto-X Demo', 'Why Lifetime is Better', 'Waiter App Details', 'Talk on WhatsApp']
  },
  {
    id: 'resto_x_offline_billing',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: [
      'resto-x offline', 'does it work offline', 'without internet billing', 'offline pos',
      'internet down', 'offline kot'
    ],
    hinglishKeywords: [
      'bina internet chalega kya', 'offline kaam karega', 'net band hone par kya hoga',
      'offline billing hoti hai kya', 'wifi band ho jaye toh'
    ],
    replyEn: `**Yes! Resto-X is 100% Offline-First:**\n\nResto-X uses an embedded high-speed SQLite database engine directly on your terminal. \n\n• You can create tables, take orders, punch KOTs, print bills, and track cash sales with zero internet connection.\n• The moment internet restores, it quietly syncs data with the cloud in the background.\n• Your restaurant never stops, even during network failures.`,
    replyHi: `**हाँ! Resto-X 100% ऑफ़लाइन-फ़र्स्ट काम करता है:**\n\nResto-X आपके सिस्टम पर हाई-स्पीड लोकल SQLite डेटाबेस का इस्तेमाल करता है।\n\n• बिना इंटरनेट के भी टेबल ऑर्डर, KOT प्रिंटिंग, बिलिंग और कैश कलेक्शन बिना किसी रुकावट के चलता है।\n• जैसे ही इंटरनेट दोबारा कनेक्ट होता है, यह बैकग्राउंड में क्लाउड से ऑटोमैटिक सिंक हो जाता है।\n• नेटवर्क खराब होने पर भी आपका रेस्टोरेंट कभी धीमा नहीं पड़ता।`,
    followUpChips: ['Thermal Printer Support', 'Resto-X Pricing', 'Book Free Demo', 'Waiter App Details']
  },
  {
    id: 'resto_x_waiter_app',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: [
      'waiter app', 'android waiter app', 'captain app', 'table ordering app',
      'waiter tablet', 'mobile kot'
    ],
    hinglishKeywords: [
      'waiter app milega kya', 'vaiter ka app', 'waiter mobile se order le sakta hai',
      'captain ordering app', 'waiter app free hai kya'
    ],
    replyEn: `**Complimentary Android Waiter App:**\n\nWith Resto-X Permanent Lifetime, the Android Waiter/Captain App is included **100% free of charge**:\n\n• Waiters punch orders right at the customer's table from any affordable Android phone or tablet.\n• Instantly transmits order items to the respective Kitchen Display / KOT thermal printer.\n• Handles special notes ("less spicy", "no onions") in real-time.`,
    replyHi: `**कॉम्प्लिमेंट्री Android वेटर ऐप:**\n\nResto-X परमानेंट लाइफटाइम के साथ Android वेटर/कैप्टन ऐप **पूरी तरह मुफ़्त** मिलता है:\n\n• वेटर किसी भी सामान्य Android फ़ोन या टैबलेट से सीधे ग्राहक की टेबल पर ऑर्डर ले सकते हैं।\n• ऑर्डर पंच होते ही किचन में लगे थर्मल प्रिंटर पर तुरंत KOT प्रिंट हो जाता है।\n• स्पेशल कुकिंग नोट्स ("कम तीखा", "बिना प्याज") तुरंत किचन तक पहुँचते हैं।`,
    followUpChips: ['Resto-X Lifetime Price', 'KOT Management', 'Book Free Demo', 'Connect on WhatsApp']
  },
  {
    id: 'resto_x_kot',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: [
      'kot', 'kitchen order ticket', 'kitchen printer', 'kot management',
      'multiple kitchens', 'bar kot'
    ],
    hinglishKeywords: [
      'kot kaise print hota hai', 'kitchen me slip kaise jayegi', 'kot print speed',
      'multiple kitchen kot'
    ],
    replyEn: `**Resto-X Advanced KOT Engine:**\n\n• Prints KOT in under 1.5 seconds to thermal printers (USB, LAN, Bluetooth, WiFi).\n• Supports multi-station routing (e.g., Food items print in Kitchen, Beverage items print at the Bar automatically).\n• KOT cancellation with reason tracking to prevent staff food theft.`,
    replyHi: `**Resto-X एडवांस KOT इंजन:**\n\n• सिर्फ़ 1.5 सेकंड में USB, LAN, Bluetooth या WiFi थर्मल प्रिंटर पर KOT प्रिंट।\n• मल्टी-स्टेशन रूटिंग: खाने के आइटम किचन प्रिंटर पर और ड्रिंक्स बार प्रिंटर पर अपने आप अलग-अलग प्रिंट होते हैं।\n• स्टाफ द्वारा चोरी रोकने के लिए कारण सहित KOT कैंसलेशन ट्रैकिंग।`,
    followUpChips: ['Thermal Printer Compatibility', 'Resto-X Pricing', 'Inventory Management', 'Book Demo']
  },
  {
    id: 'resto_x_printers',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: [
      'thermal printer', 'bill printer', 'printer support', '58mm printer', '80mm printer',
      'tsc printer', 'epson printer', 'pos printer'
    ],
    hinglishKeywords: [
      'kaunsa printer chalega', 'bill printer support', 'thermal printer compatible hai',
      'printer connect kaise hoga'
    ],
    replyEn: `**Universal Printer Compatibility:**\n\nResto-X works natively with all ESC/POS thermal printers:\n• 58mm (2-inch) and 80mm (3-inch) paper sizes.\n• Connection types: USB, Network/LAN, Bluetooth, and WiFi.\n• Compatible with Epson, TVS-E, NGX, Everycom, Retsol, and standard OEM thermal printers.`,
    replyHi: `**सभी प्रिंटर्स के साथ 100% कम्पैटिबल:**\n\nResto-X सभी स्टैंडर्ड ESC/POS थर्मल प्रिंटर्स को सपोर्ट करता है:\n• 58mm (2-इंच) और 80mm (3-इंच) पेपर साइज।\n• कनेक्टिविटी: USB, LAN, Bluetooth और WiFi।\n• Epson, TVS, NGX, Everycom और अन्य सभी ब्रांड्स पर आसानी से चलता है।`,
    followUpChips: ['Resto-X Overview', 'Resto-X Pricing', 'Book Free Demo', 'Contact Us']
  },
  {
    id: 'resto_x_inventory',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: [
      'resto inventory', 'recipe management', 'stock tracking', 'raw materials',
      'ingredient deduction', 'food cost'
    ],
    hinglishKeywords: [
      'stock kaise track hoga', 'recipe management hai kya', 'raw material ka hisab',
      'inventory management resto x'
    ],
    replyEn: `**Resto-X Recipe & Raw Material Inventory:**\n\n• Link recipes to menu items (e.g., selling 1 Pizza auto-deducts 200g cheese, 1 base, 50g sauce).\n• Real-time low-stock alerts on WhatsApp and manager dashboard.\n• Purchase order entry and supplier payment records.`,
    replyHi: `**Resto-X रेसिपी व कच्चा माल इन्वेंटरी:**\n\n• मेन्यू आइटम के साथ रेसिपी लिंक करें (जैसे 1 पिज़्ज़ा बिकने पर 200g चीज़ और सॉस स्टॉक से अपने आप कम हो जाएगी)।\n• स्टॉक कम होने पर WhatsApp और डैशबोर्ड पर तुरंत अलर्ट।\n• सप्लायर परचेज़ एंट्री और बकाया भुगतान का पूरा हिसाब।`,
    followUpChips: ['Resto-X Pricing', 'Resto-X Demo', 'GST Reports', 'Talk on WhatsApp']
  },
  {
    id: 'resto_x_table_qr',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: [
      'table qr', 'qr menu', 'scan to order', 'digital dining', 'qr ordering',
      'contactless menu'
    ],
    hinglishKeywords: [
      'qr code se order kaise hoga', 'table qr menu', 'qr scan karke order',
      'digital menu card'
    ],
    replyEn: `**Resto-X Table QR Digital Ordering:**\n\n• Place unique QR codes on every dining table.\n• Customers scan using their phone camera to view an enticing digital photo menu.\n• Customers can order directly or call the waiter with one tap.\n• Reduces waiter labor by up to 40% during rush hours.`,
    replyHi: `**Resto-X टेबल QR डिजिटल ऑर्डरिंग:**\n\n• हर टेबल के लिए अलग QR कोड।\n• ग्राहक अपने फ़ोन से QR स्कैन करके सुंदर फोटो मेन्यू देख सकते हैं।\n• सीधे फ़ोन से ऑर्डर या वेटर को एक क्लिक में बुला सकते हैं।\n• व्यस्त समय में वेटर की मेहनत 40% तक कम हो जाती है।`,
    followUpChips: ['Resto-X Pricing', 'Free Waiter App', 'Book Live Demo', 'Start Project']
  },
  {
    id: 'resto_x_multi_counter',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: ['multi counter', 'food court', 'multiple billing terminals', 'lan sync'],
    hinglishKeywords: ['multiple counter chalenge', 'do computer par billing', 'food court billing'],
    replyEn: `**Multi-Terminal Local LAN Sync:**\n\nResto-X supports multi-counter setups effortlessly (e.g., Counter 1, Counter 2, Bar counter, and Kitchen Displays) running simultaneously over your local WiFi network, even with the main internet down!`,
    replyHi: `**मल्टी-काउंटर लोकल LAN सिंक:**\n\nResto-X में कई काउंटर (जैसे काउंटर 1, काउंटर 2, बार और किचन) बिना इंटरनेट के भी लोकल WiFi पर एक साथ सिंक होकर काम करते हैं।`,
    followUpChips: ['Resto-X Pricing', 'Book Free Demo', 'Offline Billing', 'Contact Us']
  },
  {
    id: 'resto_x_swiggy_zomato',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: ['swiggy zomato', 'online orders integration', 'zomato integration', 'swiggy pos'],
    hinglishKeywords: ['swiggy zomato order aayega', 'swiggy connect hoga', 'zomato order kot'],
    replyEn: `**Online Aggregator Support:**\n\nResto-X provides dedicated modules to log Swiggy and Zomato orders alongside dining tables, print instant aggregator KOTs, and produce unified end-of-day sales reconciliations.`,
    replyHi: `**Swiggy व Zomato ऑर्डर मैनेजमेंट:**\n\nResto-X में Swiggy और Zomato के ऑनलाइन ऑर्डर्स को डाइन-इन ऑर्डर्स के साथ एक जगह मैनेज करने, तुरंत KOT निकालने और दिन के अंत में संयुक्त बिक्री रिपोर्ट निकालने की सुविधा है।`,
    followUpChips: ['Resto-X Demo', 'Resto-X Pricing', 'Inventory Management', 'Talk to Deep Mehta']
  },
  {
    id: 'resto_x_demo',
    category: 'demo',
    topic: 'resto_x',
    keywords: ['resto demo', 'see restox in action', 'restaurant software trial', 'pos demo'],
    hinglishKeywords: ['resto x ka demo dikhao', 'restaurant software trial', 'demo dekhna hai resto x'],
    replyEn: `**Book a 15-Minute Live Resto-X Walkthrough:**\n\nWe will show you live billing, table QR ordering, KOT printing, and the Waiter App on a live Google Meet or WhatsApp Screen Share. Click below to schedule immediately with Founder Deep Mehta!`,
    replyHi: `**Resto-X का 15 मिनट का लाइव डेमो बुक करें:**\n\nहम आपको Google Meet या WhatsApp पर लाइव बिलिंग, KOT प्रिंटिंग और वेटर ऐप चलाकर दिखाएंगे। नीचे क्लिक करके सीधे फ़ाउंडर Deep Mehta से अभी डेमो स्लॉट लें!`,
    followUpChips: ['Book Resto-X Demo on WhatsApp', 'Resto-X Pricing', 'Compare Petpooja', 'Start Project']
  },

  // =========================================================================
  // 4. EVENT-X ROYAL WEDDING & EVENTS SUITE
  // =========================================================================
  {
    id: 'event_x_overview',
    category: 'event_x',
    topic: 'event_x',
    keywords: [
      'event-x', 'event x', 'wedding app', 'wedding software', 'event management suite',
      'shaadi app', 'wedding website'
    ],
    hinglishKeywords: [
      'event x kya hai', 'shaadi ka app', 'wedding card digital', 'event x suite',
      'shaadi website', 'vivah app'
    ],
    replyEn: `**Event-X — Royal Wedding & Event Management Suite:**\n\nCreated for memorable weddings, galas, and VIP corporate events:\n\n• **Digital RSVP Portal:** Guests confirm attendance with dietary & travel details.\n• **Live Guest Photo Vault:** High-resolution collective photo upload from all guests.\n• **Ceremony Timeline & GPS Navigation:** Interactive schedule with Google Map directions to each venue.\n• **₹2,999 Permanent Lifetime License** with zero recurring hosting fees!`,
    replyHi: `**Event-X — रॉयल वेडिंग व इवेंट मैनेजमेंट सुइट:**\n\nविवाह समारोहों और भव्य आयोजनों के लिए तैयार:\n\n• **डिजिटल RSVP पोर्टल:** मेहमान अपनी उपस्थिति, आने की तारीख और भोजन पसंद कन्फर्म करते हैं।\n• **लाइव फोटो वॉल्ट:** सभी मेहमानों द्वारा खींची गई हाई-क्वालिटी फ़ोटो एक जगह सुरक्षित।\n• **सेरेमनी शेड्यूल व GPS नेविगेशन:** हल्दी, मेहंदी और बारात का पूरा समय और वेन्यू का लाइव मैप।\n• **सिर्फ़ ₹2,999 परमानेंट लाइफटाइम** — कोई अतिरिक्त होस्टिंग खर्च नहीं!`,
    followUpChips: ['Event-X Features', 'Event-X Pricing', 'Book Event-X', 'Talk on WhatsApp']
  },
  {
    id: 'event_x_pricing',
    category: 'event_x',
    topic: 'event_x',
    keywords: [
      'event-x price', 'event x cost', 'wedding app cost', 'event-x license', 'how much for event-x'
    ],
    hinglishKeywords: [
      'event x kitne ka hai', 'shaadi app ka rate', 'event x price kya hai'
    ],
    replyEn: `**Event-X Pricing:**\n\n• **Permanent Lifetime Access: ₹2,999 (One-Time)**\n• Includes custom couple branding, interactive itinerary, GPS maps, RSVP collector, and 1-year active photo storage vault.\n• Ready to deploy in just 48–72 hours!`,
    replyHi: `**Event-X की क़ीमत:**\n\n• **परमानेंट लाइफटाइम लाइसेंस: ₹2,999 (एकमुश्त)**\n• दूल्हा-दुल्हन की ब्रांडिंग, डिजिटल इनविटेशन, GPS वेन्यू मैप्स, RSVP और 1 साल का फोटो वॉल्ट शामिल।\n• सिर्फ़ 48 से 72 घंटों में तैयार होकर लाइव!`,
    followUpChips: ['Book Event-X', 'Event-X RSVP', 'Photo Vault Details', 'Connect on WhatsApp']
  },
  {
    id: 'event_x_rsvp',
    category: 'event_x',
    topic: 'event_x',
    keywords: [
      'event-x rsvp', 'wedding rsvp', 'guest tracking', 'guest list wedding', 'rsvp management'
    ],
    hinglishKeywords: [
      'rsvp kaise kaam karta hai', 'mehmano ki list', 'guest attendance shaadi'
    ],
    replyEn: `**Event-X Guest RSVP & Attendance Tracking:**\n\n• Guests receive a branded link or QR code on WhatsApp.\n• They mark coming/not coming, number of family members, arrival flight/train time, and room requirements.\n• Family host receives a real-time Excel summary of all confirmed attendees.`,
    replyHi: `**Event-X गेस्ट RSVP और अटेंडेंस मैनेजमेंट:**\n\n• मेहमानों को WhatsApp पर सुंदर डिजिटल लिंक मिलता है।\n• वे आने वाले सदस्यों की संख्या, पहुँचने का समय और होटल रूम की ज़रूरत दर्ज करते हैं।\n• परिवार के पास पूरी एक्सेल लिस्ट लाइव अपडेट होती रहती है।`,
    followUpChips: ['Event-X Pricing', 'Book Event-X', 'Photo Vault', 'WhatsApp Contact']
  },
  {
    id: 'event_x_photo_vault',
    category: 'event_x',
    topic: 'event_x',
    keywords: ['photo vault', 'guest photos', 'wedding photo sharing', 'live photo gallery'],
    hinglishKeywords: ['photo kaise upload hogi', 'shaadi ki photo sab kaise dekhenge', 'live gallery'],
    replyEn: `**Live Guest Photo Vault:**\n\nGuests scan a QR code at tables to upload candid pictures directly from their smartphones in original resolution without needing to install an app. All photos aggregate into a private digital album for the family.`,
    replyHi: `**लाइव गेस्ट फोटो वॉल्ट:**\n\nमेहमान बिना कोई ऐप डाउनलोड किए सीधे QR स्कैन करके अपने फ़ोन से असली क्वालिटी में फ़ोटो अपलोड करते हैं। सारी तस्वीरें परिवार के सुरक्षित प्राइवेट एल्बम में जमा होती हैं।`,
    followUpChips: ['Event-X Pricing', 'Book Event-X', 'Venue GPS', 'Contact Us']
  },
  {
    id: 'event_x_gps_maps',
    category: 'event_x',
    topic: 'event_x',
    keywords: ['venue gps', 'wedding directions', 'ceremony maps', 'event schedule'],
    hinglishKeywords: ['venue ka rasta', 'google map link shaadi', 'haldi mehandi schedule'],
    replyEn: `**Interactive Ceremony Itinerary & GPS:**\n\nProvides 1-tap Google Maps routing for each event venue (e.g. Haldi, Sangeet, Wedding Resort) so out-of-town guests never get lost, plus dress-code suggestions.`,
    replyHi: `**सेरेमनी शेड्यूल व 1-टैप GPS मैप्स:**\n\nहल्दी, संगीत और विवाह स्थल के लिए 1-टैप Google Maps नेविगेशन जिससे बाहर से आए मेहमान बिना भटके आसानी से पहुँच सकें।`,
    followUpChips: ['Event-X Pricing', 'RSVP Portal', 'Book Event-X', 'Talk on WhatsApp']
  },

  // =========================================================================
  // 5. FITNESS-X GYM & WELLNESS SUITE
  // =========================================================================
  {
    id: 'fitness_x_overview',
    category: 'fitness_x',
    topic: 'fitness_x',
    keywords: [
      'fitness-x', 'fitness x', 'gym software', 'gym management', 'fitness club software',
      'gym billing', 'gym attendance'
    ],
    hinglishKeywords: [
      'fitness x kya hai', 'gym ka software', 'gym management system', 'kasrat app',
      'gym fees app'
    ],
    replyEn: `**Fitness-X — Modern Gym & Wellness Studio Manager:**\n\nEngineered for gyms, yoga studios, CrossFit boxes, and martial arts centers:\n\n• **QR Code Member Check-in:** Contactless attendance via scanner or mobile.\n• **Automated WhatsApp Renewal Alerts:** Sends fee expiry reminders before memberships lapse.\n• **Trainer & Slot Scheduling:** Manage personal training appointments.\n• **Diet & Workout Plan Vault:** Assign PDF or structured routine cards to members.`,
    replyHi: `**Fitness-X — मॉडर्न जिम और वेलनेस स्टूडियो सॉफ़्टवेयर:**\n\nजिम, योग स्टूडियो और फिटनेस सेंटर्स के लिए तैयार:\n\n• **QR कोड मेंबर अटेंडेंस:** स्कैनर या मोबाइल से बिना छुए तुरंत हाज़िरी।\n• **ऑटोमेटेड WhatsApp फीस अलर्ट:** फीस समाप्त होने से पहले मेम्बर्स को रिन्यूअल अलर्ट।\n• **ट्रेनर और स्लॉट शेड्यूलिंग:** पर्सनल ट्रेनिंग स्लॉट्स का आसान प्रबंधन।\n• **डाइट व वर्कआउट प्लान्स:** सदस्यों को उनके डाइट चार्ट सीधे WhatsApp पर भेजें।`,
    followUpChips: ['Fitness-X Pricing', 'QR Attendance', 'WhatsApp Alerts', 'Book Free Demo']
  },
  {
    id: 'fitness_x_pricing',
    category: 'fitness_x',
    topic: 'fitness_x',
    keywords: [
      'fitness-x price', 'gym software cost', 'fitness x rate', 'fitness subscription'
    ],
    hinglishKeywords: [
      'fitness x kitne ka hai', 'gym software ka rate', 'fitness x price'
    ],
    replyEn: `**Fitness-X Pricing Plans:**\n\n• **Yearly Plan:** ₹999/year (cloud backup & WhatsApp notification engine).\n• **Permanent Lifetime License:** ₹2,999 one-time (complete ownership, unlimited members, zero monthly fees)!\n• Hardware integration: Compatible with standard USB QR code barcode scanners.`,
    replyHi: `**Fitness-X प्राइसिंग प्लान्स:**\n\n• **इयरली प्लान:** ₹999/साल (क्लाउड बैकअप और WhatsApp इंजन सहित)।\n• **परमानेंट लाइफटाइम ओनरशिप:** ₹2,999 एक बार (अनलिमिटेड मेम्बर्स, कोई मंथली फीस नहीं)!\n• हार्डवेयर: सभी स्टैंडर्ड USB QR स्कैनर के साथ कम्पैटिबल।`,
    followUpChips: ['Book Fitness-X', 'WhatsApp Renewal Alerts', 'Show All Pricing', 'Contact Us']
  },
  {
    id: 'fitness_x_whatsapp_alerts',
    category: 'fitness_x',
    topic: 'fitness_x',
    keywords: ['gym renewal alerts', 'whatsapp reminders gym', 'fee expiry message', 'gym fees notice'],
    hinglishKeywords: ['gym fees reminder whatsapp', 'fees khatam hone ka message', 'renewal alert gym'],
    replyEn: `**Automated WhatsApp Fee Reminders:**\n\nFitness-X automatically sends polite branded reminder messages 3 days before and on the day of membership expiry with payment UPI QR codes. Increases fee renewal recovery by over 35%.`,
    replyHi: `**ऑटोमेटेड WhatsApp फीस रिमाइंडर्स:**\n\nमेंबरशिप समाप्त होने से 3 दिन पहले और समाप्ति के दिन सदस्यों को UPI पेमेंट लिंक सहित सम्मानजनक अलर्ट अपने आप पहुँचता है। इससे 35% अधिक फीस समय पर प्राप्त होती है।`,
    followUpChips: ['Fitness-X Pricing', 'QR Attendance Details', 'Book Demo', 'Connect on WhatsApp']
  },
  {
    id: 'fitness_x_qr_attendance',
    category: 'fitness_x',
    topic: 'fitness_x',
    keywords: ['gym attendance', 'qr check in gym', 'biometric gym', 'member checkin'],
    hinglishKeywords: ['gym me haziri kaise lagegi', 'qr attendance gym', 'member entry'],
    replyEn: `**Touchless Member QR Attendance:**\n\nMembers scan their personal digital membership card QR at the front desk or mobile scanner to clock in. Instantly flags expired members at the door.`,
    replyHi: `**टचलेस QR मेंबर अटेंडेंस:**\n\nसदस्य फ्रंट डेस्क पर लगे QR स्कैनर पर अपना डिजिटल कार्ड दिखाते हैं और हाज़िरी लग जाती है। अगर किसी की फीस खत्म हो चुकी है तो स्क्रीन पर तुरंत रेड अलर्ट दिखता है।`,
    followUpChips: ['Fitness-X Pricing', 'Book Free Demo', 'Show All Pricing', 'Talk on WhatsApp']
  },

  // =========================================================================
  // 6. CUSTOM SOFTWARE & MOBILE APPS (3-Week Delivery Guarantee)
  // =========================================================================
  {
    id: 'custom_software_overview',
    category: 'custom_software',
    topic: 'custom_software',
    keywords: [
      'custom software', 'build an app', 'custom mobile app', 'bespoke software',
      'custom android', 'custom ios', 'web erp', 'custom development'
    ],
    hinglishKeywords: [
      'apne hisab se app banwana hai', 'custom software banwana hai', 'kustom app',
      'app banwane ka kharcha', 'custom erp software'
    ],
    replyEn: `**Custom Software & Mobile App Engineering (3-Week Delivery):**\n\nWe build full-stack, enterprise-grade mobile and web applications customized exactly to your business workflow:\n\n• **Launch Offer:** Custom Mobile App from **₹29,999** (was ₹45,000).\n• **Custom Web ERP / Dashboard:** From **₹24,999**.\n• **Timeline:** 21 days (3 weeks) from architecture blueprint to deployment.\n• **100% Source Code & Database Ownership Handed to You.**`,
    replyHi: `**कस्टम सॉफ़्टवेयर व मोबाइल ऐप डेवलपमेंट (3 हफ़्ते में डिलीवरी):**\n\nहम आपके बिज़नेस के वर्कफ़्लो अनुसार विशेष कस्टम मोबाइल ऐप्स और वेब सिस्टम्स तैयार करते हैं:\n\n• **स्पेशल लॉन्च ऑफर:** कस्टम मोबाइल ऐप मात्र **₹29,999** से शुरू (पहले ₹45,000)।\n• **कस्टम वेब ERP व डैशबोर्ड:** मात्र **₹24,999** से शुरू।\n• **डिलीवरी समय:** सिर्फ़ 21 दिन (3 हफ़्ते) ब्लूप्रिंट से लाइव होने तक।\n• **100% फुल सोर्स कोड और डेटाबेस का मालिकाना हक आपका।**`,
    followUpChips: ['3-Week Timeline Details', 'Start My App Project', 'Source Code Guarantee', 'Tech Stack Used']
  },
  {
    id: 'custom_delivery_timeline',
    category: 'timeline',
    topic: 'timeline',
    keywords: [
      '3-week delivery', 'timeline', 'how long to build app', 'duration', 'development time',
      'delivery guarantee', '21 days'
    ],
    hinglishKeywords: [
      'kitna time lagega', 'kitne din me banega', 'delivery kitne din me',
      '3 hafte me kaise banega', 'time duration'
    ],
    replyEn: `**Our 3-Week (21-Day) Engineering Sprint:**\n\n1. **Days 1–3 — Architecture & Blueprint:** Complete database schema, API mapping, and technical specs.\n2. **Days 4–7 — Interactive Figma Prototype:** High-fidelity clickable wireframes reviewed with you.\n3. **Days 8–16 — Core Agile Sprints:** Backend APIs, frontend UI, database integration, and security layer.\n4. **Days 17–19 — QA & Stress Testing:** Automated test suites, device compatibility, and offline test.\n5. **Days 20–21 — Production Release:** Server configuration, domain binding, and Play Store publishing.`,
    replyHi: `**हमारा 3-हफ़्ते (21-दिन) का इंजीनियरिंग स्प्रिंट:**\n\n1. **दिन 1–3 — आर्किटेक्चर ब्लूप्रिंट:** डेटाबेस स्ट्रक्चर और तकनीकी ब्लूप्रिंट तैयार करना।\n2. **दिन 4–7 — इंटरैक्टिव UI प्रोटोटाइप:** क्लिक करने योग्य डिज़ाइन आपको दिखाकर मंज़ूरी लेना।\n3. **दिन 8–16 — कोर डेवलपमेंट स्प्रिंट्स:** बैकएंड API, डेटाबेस और मुख्य फ़ीचर्स की कोडिंग।\n4. **दिन 17–19 — टेस्टिंग व QA:** सुरक्षा जांच, डिवाइस कम्पैटिबिलिटी और ऑफ़लाइन टेस्टिंग।\n5. **दिन 20–21 — लाइव डिप्लॉयमेंट:** लाइव सर्वर सेटअप और प्ले स्टोर पर पब्लिशिंग।`,
    followUpChips: ['Start Project Now', 'Milestone Payment Terms', 'Custom App Price', 'Connect on WhatsApp']
  },
  {
    id: 'custom_tech_stack',
    category: 'tech',
    topic: 'custom_software',
    keywords: [
      'tech stack', 'technologies', 'programming language', 'framework', 'database',
      'what tech do you use', 'architecture'
    ],
    hinglishKeywords: [
      'kaunsi technology use karte ho', 'tech stack kya hai', 'kis language me banate ho',
      'react use karte ho kya', 'flutter ya react native'
    ],
    replyEn: `**Modern, High-Performance Tech Stack:**\n\n• **Frontend:** React 19, TypeScript, Next.js, Flutter / React Native for Android & iOS.\n• **Backend:** Node.js, Express, Fastify, Python (FastAPI/Django).\n• **Databases:** PostgreSQL, SQLite (embedded offline-first), Redis, Supabase.\n• **Cloud & DevOps:** Docker, AWS, Cloudflare, DigitalOcean, Linux VPS.\n• **Security:** JWT authentication, bcrypt hashing, SSL encryption, automated daily offsite backups.`,
    replyHi: `**हमारा आधुनिक और हाई-परफ़ॉर्मेंस टेक स्टैक:**\n\n• **फ्रंटएंड:** React 19, TypeScript, Next.js, और Android/iOS के लिए Flutter / React Native।\n• **बैकएंड:** Node.js, Express, Fastify, और Python (FastAPI)।\n• **डेटाबेस:** PostgreSQL, SQLite (ऑफ़लाइन-फ़र्स्ट), Redis और Supabase।\n• **क्लाउड:** AWS, Cloudflare, DigitalOcean, और Docker कंटेनर्स।\n• **सुरक्षा:** एंड-टू-एंड एन्क्रिप्शन, JWT ऑथेंटिकेशन और ऑटोमैटिक डेली बैकअप।`,
    followUpChips: ['Custom App Pricing', 'Source Code Ownership', '3-Week Timeline', 'Start Project']
  },
  {
    id: 'custom_android_app',
    category: 'custom_software',
    topic: 'custom_software',
    keywords: ['android app development', 'build android app', 'play store app', 'native android'],
    hinglishKeywords: ['android app banwana hai', 'play store par dalna hai', 'android app kitne me banegi'],
    replyEn: `**Custom Android App Engineering:**\n\n• Launch Offer: **₹29,999** complete.\n• Includes UI/UX design, offline-capable database, push notifications, payment gateway, and Google Play Store submission assistance.`,
    replyHi: `**कस्टम Android ऐप डेवलपमेंट:**\n\n• स्पेशल ऑफर: मात्र **₹29,999** में सम्पूर्ण ऐप।\n• इसमें आधुनिक UI/UX, ऑफ़लाइन डेटाबेस, पुश नोटिफिकेशन्स, ऑनलाइन पेमेंट और प्ले स्टोर पब्लिशिंग शामिल है।`,
    followUpChips: ['Start My App Project', '3-Week Timeline', 'Connect on WhatsApp', 'Show Pricing']
  },
  {
    id: 'custom_web_erp',
    category: 'custom_software',
    topic: 'custom_software',
    keywords: ['custom web erp', 'business dashboard', 'admin panel', 'inventory erp', 'custom web software'],
    hinglishKeywords: ['erp banwana hai', 'web dashboard banwana hai', 'admin panel software'],
    replyEn: `**Custom Web ERP & Admin Portals:**\n\n• Starting from **₹24,999**.\n• Tailored roles (Admin, Manager, Staff), real-time revenue analytics, automated invoice generation, and custom workflows.`,
    replyHi: `**कस्टम वेब ERP और एडमिन पोर्टल:**\n\n• मात्र **₹24,999** से शुरू।\n• यूज़र रोल्स (एडमिन, मैनेजर, स्टाफ), रियल-टाइम बिक्री ग्राफ, ऑटोमैटिक बिलिंग और आपके बिज़नेस के अनुसार डैशबोर्ड।`,
    followUpChips: ['Start Project Now', 'Tech Stack Used', 'Source Code Handover', 'Talk to Deep Mehta']
  },

  // =========================================================================
  // 7. DIGITAL GROWTH & MARKETING SERVICES
  // =========================================================================
  {
    id: 'digital_growth_overview',
    category: 'digital_growth',
    topic: 'digital_growth',
    keywords: [
      'digital growth', 'marketing services', 'social media marketing', 'smm',
      'email marketing', 'seo services', 'grow business'
    ],
    hinglishKeywords: [
      'digital marketing karte ho', 'social media management', 'marketing ke plans',
      'business grow kaise kare', 'instagram marketing'
    ],
    replyEn: `**Digital Growth & Authority Engineering Services:**\n\nWe provide ROI-focused marketing solutions designed to drive real qualified leads:\n\n1. **Social Media Management (SMM):** From ₹12,000/month (content calendar, reels, carousels, hashtags).\n2. **Email Marketing & Drip Automation:** From ₹8,000/month (lifecycle drips, newsletters, deliverability).\n3. **Search Engine Optimization (SEO):** Rank locally on Google Maps & Google Search.\n4. **Performance Ads:** Targeted Meta (Instagram/Facebook) and Google Ads.`,
    replyHi: `**डिजिटल ग्रोथ और मार्केटिंग सेवाएँ:**\n\nहम सिर्फ़ लाइक्स नहीं, बल्कि वास्तविक बिक्री और लीड्स बढ़ाने वाली सेवाएँ देते हैं:\n\n1. **सोशल मीडिया मैनेजमेंट (SMM):** ₹12,000/माह से शुरू (कंटेंट कैलेंडर, रील्स, पोस्ट डिज़ाइन व शेड्यूलिंग)।\n2. **ईमेल मार्केटिंग व ऑटोमेशन:** ₹8,000/माह से शुरू (न्यूज़लेटर, वेलकम ड्रिप और लीड नर्चरिंग)।\n3. **लोकल SEO व Google Maps:** Google Search पर अपनी दुकान/बिज़नेस को टॉप पर लाएँ।\n4. **परफ़ॉर्मेंस ऐड्स:** Instagram और Google Ads से सीधी लीड्स प्राप्त करें।`,
    followUpChips: ['Social Media Plans', 'Email Marketing Plans', 'Custom App Services', 'Talk on WhatsApp']
  },
  {
    id: 'social_media_plans',
    category: 'digital_growth',
    topic: 'digital_growth',
    keywords: [
      'social media plans', 'smm price', 'instagram management cost', 'social media pricing',
      'smm packages'
    ],
    hinglishKeywords: [
      'social media ke rate', 'instagram manage karne ka kitna lagega', 'smm plans kya hai'
    ],
    replyEn: `**Social Media Management (SMM) Plans:**\n\n• **Starter — ₹12,000/month:** 1 platform (Instagram), 8 custom branded posts/reels, content calendar, captions & hashtag strategy.\n• **Growth — ₹22,000/month:** Up to 3 platforms, 12 custom posts/reels, automated scheduling, monthly ROI report.\n• **Premium — ₹35,000/month:** Up to 4 platforms, 16 high-impact creative assets, community triage, and monthly strategy calls.`,
    replyHi: `**सोशल मीडिया मैनेजमेंट प्लान्स:**\n\n• **स्टार्टर — ₹12,000/माह:** 1 प्लेटफ़ॉर्म (Instagram), 8 ब्रांडेड पोस्ट्स/रील्स, कंटेंट कैलेंडर, कैप्शन्स व हैशटैग्स।\n• **ग्रोथ — ₹22,000/माह:** 3 प्लेटफ़ॉर्म, 12 हाई-क्वालिटी पोस्ट्स/रील्स, शेड्यूलिंग व मासिक परफ़ॉर्मेंस रिपोर्ट।\n• **प्रीमियम — ₹35,000/माह:** 4 प्लेटफ़ॉर्म, 16 प्रीमियम एसेट्स, कम्युनिटी कमेंट रिप्लाई और स्ट्रैटेजी कॉल।`,
    followUpChips: ['Email Marketing Plans', 'Start Marketing Campaign', 'Custom App Price', 'Connect on WhatsApp']
  },
  {
    id: 'email_marketing_plans',
    category: 'digital_growth',
    topic: 'digital_growth',
    keywords: [
      'email marketing plans', 'email campaign cost', 'newsletter service', 'email pricing'
    ],
    hinglishKeywords: [
      'email marketing ka rate', 'email campaign kitne me hoga', 'email marketing plans'
    ],
    replyEn: `**Email Marketing Plans:**\n\n• **Starter — ₹8,000/month:** 2 targeted campaigns, custom HTML template design, conversion copywriting.\n• **Growth — ₹15,000/month:** 4 campaigns, audience segmentation, 1 automated onboarding welcome sequence.\n• **Premium — ₹25,000/month:** 8 campaigns, advanced lifecycle drips, re-engagement workflows, and inbox deliverability tuning.`,
    replyHi: `**ईमेल मार्केटिंग प्लान्स:**\n\n• **स्टार्टर — ₹8,000/माह:** 2 टारगेटेड कैंपेन, कस्टम टेम्पलेट डिज़ाइन और कन्वर्ज़न कॉपीराइटिंग।\n• **ग्रोथ — ₹15,000/माह:** 4 कैंपेन, ऑडियंस सेग्मेंटेशन और 1 ऑटोमैटिक वेलकम सीक्वेंस।\n• **प्रीमियम — ₹25,000/माह:** 8 कैंपेन, एडवांस्ड ड्रिप ऑटोमेशन और इनबॉक्स डिलीवरी ऑप्टिमाइज़ेशन।`,
    followUpChips: ['Social Media Plans', 'Show All Pricing', 'Start Project', 'Talk to Deep Mehta']
  },
  {
    id: 'seo_services',
    category: 'digital_growth',
    topic: 'digital_growth',
    keywords: ['seo', 'google search ranking', 'google my business', 'local seo', 'rank higher'],
    hinglishKeywords: ['google par pehle number par aana hai', 'seo kaise kare', 'local seo service'],
    replyEn: `**Search Engine Optimization (SEO) & Google My Business:**\n\nWe optimize your website code structure, speed, meta tags, and local Google Map citations so nearby buyers find your restaurant or business first.`,
    replyHi: `**लोकल SEO और Google सर्च रैंकिंग:**\n\nहम आपकी वेबसाइट की स्पीड, कोड स्ट्रक्चर और Google Maps लिस्टिंग को ऑप्टिमाइज़ करते हैं ताकि आपके शहर के ग्राहक सबसे पहले आपकी दुकान पर पहुँचें।`,
    followUpChips: ['Social Media Plans', 'Custom Website Dev', 'Start Project', 'Talk on WhatsApp']
  },

  // =========================================================================
  // 8. PRICING & COMMERCIALS
  // =========================================================================
  {
    id: 'all_pricing_overview',
    category: 'pricing',
    topic: 'pricing',
    keywords: [
      'pricing', 'all prices', 'price list', 'rate card', 'how much does it cost',
      'cost breakdown', 'all product prices', 'package prices'
    ],
    hinglishKeywords: [
      'sabki price batao', 'rate list do', 'kitna kharcha aayega', 'saare plans batao',
      'paisa kitna lagega sabka', 'rate card'
    ],
    replyEn: `**Complete MyBooks Transparent Rate Card:**\n\n| Product / Service | License / Tier | Price |\n|---|---|---|\n| **Resto-X Restaurant Suite** | Yearly License | ₹4,999/yr |\n| **Resto-X Restaurant Suite** | Permanent Lifetime + Code + Waiter App | **₹24,999** (One-time) |\n| **Event-X Royal Wedding** | Permanent Lifetime | **₹2,999** (One-time) |\n| **Fitness-X Gym Manager** | Yearly / Permanent | ₹999/yr or **₹2,999** Lifetime |\n| **Custom Mobile App** | 3-Week Delivery Offer | **₹29,999** (Launch Special) |\n| **Custom Web ERP / System** | Full Stack Tailored | **₹24,999** |\n| **Ojas AI Assistant Add-on** | Standalone Lifetime | ₹1,999 Lifetime |\n| **Social Media Management** | Starter / Growth / Premium | ₹12k / ₹22k / ₹35k per mo |\n| **Email Marketing** | Starter / Growth / Premium | ₹8k / ₹15k / ₹25k per mo |`,
    replyHi: `**MyBooks की सम्पूर्ण आधिकारिक रेट लिस्ट:**\n\n• **Resto-X रेस्टोरेंट सुइट:** ₹4,999/साल या **₹24,999 लाइफटाइम** (फुल सोर्स कोड व वेटर ऐप सहित)\n• **Event-X वेडिंग सुइट:** **₹2,999 लाइफटाइम** (एक बार का पेमेंट)\n• **Fitness-X जिम सुइट:** ₹999/साल या **₹2,999 लाइफटाइम**\n• **कस्टम मोबाइल ऐप:** **₹29,999** स्पेशल लॉन्च ऑफर (3 हफ़्ते में डिलीवरी)\n• **कस्टम वेब ERP:** **₹24,999**\n• **Ojas AI असिस्टेंट:** ₹999/साल या ₹1,999 लाइफटाइम\n• **सोशल मीडिया मैनेजमेंट:** ₹12,000/माह से शुरू\n• **ईमेल मार्केटिंग:** ₹8,000/माह से शुरू`,
    followUpChips: ['Resto-X Lifetime Price', 'Custom App 3-Weeks', 'Why Lifetime vs Rental', 'Talk to Deep Mehta']
  },
  {
    id: 'lifetime_license_vs_subscription',
    category: 'pricing',
    topic: 'pricing',
    keywords: [
      'lifetime license vs subscription', 'why buy lifetime', 'lifetime ownership',
      'one time payment vs monthly', 'subscription trap'
    ],
    hinglishKeywords: [
      'lifetime kyu le', 'ek baar ka payment kyu achha hai', 'monthly vs lifetime',
      'lifetime lene ka fayda'
    ],
    replyEn: `**Why Business Owners Choose Permanent Lifetime Ownership:**\n\n1. **Zero Recurring Rent:** Stop paying ₹1,500–₹5,000 month after month forever.\n2. **Inflation Proof:** When SaaS providers raise prices by 30%, your costs remain zero.\n3. **Real Business Asset:** Having owned software with clean source code increases your business valuation.\n4. **No Sudden Shut-offs:** You will never be locked out of your operations due to a failed recurring credit card payment.`,
    replyHi: `**बिज़नेस ओनर्स लाइफटाइम परमानेंट ओनरशिप क्यों चुनते हैं:**\n\n1. **किराये से हमेशा के लिए आज़ादी:** हर महीने ₹1,500 से ₹5,000 का रेंटल भरना हमेशा के लिए बंद।\n2. **महंगाई का कोई असर नहीं:** बाहर की कंपनियाँ दाम बढ़ाती रहें, आपका खर्च ₹0 रहेगा।\n3. **बिज़नेस का पक्का एसेट:** सोर्स कोड और डेटा का मालिक होना आपके बिज़नेस की मार्केट वैल्यू बढ़ाता है।\n4. **बिज़नेस बंद होने का डर नहीं:** कार्ड पेमेंट फेल होने पर कोई आपका सॉफ़्टवेयर बंद नहीं कर सकता।`,
    followUpChips: ['Resto-X Lifetime Price', 'Custom App Offer', 'Connect on WhatsApp', 'Show All Pricing']
  },
  {
    id: 'payment_methods',
    category: 'pricing',
    topic: 'pricing',
    keywords: [
      'payment methods', 'how to pay', 'payment options', 'upi', 'credit card',
      'bank transfer', 'neft', 'gpay'
    ],
    hinglishKeywords: [
      'payment kaise kare', 'upi chalega kya', 'gpay se payment', 'bank transfer option',
      'payment ke tarike'
    ],
    replyEn: `**Supported Payment Methods:**\n\n• **UPI:** Google Pay, PhonePe, Paytm, BHIM.\n• **Direct Bank Transfer:** NEFT, RTGS, IMPS with official GST invoice.\n• **Cards:** Credit Card & Debit Card processing via secure payment gateway.\n• **Milestone Schedule:** 50% upon project kickoff, 50% upon final acceptance & sign-off.`,
    replyHi: `**भुगतान के स्वीकृत माध्यम:**\n\n• **UPI:** Google Pay, PhonePe, Paytm, BHIM।\n• **बैंक ट्रांसफर:** आधिकारिक GST इनवॉइस के साथ NEFT, RTGS, IMPS।\n• **कार्ड्स:** सुरक्षित पेमेंट गेटवे द्वारा क्रेडिट व डेबिट कार्ड्स।\n• **माइलस्टोन सुविधा:** 50% प्रोजेक्ट शुरू होने पर और 50% काम पूरा होने और आपकी मंज़ूरी पर।`,
    followUpChips: ['Milestone Terms', 'All Pricing Plans', 'Start Project', 'Talk to Deep Mehta']
  },
  {
    id: 'ojas_ai_pricing',
    category: 'pricing',
    topic: 'ojas_ai',
    keywords: ['ojas ai price', 'bot price', 'ai assistant cost', 'how much for ojas'],
    hinglishKeywords: ['ojas ai kitne ka hai', 'ai bot ka price', 'ojas chatbot rate'],
    replyEn: `**Ojas AI Copilot Pricing:**\n\n• **Yearly License:** ₹999/year\n• **Permanent Lifetime License:** ₹1,999 (one-time fee)\n• Provides 24/7 bilingual customer lead capture, WhatsApp dispatch, and invoice OCR extraction.`,
    replyHi: `**Ojas AI कोपायलट की क़ीमत:**\n\n• **इयरली प्लान:** ₹999/साल\n• **परमानेंट लाइफटाइम:** ₹1,999 (एक बार का पेमेंट)\n• 24/7 हिंदी व इंग्लिश में कस्टमर रिप्लाई, WhatsApp लीड ट्रांसफर और इनवॉइस OCR स्कैनिंग शामिल।`,
    followUpChips: ['All Pricing Plans', 'Resto-X with Ojas', 'Start Project', 'Talk to Founder']
  },

  // =========================================================================
  // 9. TIMELINES & 5-STAGE PROCESS
  // =========================================================================
  {
    id: 'process_5_stages',
    category: 'process',
    topic: 'process',
    keywords: ['development process', 'how you work', 'steps of development', 'methodology', 'workflow'],
    hinglishKeywords: ['kaise kaam karte ho', 'kaise banate ho software', 'steps kya hai'],
    replyEn: `**Our 5-Stage Agile Engineering Framework:**\n\n1. **Stage 1 — Architecture Blueprint (Day 1–3):** Technical requirements, schema design, and milestone schedule.\n2. **Stage 2 — Interactive Prototype (Day 4–7):** Figma clickable UX prototype shared for your feedback.\n3. **Stage 3 — Development Sprints (Day 8–16):** Full-stack coding with live demo links every 3 days.\n4. **Stage 4 — Rigorous QA & Load Testing (Day 17–19):** Bug fixing, security scan, and offline testing.\n5. **Stage 5 — Production Launch (Day 20–21):** Play Store upload and cloud/local deployment.`,
    replyHi: `**हमारा 5-चरणीय पारदर्शी इंजीनियरिंग प्रोसेस:**\n\n1. **स्टेज 1 — आर्किटेक्चर ब्लूप्रिंट (दिन 1–3):** तकनीकी खाका और डेटाबेस डिज़ाइन।\n2. **स्टेज 2 — इंटरैक्टिव प्रोटोटाइप (दिन 4–7):** Figma पर क्लिक होने वाला डिज़ाइन आपकी समीक्षा के लिए।\n3. **स्टेज 3 — डेवलपमेंट स्प्रिंट्स (दिन 8–16):** हर 3 दिन में लाइव प्रोग्रेस लिंक के साथ कोडिंग।\n4. **स्टेज 4 — टेस्टिंग व QA (दिन 17–19):** सुरक्षा जांच और ऑफ़लाइन टेस्ट।\n5. **स्टेज 5 — लाइव डिप्लॉयमेंट (दिन 20–21):** प्ले स्टोर पर लाइव और सर्वर सेटअप।`,
    followUpChips: ['Start Project Now', 'Milestone Payments', 'Custom App Offer', 'Connect on WhatsApp']
  },

  // =========================================================================
  // 10. SUPPORT, TRAINING & FAQS
  // =========================================================================
  {
    id: 'support_24_7',
    category: 'support',
    topic: 'support',
    keywords: [
      'support', 'customer support', 'technical support', '24/7 support', 'help desk',
      'what if system breaks', 'maintenance'
    ],
    hinglishKeywords: [
      'support kaisa hai', 'dikkat aayi toh kya kare', 'customer care number',
      'help kaise milegi', 'problem aane par support'
    ],
    replyEn: `**24/7 Dedicated Engineering Support:**\n\n• **Direct WhatsApp Support:** Reach our engineering team directly—no automated ticketing walls or endless IVR call menus.\n• **Screen Share Assistance:** Immediate remote troubleshooting via Google Meet or AnyDesk if required.\n• **Bug Fix SLA:** Critical issues resolved within 2–4 hours; non-critical within 24 hours.\n• **Helpline & WhatsApp:** +91 9644570828.`,
    replyHi: `**24/7 समर्पित तकनीकी सहायता:**\n\n• **सीधा WhatsApp सपोर्ट:** बिना किसी बॉट या टिकट के इंतज़ार के सीधे इंजीनियर्स से बात।\n• **स्क्रीन शेयर सहायता:** ज़रूरत पड़ने पर Google Meet या AnyDesk से तुरंत स्क्रीन पर समाधान।\n• **त्वरित समस्या निवारण:** मुख्य समस्याएं 2-4 घंटे में हल।\n• **सीधी हेल्पलाइन:** +91 9644570828।`,
    followUpChips: ['WhatsApp Support Now', 'Staff Training Help', 'Why Choose MyBooks', 'Show Pricing']
  },
  {
    id: 'training_onboarding',
    category: 'support',
    topic: 'support',
    keywords: [
      'training', 'staff training', 'how to use', 'onboarding', 'tutorials', 'learning'
    ],
    hinglishKeywords: [
      'staff ko sikhana padega', 'training doge kya', 'chalana kaise sikhe',
      'demo video milega'
    ],
    replyEn: `**Full Staff Training & Onboarding Included:**\n\n• We provide a live 1-on-1 video onboarding session for your cashiers, managers, and waiters.\n• Step-by-step video tutorials and quick-reference cheat sheets are provided.\n• Our interface is so intuitive that non-technical staff master billing within 15 minutes.`,
    replyHi: `**स्टाफ ट्रेनिंग और ऑनबोर्डिंग शामिल है:**\n\n• आपके कैशियर, मैनेजर और वेटर के लिए लाइव 1-ऑन-1 वीडियो ट्रेनिंग सेशन।\n• आसान वीडियो ट्यूटोरियल्स और स्टेप-बाय-स्टेप गाइड्स दिए जाते हैं।\n• सॉफ़्टवेयर इतना आसान है कि कोई भी व्यक्ति 15 मिनट में बिलिंग करना सीख जाता है।`,
    followUpChips: ['Book Free Demo', 'Resto-X Overview', 'Support Hours', 'Start Project']
  },
  {
    id: 'data_backup',
    category: 'faqs',
    topic: 'faqs',
    keywords: [
      'data backup', 'cloud backup', 'is data safe', 'security', 'data loss'
    ],
    hinglishKeywords: [
      'data safe hai kya', 'data backup kaise hoga', 'computer kharab ho gaya toh data',
      'data gayab toh nahi hoga'
    ],
    replyEn: `**Multi-Layer Automated Backup & Security:**\n\n• **Local Redundancy:** Automatic local backups saved daily on your machine.\n• **Encrypted Cloud Vault:** Nightly encrypted sync to cloud storage so a hardware failure never causes data loss.\n• **One-Click Restore:** Migrate all data to a new computer in less than 3 minutes.`,
    replyHi: `**ऑटोमैटिक मल्टी-लेयर बैकअप व सुरक्षा:**\n\n• **लोकल बैकअप:** रोज़ाना आपके कंप्यूटर पर लोकल बैकअप फ़ाइल बनती है।\n• **एन्क्रिप्टेड क्लाउड सिंक:** रोज़ रात को सुरक्षित क्लाउड पर बैकअप होता है ताकि कंप्यूटर खराब होने पर भी 1 पैसा या बिल न खोए।\n• **3 मिनट में रीस्टोर:** नए कंप्यूटर पर पूरा डेटा 3 मिनट में वापस चालू।`,
    followUpChips: ['Resto-X Offline Billing', 'Data Export to Excel', 'All Pricing', 'Talk on WhatsApp']
  },
  {
    id: 'data_export_excel',
    category: 'faqs',
    topic: 'faqs',
    keywords: [
      'export to excel', 'excel download', 'csv export', 'ca reports', 'gst reports'
    ],
    hinglishKeywords: [
      'excel me data aayega kya', 'gst report kaise niklegi', 'ca ko report kaise de',
      'excel download'
    ],
    replyEn: `**Single-Click Excel & PDF Export:**\n\n• Download daily, monthly, and yearly sales reports directly into Microsoft Excel or CSV.\n• Export GSTR-1 and GSTR-3B friendly itemized tax reports ready for your CA.\n• Customer phone numbers and order histories can be exported anytime.`,
    replyHi: `**1-क्लिक में Excel व PDF एक्सपोर्ट:**\n\n• रोज़ाना, मासिक और वार्षिक बिक्री रिपोर्ट सीधे Excel या CSV में डाउनलोड करें।\n• अपने CA के लिए GSTR-1 और GSTR-3B टैक्स रिपोर्ट्स एक क्लिक में निकालें।\n• ग्राहकों के फ़ोन नंबर और बिल हिस्ट्री कभी भी डाउनलोड कर सकते हैं।`,
    followUpChips: ['Resto-X Pricing', 'GST Billing Details', 'Book Free Demo', 'Connect on WhatsApp']
  },

  // =========================================================================
  // 11. DEMO & START PROJECT
  // =========================================================================
  {
    id: 'book_free_demo',
    category: 'demo',
    topic: 'demo',
    keywords: [
      'demo', 'free demo', 'see demo', 'test software', 'show me how it works',
      'live demo', 'trial', 'schedule demo'
    ],
    hinglishKeywords: [
      'demo dikhao', 'free demo milega kya', 'demo dekhna hai', 'trial kaise le',
      'software chala kar dekhna hai', 'demo schedule karo'
    ],
    replyEn: `**Schedule a Live 1-on-1 Interactive Demo:**\n\nWe would love to show you a live screen-share walkthrough on Google Meet or WhatsApp Video:\n\n• See real-time billing, offline order punching, KOT printing, and the Waiter App in action.\n• Ask questions specific to your restaurant, shop, or custom project.\n• **Takes only 15 minutes** and is 100% free with no sales pressure.\n\nClick below to connect with Founder Deep Mehta and book your slot today!`,
    replyHi: `**लाइव 1-ऑन-1 इंटरैक्टिव डेमो शेड्यूल करें:**\n\nहम आपको Google Meet या WhatsApp वीडियो पर लाइव स्क्रीन शेयर करके सॉफ़्टवेयर चलाकर दिखाते हैं:\n\n• लाइव बिलिंग, ऑफ़लाइन KOT प्रिंटिंग और वेटर ऐप का लाइव इस्तेमाल देखें।\n• अपने बिज़नेस की ज़रूरतों के अनुसार सवाल पूछें।\n• **सिर्फ़ 15 मिनट** का समय लगता है और यह पूरी तरह निःशुल्क है।\n\nनीचे क्लिक करके सीधे फ़ाउंडर Deep Mehta से अपना डेमो स्लॉट बुक करें!`,
    followUpChips: ['Book Demo on WhatsApp', 'Resto-X Pricing', 'Custom App Offer', 'Start Project']
  },
  {
    id: 'start_project_flow',
    category: 'process',
    topic: 'process',
    keywords: [
      'start project', 'how to start', 'next steps', 'hire you', 'get started',
      'book now', 'i want to buy', 'ready to proceed'
    ],
    hinglishKeywords: [
      'project kaise shuru kare', 'shuru karna hai', 'kaam kab start hoga',
      'kaise shuru kare', 'lena hai mujhe', 'start karo'
    ],
    replyEn: `**How to Kick Off Your Project Today in 3 Easy Steps:**\n\n1. **Quick Discovery (Day 0):** Share your business type and requirements via WhatsApp or our guided form.\n2. **Architecture Blueprint & Scope (Day 1):** We send you a defined milestone agreement and timeline.\n3. **50% Kickoff:** Sprints start immediately with updates shared every 3 days.\n\nWould you like to start our quick 4-step guided project intake right here?`,
    replyHi: `**आज ही अपना प्रोजेक्ट शुरू करने के 3 आसान कदम:**\n\n1. **ज़रूरत समझें:** WhatsApp या हमारे चैट फ़्लो में अपने बिज़नेस और सॉफ़्टवेयर की जानकारी दें।\n2. **ब्लूप्रिंट और एग्रीमेंट:** हम आपको कार्यप्रणाली, समय सीमा और पक्का कोटेशन भेजेंगे।\n3. **50% किक-ऑफ:** काम तुरंत शुरू होगा और हर 3 दिन में आपको लाइव प्रोग्रेस दिखाई जाएगी।\n\nक्या आप अभी हमारे 4-चरणीय गाइडेड फ़्लो से अपना प्रोजेक्ट शुरू करना चाहते हैं?`,
    followUpChips: ['Start Guided Project Flow', 'Connect on WhatsApp', 'Show All Pricing', 'Talk to Deep Mehta']
  },

  // =========================================================================
  // 12. CONTACT & DIRECT CHANNELS
  // =========================================================================
  {
    id: 'contact_channels',
    category: 'contact',
    topic: 'contact',
    keywords: [
      'contact', 'phone number', 'whatsapp number', 'call', 'email', 'reach out',
      'how to contact', 'helpline', 'customer care'
    ],
    hinglishKeywords: [
      'contact number do', 'phone number kya hai', 'whatsapp number', 'baat karni hai',
      'call kar sakte hai', 'email id kya hai', 'sampark kare'
    ],
    replyEn: `**Official MyBooks Contact Channels:**\n\n• **Direct WhatsApp & Calling:** +91 9644570828\n• **Founder & Principal Architect:** Deep Mehta\n• **Official Email:** mybooksxofficial@gmail.com\n• **Support Hours:** 24/7 Dedicated Assistance\n• **Website:** https://mybooksx.com\n\nFeel free to tap the WhatsApp button below for an instant conversation!`,
    replyHi: `**MyBooks आधिकारिक संपर्क विवरण:**\n\n• **सीधा WhatsApp व कॉलिंग:** +91 9644570828\n• **संस्थापक:** Deep Mehta\n• **आधिकारिक ईमेल:** mybooksxofficial@gmail.com\n• **सपोर्ट समय:** 24/7 समर्पित तकनीकी सहायता\n\nतुरंत बातचीत के लिए नीचे दिए गए WhatsApp बटन पर क्लिक करें!`,
    followUpChips: ['Open WhatsApp Now', 'Book Free Demo', 'Show All Pricing', 'Company Overview']
  },

  // =========================================================================
  // 13. SMALL TALK, GREETINGS & CASUAL DIALOG
  // =========================================================================
  {
    id: 'smalltalk_greeting',
    category: 'smalltalk',
    topic: 'smalltalk',
    keywords: ['hi', 'hello', 'hey', 'hii', 'hiii', 'heyy', 'hola', 'yo', 'greetings'],
    hinglishKeywords: ['namaste', 'kem cho', 'ram ram', 'pranam', 'sat sri akaal', 'kya haal hai'],
    replyEn: `Hello! I am **Ojas**, the official AI copilot for MyBooks. How can I help your business grow today? You can ask me about Resto-X, custom 3-week app development, pricing, or start a new project!`,
    replyHi: `नमस्ते! मैं **Ojas** हूँ, MyBooks का आधिकारिक AI कोपायलट। आज मैं आपके बिज़नेस के लिए क्या कर सकता हूँ? आप मुझसे Resto-X, कस्टम मोबाइल ऐप्स, प्राइसिंग के बारे में पूछ सकते हैं!`,
    followUpChips: ['Resto-X Demo & Price', '3-Week Custom App', 'Why Choose MyBooks?', 'Start Project / Get Quote']
  },
  {
    id: 'smalltalk_who_are_you',
    category: 'smalltalk',
    topic: 'smalltalk',
    keywords: ['who are you', 'what is your name', 'whats your name', 'tell me about yourself', 'what can you do'],
    hinglishKeywords: ['tum kaun ho', 'aapka naam kya hai', 'naam kya hai', 'kya kar sakte ho', 'ojas kya hai'],
    replyEn: `I am **Ojas**, the intelligent AI assistant developed for **MyBooks**. I can guide you through our software products (Resto-X, Event-X, Fitness-X), estimate pricing, explain our 3-week custom development process, answer technical questions, and connect you with Founder Deep Mehta.`,
    replyHi: `मेरा नाम **Ojas** है। मैं **MyBooks** का इंटेलिजेंट AI असिस्टेंट हूँ। मैं आपको हमारे सॉफ़्टवेयर (Resto-X, Event-X, Fitness-X), प्राइसिंग, 3-हफ़्ते के कस्टम डेवलपमेंट प्रोसेस के बारे में बता सकता हूँ और फ़ाउंडर Deep Mehta से जोड़ सकता हूँ।`,
    followUpChips: ['Why Choose MyBooks?', 'Show All Pricing', '3-Week Timeline', 'Start Project']
  },
  {
    id: 'smalltalk_who_made_you',
    category: 'smalltalk',
    topic: 'founder',
    keywords: ['who made you', 'who created you', 'who is your creator', 'who built ojas'],
    hinglishKeywords: ['tumhe kisne banaya', 'ojas ko kisne banaya', 'tumhara creator kaun hai'],
    replyEn: `I was created by **Deep Mehta**, the founder and principal software architect of **MyBooks**, to help clients effortlessly explore custom engineering solutions and get instant answers 24/7.`,
    replyHi: `मुझे **Deep Mehta** (संस्थापक, MyBooks) और उनकी इंजीनियरिंग टीम ने बनाया है, ताकि क्लाइंट्स को सॉफ़्टवेयर सॉल्यूशंस की पूरी जानकारी 24/7 तुरंत मिल सके।`,
    followUpChips: ['Who is Deep Mehta?', 'Why Choose MyBooks?', 'Explore Resto-X', 'Start Project']
  },
  {
    id: 'smalltalk_thank_you',
    category: 'smalltalk',
    topic: 'smalltalk',
    keywords: ['thank you', 'thanks', 'thx', 'thank u', 'appreciate it', 'many thanks'],
    hinglishKeywords: ['dhanyawad', 'dhanyavaad', 'shukriya', 'bahut shukriya'],
    replyEn: `You're very welcome! If you'd like to see a live demo or kick off your custom software project, I'm right here to assist.`,
    replyHi: `आपका बहुत-बहुत स्वागत है! यदि आप लाइव डेमो देखना चाहते हैं या अपना प्रोजेक्ट शुरू करना चाहते हैं, तो मुझे अवश्य बताएँ।`,
    followUpChips: ['Book Free Demo', 'Show All Pricing', 'Start Project', 'Chat on WhatsApp']
  },
  {
    id: 'smalltalk_how_are_you',
    category: 'smalltalk',
    topic: 'smalltalk',
    keywords: ['how are you', 'how are you doing', 'hows it going', 'whats up'],
    hinglishKeywords: ['kaise ho', 'kya haal hai', 'sab badhiya', 'kese ho'],
    replyEn: `I'm doing fantastic, thank you! Ready to help you elevate your business with great software. What project are you thinking about today?`,
    replyHi: `मैं बहुत बढ़िया हूँ, पूछने के लिए धन्यवाद! आज मैं आपके बिज़नेस को आगे बढ़ाने में कैसे मदद कर सकता हूँ? आप किस तरह का सॉफ़्टवेयर तलाश रहे हैं?`,
    followUpChips: ['Resto-X Restaurant POS', 'Custom Mobile App', 'Explore All Pricing', 'Talk on WhatsApp']
  },
  {
    id: 'smalltalk_bye',
    category: 'smalltalk',
    topic: 'smalltalk',
    keywords: ['bye', 'goodbye', 'see you', 'cya', 'good night', 'have a good day'],
    hinglishKeywords: ['alvida', 'chalta hu', 'phir milenge', 'shubh ratri'],
    replyEn: `Goodbye! Have a productive and wonderful day ahead. Whenever you are ready to scale your business technology, we're just a message away!`,
    replyHi: `अलविदा! आपका दिन शुभ और सफल रहे। जब भी आपको अपने बिज़नेस के लिए सॉफ़्टवेयर चाहिए हो, MyBooks हमेशा हाज़िर है!`,
    followUpChips: ['Connect on WhatsApp', 'Show All Pricing', 'Why Choose MyBooks?']
  },
  {
    id: 'smalltalk_joke',
    category: 'smalltalk',
    topic: 'smalltalk',
    keywords: ['tell me a joke', 'make me laugh', 'funny joke', 'tech joke'],
    hinglishKeywords: ['joke sunao', 'kuch majedar sunao', 'chutkula sunao'],
    replyEn: `Why do programmers prefer dark mode?\n\n*Because light attracts bugs!* 😄\n\nSpeaking of bugs, MyBooks builds clean, battle-tested software so your business operations run smoothly 24/7!`,
    replyHi: `प्रोग्रामर हमेशा डार्क मोड क्यों पसंद करते हैं?\n\n*क्योंकि रोशनी की तरफ कीड़े (Bugs) आकर्षित होते हैं!* 😄\n\nऔर MyBooks ऐसा क्लीन सॉफ़्टवेयर बनाता है जिसमें बग्स की कोई जगह नहीं होती!`,
    followUpChips: ['Why Choose MyBooks?', 'Explore Resto-X', 'Start Project', 'All Pricing']
  },

  // =========================================================================
  // 14. CONTEXTUAL FOLLOW-UP INTENTS (Task 3: "its price?", "timeline?")
  // =========================================================================
  {
    id: 'context_followup_price',
    category: 'pricing',
    topic: 'context_followup',
    keywords: ['its price', 'how much for it', 'what is its price', 'what does it cost', 'cost of it', 'how much'],
    hinglishKeywords: ['iska price kya hai', 'iska kitna lagega', 'kitne ka hai ye', 'iski fees kya hai', 'kitna paisa'],
    replyEn: `Here is the pricing based on the topic we were discussing:\n\n• **Resto-X Restaurant POS:** ₹4,999/yr or ₹24,999 Permanent Lifetime (with source code & waiter app)\n• **Event-X Wedding Suite:** ₹2,999 Permanent Lifetime\n• **Fitness-X Gym Manager:** ₹999/yr or ₹2,999 Lifetime\n• **Custom Mobile App:** Launch special offer from ₹29,999\n• **Custom Web ERP:** From ₹24,999\n\nWould you like an official invoice quote or demo?`,
    replyHi: `जिस विषय पर हम बात कर रहे थे, उसका मूल्य:\n\n• **Resto-X रेस्टोरेंट POS:** ₹4,999/साल या ₹24,999 लाइफटाइम (सोर्स कोड व वेटर ऐप सहित)\n• **Event-X वेडिंग सुइट:** ₹2,999 लाइफटाइम\n• **Fitness-X जिम सुइट:** ₹999/साल या ₹2,999 लाइफटाइम\n• **कस्टम मोबाइल ऐप:** मात्र ₹29,999 से शुरू\n• **कस्टम वेब ERP:** मात्र ₹24,999 से शुरू`,
    followUpChips: ['Book Free Demo', 'Why Lifetime Ownership?', 'Talk on WhatsApp', 'Start Project']
  },
  {
    id: 'context_followup_timeline',
    category: 'timeline',
    topic: 'context_followup',
    keywords: ['its timeline', 'how long will it take', 'when will it be ready', 'how many days', 'duration of it'],
    hinglishKeywords: ['kitna time lagega isme', 'kab tak ban jayega', 'kitne din lagenge', 'delivery time kya hai'],
    replyEn: `Our delivery timelines:\n\n• **Resto-X / Event-X / Fitness-X Ready Suites:** Instant setup or customized within 24–48 hours.\n• **Custom Full-Stack Mobile Apps:** 3 weeks (21 days) guaranteed.\n• **Custom Web ERP Platforms:** 3 to 4 weeks with iterative sprint demos every 3 days.`,
    replyHi: `हमारे डिलीवरी टाइमलाइन्स:\n\n• **Resto-X / Event-X / Fitness-X:** 24 से 48 घंटे में सेटअप व ट्रेनिंग रेडी।\n• **कस्टम मोबाइल ऐप्स:** सिर्फ़ 3 हफ़्ते (21 दिन) में कम्प्लीट।\n• **कस्टम वेब ERP:** 3 से 4 हफ़्ते में हर 3 दिन में लाइव प्रोग्रेस के साथ।`,
    followUpChips: ['3-Week Process Details', 'Start Project', 'Talk to Deep Mehta', 'All Pricing']
  },
  {
    id: 'context_followup_demo',
    category: 'demo',
    topic: 'context_followup',
    keywords: ['show demo of it', 'can i see its demo', 'demo for this', 'how to test it', 'trial of it'],
    hinglishKeywords: ['iska demo dikhao', 'demo kaise dekhe iska', 'test karna hai ye'],
    replyEn: `Yes, absolutely! We can set up a live 15-minute walkthrough of the system right now via Google Meet or WhatsApp Screen Share. Click the button below to schedule your live walkthrough with Founder Deep Mehta.`,
    replyHi: `बिल्कुल! हम अभी Google Meet या WhatsApp स्क्रीन शेयर पर 15 मिनट का लाइव वॉकथ्रू दिखा सकते हैं। फ़ाउंडर Deep Mehta के साथ अपना स्लॉट बुक करने के लिए नीचे क्लिक करें।`,
    followUpChips: ['Book Demo on WhatsApp', 'Resto-X Pricing', 'Custom App Offer', 'Contact Channels']
  },

  // =========================================================================
  // 15. GENERAL TECH, PROGRAMMING & CODING
  // =========================================================================
  {
    id: 'tech_python_overview',
    category: 'tech',
    topic: 'tech',
    keywords: ['what is python', 'explain python', 'python programming', 'python language'],
    hinglishKeywords: ['python kya hai', 'python language ke baare me batao', 'python programming'],
    replyEn: `**Python** is a versatile, high-level, human-readable programming language widely used for:\n\n• **Artificial Intelligence & Machine Learning:** PyTorch, TensorFlow, HuggingFace.\n• **Backend Web Development:** FastAPI, Django, Flask.\n• **Data Science & Automation:** Pandas, NumPy, automated scraping.\n\nAt MyBooks, we utilize Python for heavy algorithmic processing, data intelligence, and OCR automation.`,
    replyHi: `**Python** एक बेहद लोकप्रिय और सरल प्रोग्रामिंग भाषा है। इसका मुख्य उपयोग AI/ML, वेब बैकएंड (FastAPI/Django) और डेटा ऑटोमेशन में होता है। MyBooks में हम डेटा इंटेलिजेंस और ऑटोमेशन के लिए Python का उपयोग करते हैं।`,
    followUpChips: ['Tech Stack Used', 'Custom Software Pricing', 'Why Choose MyBooks?']
  },
  {
    id: 'tech_react_overview',
    category: 'tech',
    topic: 'tech',
    keywords: ['what is react', 'explain react', 'javascript framework', 'react 19'],
    hinglishKeywords: ['react kya hai', 'react js ke baare me batao', 'react framework'],
    replyEn: `**React** is an open-source JavaScript UI library created by Meta. It enables developers to build blazing-fast, component-driven user interfaces with declarative state management. We build our high-speed client frontends and Web ERPs using modern React and TypeScript.`,
    replyHi: `**React** एक आधुनिक जावास्क्रिप्ट लाइब्रेरी है जिसका उपयोग तेज़ और इंटरैक्टिव यूज़र इंटरफ़ेस (UI) बनाने के लिए किया जाता है। MyBooks के सभी मॉडर्न वेब सिस्टम्स React और TypeScript पर तैयार होते हैं।`,
    followUpChips: ['Tech Stack Used', 'Custom Web ERP', '3-Week Process']
  },
  {
    id: 'tech_offline_first_explanation',
    category: 'tech',
    topic: 'tech',
    keywords: ['what is offline first', 'how offline billing works', 'sqlite architecture', 'local first'],
    hinglishKeywords: ['offline first kya hota hai', 'bina internet software kaise chalta hai', 'offline sync kaise hota hai'],
    replyEn: `**How Offline-First Architecture Works:**\n\nTraditional cloud apps fail when your internet drops because every action requires a remote server round-trip. \n\n**In MyBooks' Offline-First Architecture:**\n1. Reads and writes execute instantly against a local, embedded database (SQLite) in zero milliseconds.\n2. Receipts and KOTs print immediately without network lag.\n3. A resilient background sync queue monitors network connectivity and automatically pushes records to your cloud database whenever an internet connection is detected.`,
    replyHi: `**ऑफ़लाइन-फ़र्स्ट आर्किटेक्चर कैसे काम करता है:**\n\nपारंपरिक क्लाउड ऐप्स इंटरनेट जाते ही बंद हो जाते हैं क्योंकि वे हर क्लिक पर दूर स्थित सर्वर पर निर्भर होते हैं।\n\n**MyBooks के ऑफ़लाइन-फ़र्स्ट सिस्टम में:**\n1. सारा डेटा पहले आपके कंप्यूटर के लोकल डेटाबेस (SQLite) में 0 मिलीसेकंड में सेव होता है।\n2. बिना किसी नेटवर्क देरी के KOT और बिल तुरंत प्रिंट होते हैं।\n3. जैसे ही इंटरनेट आता है, बैकग्राउंड में सारा डेटा सुरक्षित क्लाउड सर्वर पर सिंक हो जाता है।`,
    followUpChips: ['Resto-X Offline Billing', 'Resto-X Pricing', 'Why Choose MyBooks?']
  },
  {
    id: 'resto_x_split_bills',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: ['split bill', 'split payment', 'multiple payment modes', 'cash and card split'],
    hinglishKeywords: ['bill divide kaise kare', 'adha cash adha online', 'split billing option'],
    replyEn: `**Split Bill & Multi-Payment Support:**\n\nResto-X allows cashiers to split table bills equally among guests or split payments between Cash, UPI, and Card on a single transaction with separate payment receipts.`,
    replyHi: `**स्प्लिट बिल और मल्टी-पेमेंट सपोर्ट:**\n\nResto-X में एक ही बिल को मेहमानों के बीच बराबर बांटने या आधा कैश और आधा ऑनलाइन (UPI/Card) पेमेंट स्वीकार करने की पूरी सुविधा है।`,
    followUpChips: ['Resto-X Features', 'Resto-X Pricing', 'Book Demo']
  },
  {
    id: 'resto_x_loyalty_points',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: ['loyalty points', 'customer rewards', 'membership points', 'cashback resto'],
    hinglishKeywords: ['loyalty point kaise de', 'customer reward system', 'points redeem'],
    replyEn: `**Customer Loyalty & Rewards Engine:**\n\nAutomatically rewards repeat diners with points based on bill amount. Customers receive WhatsApp balance notifications and can redeem points on subsequent visits.`,
    replyHi: `**कस्टमर लॉयल्टी व रिवॉर्ड सिस्टम:**\n\nबिल अमाउंट के आधार पर ग्राहकों को लॉयल्टी पॉइंट्स मिलते हैं, जिनकी सूचना उन्हें WhatsApp पर जाती है और वे अगली बार बिल में डिस्काउंट पा सकते हैं।`,
    followUpChips: ['Resto-X Pricing', 'WhatsApp Integration', 'Book Free Demo']
  },
  {
    id: 'resto_x_parcel_delivery',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: ['takeaway billing', 'parcel billing', 'home delivery management', 'delivery boy tracking'],
    hinglishKeywords: ['takeaway ka bill', 'parcel packing bill', 'home delivery bill kaise banaye'],
    replyEn: `**Takeaway & Home Delivery Module:**\n\nResto-X features a dedicated Takeaway interface: quick phone number search, saved customer addresses, delivery executive assignment, and packaging charge automation.`,
    replyHi: `**टेकअवे और होम डिलीवरी बिलिंग:**\n\nResto-X में सिर्फ़ फ़ोन नंबर डालते ही ग्राहक का पुराना पता आ जाता है, डिलीवरी बॉय असाइन होता है और पैकेजिंग चार्ज अपने आप जुड़ जाता है।`,
    followUpChips: ['Resto-X Pricing', 'Swiggy Zomato Integration', 'Book Free Demo']
  },
  {
    id: 'resto_x_table_reservation',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: ['table reservation', 'advance table booking', 'reserve table', 'dining slots'],
    hinglishKeywords: ['table book kaise kare', 'table reservation system', 'advance booking resto'],
    replyEn: `**Table Reservation & Slot Booking:**\n\nManage future dining reservations, guest count, advance deposits, and SMS/WhatsApp booking confirmations directly on the interactive visual table floor plan.`,
    replyHi: `**टेबल रिजर्वेशन और स्लॉट बुकिंग:**\n\nआने वाले दिनों की टेबल बुकिंग, एडवांस पेमेंट और WhatsApp कन्फर्मेशन मैसेज को रेस्टोरेंट के लाइव टेबल फ्लोर मैप पर आसानी से मैनेज करें।`,
    followUpChips: ['Resto-X Overview', 'Resto-X Pricing', 'Book Demo']
  },
  {
    id: 'resto_x_bar_billing',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: ['bar billing', 'liquor pos', 'peg measurement', 'bottle inventory', 'excise reports'],
    hinglishKeywords: ['bar ka software', 'liquor stock hisab', 'peg billing resto'],
    replyEn: `**Bar & Brewery Liquor Management:**\n\nResto-X includes 30ml/60ml peg measurement deduction, bottle-to-peg inventory tracking, separate Bar KOT printer routing, and excise-compliant daily stock consumption reports.`,
    replyHi: `**बार व लिकर इन्वेंटरी मैनेजमेंट:**\n\nResto-X में 30ml/60ml पेग के हिसाब से बोतल स्टॉक की ऑटोमैटिक कटौती, बार काउंटर के लिए अलग KOT और दैनिक खपत रिपोर्ट की सुविधा है।`,
    followUpChips: ['Resto-X Pricing', 'KOT Printing', 'Talk on WhatsApp']
  },
  {
    id: 'resto_x_discount_coupons',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: ['discount coupons', 'promo codes', 'flat discount', 'percentage off', 'happy hours'],
    hinglishKeywords: ['discount kaise lagaye', 'promo code resto', 'happy hour discount'],
    replyEn: `**Discount Codes & Happy Hour Automation:**\n\nSet timed discounts (e.g. 20% off from 4 PM to 7 PM on weekdays), flat bill discounts, item-specific deals, and manager PIN protected overrides to prevent cashier fraud.`,
    replyHi: `**हैप्पी आवर्स और कूपन डिस्काउंट:**\n\nसमय आधारित डिस्काउंट (जैसे शाम 4 से 7 बजे तक 20% छूट) या कूपन कोड्स सेट करें। कैशियर द्वारा धोखाधड़ी रोकने के लिए मैनेजर पिन की सुरक्षा दी गई है।`,
    followUpChips: ['Resto-X Features', 'Resto-X Pricing', 'Book Live Demo']
  },
  {
    id: 'resto_x_daily_cash_register',
    category: 'resto_x',
    topic: 'resto_x',
    keywords: ['cash register', 'shift closing', 'opening balance', 'cash tally', 'day end report'],
    hinglishKeywords: ['galle ka hisab', 'shift close kaise kare', 'cash counter tally'],
    replyEn: `**Day-End Shift & Cash Register Closing:**\n\nOpening float balance, petty cash expenses (ice, milk, vegetables), and cash vs UPI settlements tally down to the exact rupee at the end of every cashier shift with printed closing summaries.`,
    replyHi: `**दैनिक गल्ले का हिसाब और शिफ्ट क्लोजिंग:**\n\nसुबह का शुरुआती कैश, दिन के छोटे-मोटे खर्चे (दूध, बर्फ़) और शाम का कैश व ऑनलाइन कलेक्शन 1-1 रुपये के मिलान के साथ प्रिंट होता है।`,
    followUpChips: ['Resto-X Reports', 'Resto-X Pricing', 'Connect on WhatsApp']
  },
  {
    id: 'fitness_x_locker_management',
    category: 'fitness_x',
    topic: 'fitness_x',
    keywords: ['gym lockers', 'locker management', 'locker rent', 'locker allocation'],
    hinglishKeywords: ['locker ka hisab gym', 'gym locker rent', 'locker allocation'],
    replyEn: `**Gym Locker Allocation & Fee Tracking:**\n\nFitness-X assigns numbered lockers, tracks active key deposits, and sends automatic renewal alerts for monthly locker rentals alongside gym memberships.`,
    replyHi: `**जिम लॉकर आवंटन और किराया ट्रैकिंग:**\n\nFitness-X में लॉकर नंबर अलॉट करने, चाबी डिपॉजिट रखने और मासिक लॉकर रेंट की ऑटोमैटिक रिन्यूअल अलर्ट भेजने की पूरी व्यवस्था है।`,
    followUpChips: ['Fitness-X Pricing', 'Fitness-X Overview', 'Book Demo']
  },
  {
    id: 'fitness_x_pt_packages',
    category: 'fitness_x',
    topic: 'fitness_x',
    keywords: ['personal training', 'pt sessions', 'trainer commission', 'pt package gym'],
    hinglishKeywords: ['personal training ka hisab', 'trainer commission gym', 'pt sessions tracking'],
    replyEn: `**Personal Training (PT) Session Logs:**\n\nTrack 12-session or 24-session PT packages. Whenever a member completes a workout with their trainer, 1 session is deducted and trainer commissions calculate automatically.`,
    replyHi: `**पर्सनल ट्रेनिंग (PT) सेशन ट्रैकिंग:**\n\n12 या 24 सेशन वाले PT पैकेज का हिसाब रखें। ट्रेनर के साथ वर्कआउट होते ही 1 सेशन कम होता है और ट्रेनर का कमीशन अपने आप तैयार हो जाता है।`,
    followUpChips: ['Fitness-X Pricing', 'WhatsApp Renewal Alerts', 'Book Demo']
  },
  {
    id: 'fitness_x_diet_charts',
    category: 'fitness_x',
    topic: 'fitness_x',
    keywords: ['diet charts', 'workout routine pdf', 'nutrition plans', 'gym diet generator'],
    hinglishKeywords: ['diet chart kaise de', 'workout chart member', 'gym nutrition plan'],
    replyEn: `**Digital Workout & Diet Chart Dispatch:**\n\nCreate customized macro nutrition plans (Bulking, Cutting, Keto, Vegetarian) and dispatch beautifully formatted PDF workout cards straight to members on WhatsApp.`,
    replyHi: `**डिजिटल डाइट व वर्कआउट चार्ट:**\n\nमेंबर्स के लिए कस्टमाइज़्ड डाइट चार्ट और वर्कआउट रूटीन बनाकर सीधे उनके WhatsApp पर PDF के रूप में 1-क्लिक में भेजें।`,
    followUpChips: ['Fitness-X Pricing', 'QR Attendance', 'Talk on WhatsApp']
  },
  {
    id: 'event_x_room_allotment',
    category: 'event_x',
    topic: 'event_x',
    keywords: ['room allotment wedding', 'hotel room management', 'guest room booking', 'wedding stay'],
    hinglishKeywords: ['hotel room ka hisab shaadi', 'mehmano ke room allotment', 'stay management'],
    replyEn: `**Wedding Hotel Room & Stay Allocation:**\n\nAssign arriving out-of-town guests to specific hotel rooms, track check-in/check-out dates, and share room numbers privately with guests via WhatsApp upon arrival.`,
    replyHi: `**होटल रूम आवंटन व अतिथि आवास:**\n\nबाहर से आने वाले मेहमानों को होटल रूम नंबर अलॉट करें और उनके पहुँचते ही WhatsApp पर उनका रूम नंबर और होटल की लोकेशन सीधे भेजें।`,
    followUpChips: ['Event-X Pricing', 'RSVP Portal', 'Photo Vault', 'Book Event-X']
  },
  {
    id: 'event_x_invitation_cards',
    category: 'event_x',
    topic: 'event_x',
    keywords: ['digital wedding card', 'animated wedding invitation', 'save the date', 'qr invite'],
    hinglishKeywords: ['digital shaadi card', 'online wedding card', 'video wedding invite'],
    replyEn: `**Digital Royal Wedding Cards & Invitations:**\n\nPersonalized digital invitations with royal typography, couple photos, RSVP buttons, Google Map venue directions, and countdown timers for WhatsApp sharing.`,
    replyHi: `**डिजिटल रॉयल वेडिंग इनविटेशन:**\n\nरॉयल डिज़ाइन, दूल्हा-दुल्हन की फ़ोटो, वेन्यू के Google Map और शादी के काउंटडाउन के साथ सुंदर डिजिटल कार्ड जिसे सीधे WhatsApp पर शेयर किया जा सकता है।`,
    followUpChips: ['Event-X Pricing', 'Photo Vault', 'Book Event-X', 'Connect on WhatsApp']
  },
  {
    id: 'event_x_gift_registry',
    category: 'event_x',
    topic: 'event_x',
    keywords: ['shagun tracker', 'wedding gift registry', 'gift management', 'shagun list'],
    hinglishKeywords: ['shagun ka hisab', 'shaadi me gift list', 'shagun diary digital'],
    replyEn: `**Digital Shagun & Gift Registry:**\n\nLog traditional shagun envelope amounts, gift items, and giver details in a private, organized digital registry with instant exports for family records.`,
    replyHi: `**डिजिटल शगुन व गिफ्ट डायरी:**\n\nशादी में आने वाले शगुन के लिफ़ाफ़ों और उपहारों का पूरा डिजिटल हिसाब रखें, जिसे कभी भी सुरक्षित डाउनलोड किया जा सकता है।`,
    followUpChips: ['Event-X Pricing', 'RSVP Portal', 'Contact Channels']
  },
  {
    id: 'custom_flutter_app',
    category: 'custom_software',
    topic: 'custom_software',
    keywords: ['flutter app development', 'cross platform app', 'flutter vs native', 'dart app'],
    hinglishKeywords: ['flutter me app banegi kya', 'flutter app development cost', 'android aur ios dono'],
    replyEn: `**Cross-Platform Flutter Development:**\n\nWe build sleek cross-platform applications using Google Flutter, delivering identical 60fps native performance on both Android and iOS from a single unified codebase.`,
    replyHi: `**Flutter क्रॉस-प्लेटफ़ॉर्म ऐप डेवलपमेंट:**\n\nहम Google Flutter से ऐसे ऐप्स बनाते हैं जो Android और iPhone (iOS) दोनों पर 60fps की सुपरफास्ट स्पीड के साथ चलते हैं।`,
    followUpChips: ['Custom App Offer', '3-Week Timeline', 'Tech Stack Used', 'Start Project']
  },
  {
    id: 'custom_ios_app',
    category: 'custom_software',
    topic: 'custom_software',
    keywords: ['ios app development', 'apple app store', 'iphone app', 'publish on app store'],
    hinglishKeywords: ['iphone ke liye app banegi', 'ios app development', 'apple store par live'],
    replyEn: `**iOS & Apple App Store Publishing:**\n\nWe design according to Apple Human Interface Guidelines and handle end-to-end TestFlight beta testing and App Store review compliance.`,
    replyHi: `**iPhone (iOS) ऐप डेवलपमेंट व पब्लिशिंग:**\n\nहम Apple के दिशा-निर्देशों के अनुसार प्रीमियम iOS ऐप्स तैयार करते हैं और App Store पर लाइव कराने की पूरी प्रक्रिया में सहायता करते हैं।`,
    followUpChips: ['Custom App Offer', 'Android App Details', 'Start Project', 'Talk to Deep Mehta']
  },
  {
    id: 'custom_payment_gateways',
    category: 'custom_software',
    topic: 'custom_software',
    keywords: ['payment gateway', 'razorpay integration', 'cashfree integration', 'phonepe pg', 'stripe'],
    hinglishKeywords: ['razorpay connect hoga', 'online payment gateway app me', 'payment gateway integration'],
    replyEn: `**Seamless Payment Gateway Integration:**\n\nWe integrate Razorpay, Cashfree, PhonePe PG, Paytm, and Stripe with instant webhook payment reconciliations and automated PDF receipt generation.`,
    replyHi: `**सुरक्षित ऑनलाइन पेमेंट गेटवे इंटीग्रेशन:**\n\nहम आपके ऐप में Razorpay, Cashfree, PhonePe PG या Stripe जोड़ते हैं जिससे ग्राहक UPI, कार्ड या नेटबैंकिंग से तुरंत भुगतान कर सकें।`,
    followUpChips: ['Custom Software Price', '3-Week Timeline', 'Connect on WhatsApp']
  },
  {
    id: 'custom_whatsapp_api',
    category: 'custom_software',
    topic: 'custom_software',
    keywords: ['whatsapp cloud api', 'whatsapp automation', 'meta whatsapp api', 'automated whatsapp messages'],
    hinglishKeywords: ['whatsapp api connect hoga', 'whatsapp par message kaise jayega', 'whatsapp automation'],
    replyEn: `**Official Meta WhatsApp Cloud API Integration:**\n\nSend automated order confirmations, delivery tracking links, and billing PDFs directly to your customers' WhatsApp with high deliverability.`,
    replyHi: `**आधिकारिक WhatsApp Cloud API इंटीग्रेशन:**\n\nग्राहकों के WhatsApp पर ऑटोमैटिक बिल, KOT अपडेट्स और पेमेंट लिंक्स भेजने के लिए हम आधिकारिक WhatsApp API इंटीग्रेट करते हैं।`,
    followUpChips: ['Resto-X WhatsApp Alerts', 'Custom Software Price', 'Talk to Founder']
  },
  {
    id: 'custom_sms_gateway',
    category: 'custom_software',
    topic: 'custom_software',
    keywords: ['sms otp gateway', 'dlt registration', 'fast2sms', 'msg91 integration'],
    hinglishKeywords: ['otp kaise aayega app me', 'sms gateway integration', 'dlt approved sms'],
    replyEn: `**DLT-Compliant SMS & OTP Gateways:**\n\nWe integrate certified SMS gateways (MSG91, Fast2SMS) for instant 3-second OTP verification during customer mobile login and transactional alerts.`,
    replyHi: `**सुपरफास्ट SMS व OTP गेटवे इंटीग्रेशन:**\n\nग्राहक लॉगिन और सुरक्षा के लिए हम MSG91 या Fast2SMS इंटीग्रेट करते हैं जिससे 3 सेकंड में OTP पहुँचता है।`,
    followUpChips: ['Custom App Offer', 'Tech Stack Used', 'Start Project']
  },
  {
    id: 'digital_reels_production',
    category: 'digital_growth',
    topic: 'digital_growth',
    keywords: ['reels production', 'short video marketing', 'instagram reels creation', 'video editing'],
    hinglishKeywords: ['reels banate ho kya', 'instagram reel editing', 'video marketing business'],
    replyEn: `**High-Engagement Viral Reels Creation:**\n\nWe write hooks, storyboard scripts, and edit trending Instagram Reels highlighting your signature dishes, store tours, or product benefits to drive local footfall.`,
    replyHi: `**हाई-एंगेजमेंट वायरल रील्स प्रोडक्शन:**\n\nहम आपके रेस्टोरेंट या प्रॉडक्ट्स के लिए आकर्षक रील्स की स्क्रिप्टिंग और वीडियो एडिटिंग करते हैं जिससे स्थानीय ग्राहक आकर्षित हों।`,
    followUpChips: ['Social Media Plans', 'Digital Growth Overview', 'Connect on WhatsApp']
  },
  {
    id: 'digital_meta_ads',
    category: 'digital_growth',
    topic: 'digital_growth',
    keywords: ['meta ads', 'facebook ads', 'instagram sponsored ads', 'lead generation ads'],
    hinglishKeywords: ['facebook ad chalana hai', 'instagram ad lagwana hai', 'ads management'],
    replyEn: `**Targeted Meta (Facebook & Instagram) Ads:**\n\nLaser-targeted geographical advertising within a 5km–10km radius of your business to attract nearby diners, gym members, or shoppers at optimal Cost Per Lead (CPL).`,
    replyHi: `**टारगेटेड Facebook व Instagram ऐड्स:**\n\nआपकी दुकान या रेस्टोरेंट के 5-10 किलोमीटर के दायरे में रहने वाले लोगों को सीधे विज्ञापन दिखाकर कम खर्च में अधिक ग्राहक लाते हैं।`,
    followUpChips: ['Social Media Plans', 'All Pricing Plans', 'Talk to Deep Mehta']
  },
  {
    id: 'digital_google_ads',
    category: 'digital_growth',
    topic: 'digital_growth',
    keywords: ['google ads', 'google ppc', 'google call ads', 'search engine ads'],
    hinglishKeywords: ['google par ad lagwana hai', 'google search ads', 'google par pehle aana hai'],
    replyEn: `**High-Intent Google Search & Call Ads:**\n\nCapture customers actively searching for "best cafe near me", "wedding planner", or "custom software company" with conversion-focused PPC campaigns.`,
    replyHi: `**Google सर्च व डायरेक्ट कॉल ऐड्स:**\n\nजब कोई व्यक्ति Google पर आपके काम से जुड़ा शब्द खोजे, तो सबसे ऊपर आपका नंबर और विज्ञापन दिखाकर सीधी कॉल्स लाते हैं।`,
    followUpChips: ['SEO Services', 'Social Media Plans', 'Start Project']
  },
  {
    id: 'digital_influencer_collab',
    category: 'digital_growth',
    topic: 'digital_growth',
    keywords: ['influencer marketing', 'food bloggers', 'influencer collaboration', 'local bloggers'],
    hinglishKeywords: ['food blogger bulana hai', 'influencer marketing kaise kare', 'blogger collab'],
    replyEn: `**Local Food Blogger & Influencer Outreach:**\n\nWe connect cafes and restaurants with genuine, verified local lifestyle and food influencers to generate authentic buzz and weekend rushes.`,
    replyHi: `**लोकल फ़ूड ब्लॉगर्स व इन्फ्लुएंसर आउटरीच:**\n\nहम आपके कैफ़े या आउटलेट के लिए असली और लोकप्रिय स्थानीय ब्लॉगर्स को आमंत्रित करके सोशल मीडिया पर वायरल चर्चा तैयार करवाते हैं।`,
    followUpChips: ['Social Media Plans', 'Resto-X Overview', 'Talk on WhatsApp']
  },
  {
    id: 'hardware_specs_recommended',
    category: 'faqs',
    topic: 'faqs',
    keywords: ['recommended hardware', 'pc requirements', 'computer specs for billing', 'ram required'],
    hinglishKeywords: ['kaisa computer chahiye', 'kitna ram hona chahiye', 'billing ke liye system requirement'],
    replyEn: `**Lightweight Hardware Requirements:**\n\n• **OS:** Windows 10/11, macOS, or Linux.\n• **Processor:** Intel Core i3 (4th Gen+) or equivalent.\n• **RAM:** Minimum 4GB (8GB recommended for ultra-speed).\n• **Storage:** Just 2GB free disk space.\n• Works smoothly even on budget laptops or touch POS terminals.`,
    replyHi: `**सॉफ़्टवेयर के लिए सामान्य कंप्यूटर आवश्यकताएं:**\n\n• **ऑपरेटिंग सिस्टम:** Windows 10/11 या Mac।\n• **प्रोसेसर:** सामान्य Intel i3 या नया।\n• **RAM:** कम से कम 4GB (8GB सबसे अच्छा)।\n• **स्टोरेज:** सिर्फ़ 2GB फ्री स्पेस।\n• यह किसी भी सस्ते लैपटॉप या टच POS टर्मिनल पर तेज़ी से चलता है।`,
    followUpChips: ['Thermal Printer Compatibility', 'Resto-X Pricing', 'Book Free Demo']
  },
  {
    id: 'hardware_barcode_scanners',
    category: 'faqs',
    topic: 'faqs',
    keywords: ['barcode scanner', '2d qr scanner', 'usb scanner pos', 'honeywell scanner'],
    hinglishKeywords: ['barcode scanner chalega', 'scanner kaise connect kare', 'qr code scanner pos'],
    replyEn: `**Plug-and-Play Barcode & QR Scanner Support:**\n\nResto-X and Fitness-X work out of the box with all standard USB and wireless 1D/2D barcode scanners (Honeywell, TVS, Zebra, generic OEM) without requiring extra drivers.`,
    replyHi: `**प्लग-एंड-प्ले बारकोड व QR स्कैनर सपोर्ट:**\n\nसभी सामान्य USB व वायरलेस स्कैनर (Honeywell, TVS, Zebra) बिना किसी ड्राइवर के सीधे कनेक्ट होते ही काम करने लगते हैं।`,
    followUpChips: ['Fitness-X QR Attendance', 'Resto-X Overview', 'Show Pricing']
  },
  {
    id: 'hardware_cash_drawers',
    category: 'faqs',
    topic: 'faqs',
    keywords: ['cash drawer', 'auto open cash box', 'rj11 cash drawer', 'electronic cash drawer'],
    hinglishKeywords: ['cash drawer auto open hoga', 'galla apne aap khulega bill par'],
    replyEn: `**Automatic Cash Drawer Kick:**\n\nConnects via standard RJ11 port to your thermal receipt printer. The cash drawer automatically pops open whenever a cash bill is completed or printed.`,
    replyHi: `**ऑटोमैटिक कैश ड्रॉर (गल्ला) ओपन:**\n\nथर्मल प्रिंटर के RJ11 पोर्ट से कनेक्ट होता है और कैश बिल प्रिंट होते ही गल्ला अपने आप खुल जाता है।`,
    followUpChips: ['Thermal Printer Compatibility', 'Resto-X Pricing', 'Connect on WhatsApp']
  },
  {
    id: 'faqs_offline_security',
    category: 'faqs',
    topic: 'faqs',
    keywords: ['can staff steal', 'prevent cashier fraud', 'anti theft pos', 'audit trail'],
    hinglishKeywords: ['staff chori toh nahi karega', 'cashier fraud kaise roke', 'bill delete toh nahi karega'],
    replyEn: `**Anti-Theft Cashier & Audit Guard:**\n\n• Staff cannot delete bills or cancel KOTs without entering the Manager Admin PIN.\n• Every cancellation, discount, or reprint is timestamped in a secret tamper-proof audit log.\n• End-of-day discrepancy report flags any manual overrides immediately.`,
    replyHi: `**चोरी रोकने और कैशियर ऑडिट की पूरी सुरक्षा:**\n\n• बिना मैनेजर के सीक्रेट पिन के कोई भी स्टाफ बिल या KOT डिलीट नहीं कर सकता।\n• हर कैंसिलेशन और डिस्काउंट का समय और कारण सीक्रेट ऑडिट लॉग में दर्ज होता है।\n• दिन के अंत में किसी भी छेड़छाड़ की जानकारी तुरंत सामने आ जाती है।`,
    followUpChips: ['Resto-X Offline Billing', 'Resto-X Pricing', 'Book Free Demo']
  },
  {
    id: 'faqs_multi_outlet_central',
    category: 'faqs',
    topic: 'faqs',
    keywords: ['multi outlet pos', 'chain restaurants', 'central dashboard', 'franchise management'],
    hinglishKeywords: ['kai branches hai meri', 'franchise software', 'sab branch ka hisab ek jagah'],
    replyEn: `**Multi-Outlet & Franchise Central Dashboard:**\n\nView live revenue, top-selling dishes, and inventory across all your branches on a single master phone or laptop screen with unified franchise billing.`,
    replyHi: `**मल्टी-आउटलेट और फ्रेंचाइज़ सेंट्रल डैशबोर्ड:**\n\nअपने सभी आउटलेट्स और ब्रांचों की लाइव बिक्री, सबसे ज़्यादा बिकने वाले आइटम और स्टॉक का हिसाब अपने मोबाइल पर एक ही स्क्रीन पर देखें।`,
    followUpChips: ['Resto-X Pricing', 'Custom Web ERP', 'Talk to Deep Mehta']
  },
  {
    id: 'faqs_laptop_vs_desktop',
    category: 'faqs',
    topic: 'faqs',
    keywords: ['laptop for billing', 'desktop vs laptop pos', 'can i use old laptop'],
    hinglishKeywords: ['purana laptop chalega kya', 'laptop par billing kar sakte hai', 'computer lena jaruri hai'],
    replyEn: `**Yes, Any Standard or Existing Laptop Works!**\n\nYou do not need to buy expensive dedicated POS terminals. Any existing Windows laptop with a USB thermal printer is 100% sufficient to run Resto-X at maximum speed.`,
    replyHi: `**हाँ, कोई भी सामान्य या पुराना लैपटॉप आसानी से चलेगा!**\n\nआपको कोई महंगा नया टच टर्मिनल खरीदने की ज़रूरत नहीं है। आपके पास मौजूद किसी भी सामान्य Windows लैपटॉप पर Resto-X फुल स्पीड में चलता है।`,
    followUpChips: ['Hardware Requirements', 'Thermal Printer Compatibility', 'Resto-X Pricing']
  },
  {
    id: 'company_name_meaning',
    category: 'company',
    topic: 'company',
    keywords: ['why named mybooks', 'meaning of mybooks', 'what does x stand for', 'mybooksx brand'],
    hinglishKeywords: ['mybooks naam kyu hai', 'mybooksx ka matlab kya hai', 'naam ka arth'],
    replyEn: `**Why "MyBooks" & "MyBooksX"?**\n\n"MyBooks" represents **true ownership**—keeping your own financial books and software code in your hands. The "X" signifies our 10X engineering speed, extreme offline resilience, and next-generation AI copilot architecture.`,
    replyHi: `**"MyBooks" और "MyBooksX" नाम का अर्थ:**\n\n"MyBooks" का मतलब है **सच्ची ओनरशिप**—अपने बिज़नेस की बहीखाता और सॉफ़्टवेयर कोड पर आपका अपना अधिकार। "X" हमारी 10X डेवलपमेंट स्पीड और अगली पीढ़ी के AI कोपायलट को दर्शाता है।`,
    followUpChips: ['Who is Founder?', 'Why Choose MyBooks?', 'Show All Pricing']
  },
  {
    id: 'founder_direct_call',
    category: 'founder',
    topic: 'founder',
    keywords: ['call deep mehta', 'talk to founder directly', 'deep mehta phone call', 'founder consultation'],
    hinglishKeywords: ['deep mehta se baat karni hai', 'founder se direct baat hogi', 'call par baat kare'],
    replyEn: `**Direct Phone Consultation with Founder Deep Mehta:**\n\nYou can dial or WhatsApp Deep Mehta directly at **+91 9644570828** for direct technical evaluation, project scoping, or immediate business inquiries.`,
    replyHi: `**संस्थापक Deep Mehta से सीधी फ़ोन चर्चा:**\n\nआप किसी भी प्रोजेक्ट या तकनीकी चर्चा के लिए सीधे Deep Mehta से **+91 9644570828** पर कॉल या WhatsApp पर बात कर सकते हैं।`,
    followUpChips: ['Chat on WhatsApp Now', 'Book Live Demo', 'Show All Pricing']
  },
  {
    id: 'smalltalk_compliment_smart',
    category: 'smalltalk',
    topic: 'smalltalk',
    keywords: ['you are smart', 'good bot', 'intelligent ai', 'great answers', 'awesome assistant'],
    hinglishKeywords: ['tum bahut hoshiyar ho', 'achha answer diya', 'badhiya bot hai', 'shabash'],
    replyEn: `Thank you so much! I am trained on authoritative verified engineering data to give you fast, honest, and reliable answers. How can I help your business take the next step today?`,
    replyHi: `बहुत-बहुत धन्यवाद! मुझे MyBooks की इंजीनियरिंग टीम ने आपको सटीक और ईमानदार जानकारी देने के लिए तैयार किया है। आज आपके बिज़नेस के लिए क्या नया शुरू करें?`,
    followUpChips: ['Resto-X Demo & Price', '3-Week Custom App', 'Start Project / Get Quote']
  },
  {
    id: 'smalltalk_languages',
    category: 'smalltalk',
    topic: 'smalltalk',
    keywords: ['what languages do you speak', 'can you speak hindi', 'bilingual ai', 'hinglish support'],
    hinglishKeywords: ['hindi bol sakte ho', 'kaunsi bhasha aati hai', 'hinglish me baat karo'],
    replyEn: `I am fully bilingual! I can converse fluently in English, Hindi, and natural Hinglish. Feel free to type in whatever language you are most comfortable with!`,
    replyHi: `मैं हिंदी, इंग्लिश और हिंग्लिश तीनों में सहजता से बात कर सकता हूँ! आप जिस भाषा में चाहें, मुझसे सवाल पूछ सकते हैं।`,
    followUpChips: ['Explore Resto-X in Hindi', 'Show All Pricing', 'Start Project']
  },
  {
    id: 'tech_business_mrr_calc',
    category: 'tech',
    topic: 'tech',
    keywords: ['calculate mrr', 'mrr formula', 'churn rate formula', 'monthly recurring revenue'],
    hinglishKeywords: ['mrr kaise calculate kare', 'churn rate kya hota hai', 'saas revenue formula'],
    replyEn: `**MRR & Churn Calculation Formula:**\n\n• **MRR (Monthly Recurring Revenue):** Number of active subscribers × Average Monthly Price.\n• **Net MRR Growth:** New MRR + Expansion MRR − Churned MRR.\n• **Churn %:** (Lost customers in month ÷ Customers at start of month) × 100.`,
    replyHi: `**MRR और चर्न रेट फॉर्मूला:**\n\n• **MRR (मासिक आवर्ती राजस्व):** कुल एक्टिव ग्राहक × औसत मासिक शुल्क।\n• **नेट MRR ग्रोथ:** नए ग्राहक + अपग्रेड − कैंसिल करने वाले ग्राहक।\n• **चर्न रेट:** (महीने में छोड़कर गए ग्राहक ÷ महीने की शुरुआत के कुल ग्राहक) × 100।`,
    followUpChips: ['Why Choose MyBooks?', 'Custom Web ERP', 'Talk to Deep Mehta']
  },
  {
    id: 'tech_cac_ltv_formula',
    category: 'tech',
    topic: 'tech',
    keywords: ['cac formula', 'customer lifetime value', 'ltv cac ratio', 'unit economics'],
    hinglishKeywords: ['cac kya hota hai', 'ltv kaise nikalte hai', 'customer acquisition cost'],
    replyEn: `**CAC & LTV Unit Economics:**\n\n• **Customer Acquisition Cost (CAC):** Total sales & marketing spend ÷ Number of customers acquired.\n• **Customer Lifetime Value (LTV):** Average order value × Purchase frequency × Customer lifespan.\n• **Healthy Benchmark:** An LTV:CAC ratio of **3:1 or higher** represents a highly profitable scalable business.`,
    replyHi: `**CAC और LTV यूनिट इकोनॉमिक्स:**\n\n• **CAC (ग्राहक अधिग्रहण लागत):** कुल मार्केटिंग खर्च ÷ कुल मिले नए ग्राहक।\n• **LTV (ग्राहक लाइफटाइम वैल्यू):** ग्राहक द्वारा अपने पूरे कार्यकाल में दिया गया कुल शुद्ध लाभ।\n• **हेल्दी बिज़नेस नियम:** LTV और CAC का अनुपात **3:1 या उससे अधिक** होना चाहिए।`,
    followUpChips: ['Digital Growth Overview', 'Show All Pricing', 'Start Project']
  }
];

// Helper to look up an intent by ID
export function getIntentById(id: string): OjasIntent | undefined {
  return OJAS_INTENTS.find(intent => intent.id === id);
}

// Helper to get total count
export function getTotalIntentsCount(): number {
  return OJAS_INTENTS.length;
}
