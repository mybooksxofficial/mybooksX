/**
 * Structured 10X Knowledge Base for MyBooks & Offline General Intelligence
 * 
 * Categories:
 * 1. Company, Founder & Ownership (Deep Mehta, MyBooks, legal status, ethics)
 * 2. Products, Pricing & Workflows (Resto-X, Event-X, Fitness-X, Custom Apps, SMM, Email)
 * 3. Computer Science, Web & Software (HTML, CSS, JS, React, Python, Git, APIs, Databases, Cloud)
 * 4. Artificial Intelligence, Machine Learning & LLMs (Definitions, RAG, Ollama, Tokens, Latency)
 * 5. Business, Entrepreneurship & Financial Math (MRR, Churn, CAC, LTV, Unit Economics, Funnels)
 * 6. Indian Business & Startup Operations (GST basics, Lakhs/Crores, WhatsApp commerce, Invoicing)
 * 7. Everyday General Knowledge & Science (Physics, Geography, Nature, Astronomy, World)
 * 8. Productivity, Writing & Communication (Cold Outreach, Proposals, Email drafting, Sprints)
 */

export interface KnowledgeRecord {
  id: string;
  category: 'company' | 'founder' | 'product' | 'software' | 'ai' | 'business' | 'indian_biz' | 'general' | 'productivity';
  canonicalQuestion: string;
  aliases: string[]; // Variations, informal Hinglish, typos
  shortAnswerEn: string;
  detailedAnswerEn: string;
  shortAnswerHi: string;
  detailedAnswerHi: string;
  source: string;
  verified: boolean;
  lastUpdated: string;
  relatedIds?: string[];
}

export const STRUCTURED_KNOWLEDGE_COLLECTION: KnowledgeRecord[] = [
  // -------------------------------------------------------------
  // 1. FOUNDER & OWNERSHIP
  // -------------------------------------------------------------
  {
    id: 'kb-founder-deep',
    category: 'founder',
    canonicalQuestion: 'Who is the founder of MyBooks?',
    aliases: [
      'who is founder', 'founder name', 'who founded mybooks', 'who started mybooks',
      'deep mehta', 'who is deep', 'deep kaun hai', 'mybooks kisne banaya',
      'founder of mybooks', 'who created mybooks', 'who is deep mehta'
    ],
    shortAnswerEn: 'Deep Mehta is the founder of MyBooks.',
    detailedAnswerEn: 'Deep Mehta is the founder and lead engineering architect of MyBooks. Under his leadership, MyBooks builds high-performance custom business software, mobile applications, and automated enterprise tools with 100% full source code and database ownership for clients.',
    shortAnswerHi: 'Deep Mehta MyBooks के संस्थापक (Founder) हैं।',
    detailedAnswerHi: 'Deep Mehta MyBooks के संस्थापक और मुख्य सॉफ़्टवेयर आर्किटेक्ट हैं। उनके नेतृत्व में MyBooks बिज़नेस के लिए कस्टम मोबाइल ऐप्स, ERPs और ऑटोमेशन सिस्टम 100% सोर्स कोड ओनरशिप के साथ तैयार करता है।',
    source: 'Official Company Registration & Founder Records',
    verified: true,
    lastUpdated: '2026-10-17',
    relatedIds: ['kb-owner', 'kb-company-overview']
  },
  {
    id: 'kb-owner',
    category: 'founder',
    canonicalQuestion: 'Who is the owner of MyBooks?',
    aliases: [
      'who is owner', 'owner kon hai', 'owner of mybooks', 'malik kaun hai',
      'mybooks kis ka hai', 'mybooks ka owner kon h', 'mybooks ka owener kon h', 'owener', 'mybooks owner', 'who owns this',
      'who owns mybooks'
    ],
    shortAnswerEn: 'Deep Mehta is the verified founder of MyBooks. Official public records identify Deep Mehta as the founder, while current corporate legal ownership documentation is maintained in private studio registry.',
    detailedAnswerEn: 'Deep Mehta is the verified founder and primary engineering lead of MyBooks. In official company records, Deep Mehta is documented as the founding architect who created the platform. For formal corporate or legal inquiries, ownership is governed under the studio\'s private administrative registration.',
    shortAnswerHi: 'Deep Mehta MyBooks के आधिकारिक संस्थापक (Founder) हैं। वर्तमान कानूनी स्वामित्व रिकॉर्ड प्राइवेट स्टूडियो रजिस्ट्री में संरक्षित है।',
    detailedAnswerHi: 'Deep Mehta MyBooks के सत्यापित संस्थापक और मुख्य डेवलपर हैं। अधिकृत कंपनी डेटा के अनुसार वे संस्थापक हैं, जबकि कॉर्पोरेट कानूनी स्वामित्व निजी स्टूडियो रिकॉर्ड्स में प्रबंधित है।',
    source: 'Official Studio Documentation',
    verified: true,
    lastUpdated: '2026-10-17',
    relatedIds: ['kb-founder-deep']
  },
  {
    id: 'kb-ambiguous-deep',
    category: 'founder',
    canonicalQuestion: 'What is deep / Who is deep?',
    aliases: ['what is deep', 'who is deep', 'deep', 'deep kon hai'],
    shortAnswerEn: 'If you are asking about MyBooks, Deep Mehta is the founder of MyBooks. If you are referring to artificial intelligence, "deep" usually refers to Deep Learning (multi-layer neural networks).',
    detailedAnswerEn: 'Depending on context:\n1. **MyBooks Founder:** Deep Mehta is the founder and principal engineer behind MyBooks.\n2. **Artificial Intelligence:** "Deep Learning" is a subfield of machine learning using deep neural networks (many hidden layers) to recognize speech, images, and language.\nWhich of these would you like to know more about?',
    shortAnswerHi: 'यदि आप MyBooks के संदर्भ में पूछ रहे हैं, तो Deep Mehta MyBooks के संस्थापक हैं। यदि AI के संदर्भ में है, तो इसका अर्थ "डीप लर्निंग" (Deep Learning) होता है।',
    detailedAnswerHi: 'संदर्भ के अनुसार:\n1. **MyBooks संस्थापक:** Deep Mehta MyBooks के संस्थापक हैं।\n2. **आर्टिफिशियल इंटेलिजेंस:** "डीप लर्निंग" मशीन लर्निंग की एक शाखा है जो बहु-स्तरीय न्यूरल नेटवर्क पर काम करती है।\nआप किसके बारे में विस्तार से जानना चाहते हैं?',
    source: 'Context Disambiguation Engine',
    verified: true,
    lastUpdated: '2026-10-17',
    relatedIds: ['kb-founder-deep', 'kb-ai-deep-learning']
  },

  // -------------------------------------------------------------
  // 2. COMPANY & WEBSITE OVERVIEW
  // -------------------------------------------------------------
  {
    id: 'kb-company-overview',
    category: 'company',
    canonicalQuestion: 'What is MyBooks?',
    aliases: [
      'what is mybooks', 'mybooks kya hai', 'about mybooks', 'what does mybooks do',
      'mybooks overview', 'tell me about mybooks', 'company info'
    ],
    shortAnswerEn: 'MyBooks is a custom digital engineering studio that develops business software, web ERPs, mobile apps, and dining management systems with 100% source code ownership.',
    detailedAnswerEn: 'MyBooks is a full-stack digital product engineering studio founded by Deep Mehta. The company specializes in building customized software ecosystems where clients get 100% full source code and database ownership (no monthly vendor lock-in). Its flagship products include Resto-X (dining POS), Event-X (wedding suite), Fitness-X (gym management), and custom Android applications built in 3 weeks.',
    shortAnswerHi: 'MyBooks एक कस्टम डिजिटल इंजीनियरिंग स्टूडियो है जो बिज़नेस सॉफ़्टवेयर, वेब ERPs और मोबाइल ऐप्स 100% सोर्स कोड ओनरशिप के साथ तैयार करता है।',
    detailedAnswerHi: 'MyBooks एक संपूर्ण सॉफ़्टवेयर डेवलपमेंट स्टूडियो है जिसके संस्थापक Deep Mehta हैं। यह कंपनी बिज़नेस के लिए कस्टम सॉफ़्टवेयर बनाती है जिसमें क्लाइंट को पूरा कोड और डेटाबेस मालिकाना हक दिया जाता है।',
    source: 'MyBooks Company Specification',
    verified: true,
    lastUpdated: '2026-10-17'
  },
  {
    id: 'kb-how-to-use',
    category: 'company',
    canonicalQuestion: 'How can I use MyBooks?',
    aliases: [
      'how can i use mybooks', 'how to use mybooks', 'kaise use kare', 'start with mybooks',
      'explore mybooks', 'website guide'
    ],
    shortAnswerEn: 'You can explore MyBooks by browsing our flagship products (Resto-X, Event-X, Fitness-X), trying the Interactive Solution Calculator, taking the 2-minute solution quiz, spinning the discount wheel, or submitting a project inquiry directly.',
    detailedAnswerEn: 'To get started with MyBooks on this website:\n1. **Explore Products:** Scroll to the Products section to see Resto-X, Event-X, and Fitness-X.\n2. **Custom Solution Form:** Use the form at the bottom to configure your custom app requirements and generate an instant project quote.\n3. **Spin the Lucky Wheel:** Spin once to win up to 20% off your software setup.\n4. **Chat with Ojas:** Ask any question about pricing, tech architecture, or business growth right here!',
    shortAnswerHi: 'आप MyBooks वेबसाइट पर प्रोडक्ट्स सेक्शन देख सकते हैं, डिस्काउंट व्हील स्पिन कर सकते हैं, कस्टम सॉल्यूशन फॉर्म भर सकते हैं या Ojas AI से सीधे सहायता ले सकते हैं।',
    detailedAnswerHi: 'MyBooks का उपयोग करने के चरण:\n1. प्रोडक्ट्स सेक्शन में जाकर Resto-X या फिटनेस टूल्स देखें।\n2. डिस्काउंट व्हील से प्रोमो कोड प्राप्त करें।\n3. कस्टम सॉल्यूशन फॉर्म से अपनी आवश्यकता अनुसार इनवॉइस कोटेशन बनाएं।\n4. किसी भी प्रश्न के लिए Ojas AI से पूछें!',
    source: 'Website User Guide',
    verified: true,
    lastUpdated: '2026-10-17'
  },
  {
    id: 'kb-mybooks-features',
    category: 'company',
    canonicalQuestion: 'Explain MyBooks features.',
    aliases: [
      'explain mybooks features', 'mybooks features', 'features of mybooks', 'what are mybooks features',
      'what are the features of mybooks', 'mybooks offerings', 'mybooks services', 'mybooks capabilities',
      'what does mybooks offer', 'mybooks me kya features hai', 'mybooks ke features', 'all features of mybooks'
    ],
    shortAnswerEn: 'MyBooks features Resto-X dining POS, Event-X wedding suite, Fitness-X gym manager, Custom Apps (bespoke Android mobile apps in 3 weeks with 100% code ownership), and digital growth marketing services.',
    detailedAnswerEn: '### Key Features & Offerings of MyBooks:\n\n• **Resto-X (Dining & Restaurant POS Suite):** Features table QR digital ordering, live Kitchen Order Ticket (KOT) sync to chef screens, recipe raw material depletion tracking, and automated GST billing.\n• **Event-X (Royal Wedding & Event Suite):** Digital guest RSVP tracking, ceremony timeline, live venue GPS navigation, and private interactive photo vault.\n• **Fitness-X (Gym & Wellness Management):** Member QR attendance check-in, automated WhatsApp payment renewals, and trainer scheduling.\n• **Custom Apps (Bespoke Android Applications):** Bespoke native-grade mobile apps engineered and launched in just 3 weeks (21 days) with 100% full source code and database ownership.\n• **Digital Growth Services:** Full-service Social Media Management (content calendars, creatives) and Lifecycle Email Marketing automation.\n• **Interactive Solution Calculator:** Instant online software quote generator with itemized invoice estimation and direct WhatsApp dispatch.',
    shortAnswerHi: 'MyBooks की मुख्य विशेषताओं में Resto-X रेस्टोरेंट POS, Event-X वेडिंग सुइट, Fitness-X जिम मैनेजर, 3 हफ़्ते में 100% कोड ओनरशिप वाले कस्टम Android ऐप्स और डिजिटल ग्रोथ सर्विसेज शामिल हैं।',
    detailedAnswerHi: '### MyBooks की मुख्य सुविधाएं और उत्पाद:\n\n• **Resto-X (रेस्टोरेंट POS सुइट):** टेबल QR ऑर्डरिंग, लाइव किचन KOT, इन्वेंटरी और GST बिलिंग।\n• **Event-X (रॉयल वेडिंग सुइट):** गेस्ट RSVP, डिजिटल फोटो वॉल्ट और वेन्यू GPS मैप्स।\n• **Fitness-X (जिम मैनेजमेंट):** QR अटेंडेंस और ऑटोमेटेड WhatsApp रिन्यूअल अलर्ट्स।\n• **कस्टम मोबाइल ऐप्स:** सिर्फ़ 3 हफ़्तों में 100% सोर्स कोड ओनरशिप के साथ डिलीवरी।\n• **डिजिटल ग्रोथ सर्विसेज:** सोशल मीडिया मैनेजमेंट और ईमेल मार्केटिंग ऑटोमेशन।\n• **सॉल्यूशन कैलकुलेटर:** तत्काल कोटेशन और इनवॉइस जनरेटर।',
    source: 'MyBooks Official Product Documentation',
    verified: true,
    lastUpdated: '2026-10-17'
  },
  {
    id: 'kb-why-choose-mybooks',
    category: 'company',
    canonicalQuestion: 'Why should we choose MyBooks?',
    aliases: [
      'why should we choose mybooks', 'why choose mybooks', 'why mybooks', 'why should i choose mybooks',
      'why us', 'benefits of mybooks', 'advantages of mybooks', 'kyun chune mybooks', 'mybooks kyu chune',
      'why should we work with mybooks', 'why select mybooks'
    ],
    shortAnswerEn: 'Businesses choose MyBooks for 100% full source code & database ownership (no vendor lock-in), rapid 3-week delivery, 24/7 direct WhatsApp developer support, and tailored architecture.',
    detailedAnswerEn: '### Grounded Customer Benefits of Choosing MyBooks:\n\n• **100% Source Code & Database Ownership:** Unlike subscription traps, you receive full source code, architecture blueprints, and database control. You are never held hostage by monthly platform rental fees.\n• **Rapid 3-Week (21-Day) Production Delivery:** From architecture blueprint to Google Play Store release in 21 days with active milestone reviews every 3–4 days.\n• **24/7 Direct WhatsApp & Lead Developer Support:** Direct access to lead engineering architects (+91 9644570828), ensuring quick resolution without bureaucratic ticketing queues.\n• **Bespoke Architecture Tailored to Your Workflow:** Engineered specifically for your actual business operations rather than forcing you into rigid off-the-shelf templates.\n• **Transparent One-Time Lifetime Pricing:** High-ROI investment with permanent lifetime ownership options for flagship suites.',
    shortAnswerHi: 'MyBooks को चुनने के मुख्य लाभ: 100% फुल सोर्स कोड ओनरशिप, 3 हफ़्ते में डिलीवरी, 24/7 सीधा WhatsApp सपोर्ट और बिना किसी वेंडर रेंटल शुल्क के लाइफटाइम ओनरशिप।',
    detailedAnswerHi: '### MyBooks को चुनने के ठोस कारण:\n\n• **100% सोर्स कोड ओनरशिप:** कोई छुपा हुआ शुल्क या वेंडर लॉक-इन नहीं। संपूर्ण कोड आपका होता है।\n• **सिर्फ़ 3 हफ़्तों में डिलीवरी:** 21 दिनों में प्रोडक्शन-रेडी ऐप डिप्लॉयमेंट।\n• **24/7 सीधा WhatsApp सपोर्ट:** सीधे लीड डेवलपर्स से संपर्क (+91 9644570828)।\n• **कस्टम वर्कफ़्लो:** आपके बिज़नेस के अनुसार पूरी तरह कस्टमाइज़्ड सॉफ़्टवेयर।\n• **लाइफटाइम ओनरशिप:** कोई बार-बार का रेंटल नहीं।',
    source: 'Engineering Core Value Standards',
    verified: true,
    lastUpdated: '2026-10-17'
  },
  {
    id: 'kb-unknown-revenue',
    category: 'company',
    canonicalQuestion: 'What is MyBooks exact current revenue, customer count, and annual profit?',
    aliases: [
      'what is mybooks exact annual profit', 'mybooks exact annual profit', 'annual profit', 'exact current revenue',
      'revenue of mybooks', 'mybooks annual profit', 'how much money does mybooks make',
      'mybooks profit', 'kitna kamata hai mybooks', 'paying customers count'
    ],
    shortAnswerEn: 'MyBooks is a private engineering studio. Exact internal revenue figures, paying customer counts, and annual profit margins are not publicly disclosed in our verified records.',
    detailedAnswerEn: 'MyBooks operates as a privately held software engineering studio. Official audited monthly revenue figures, customer headcounts, and net annual profit numbers are kept strictly in private corporate accounts and are not published in public knowledge repositories. Ojas does not invent or estimate private corporate financial statistics.',
    shortAnswerHi: 'MyBooks एक निजी इंजीनियरिंग स्टूडियो है। सटीक वार्षिक लाभ, आंतरिक रेवेन्यू और ग्राहकों की कुल संख्या सार्वजनिक ज्ञानकोष में उपलब्ध नहीं है।',
    detailedAnswerHi: 'निजी कंपनी नीति के तहत MyBooks का आंतरिक वित्तीय डेटा (वार्षिक लाभ, शुद्ध आय व कुल ग्राहक संख्या) सार्वजनिक रूप से प्रकाशित नहीं है। Ojas काल्पनिक या असत्यापित वित्तीय आंकड़े नहीं बताता है।',
    source: 'MyBooks Privacy & Compliance Policy',
    verified: true,
    lastUpdated: '2026-10-17'
  },

  // -------------------------------------------------------------
  // 3. PRODUCTS & PRICING
  // -------------------------------------------------------------
  {
    id: 'kb-resto-x',
    category: 'product',
    canonicalQuestion: 'What is Resto-X and what does it cost?',
    aliases: [
      'what is resto-x', 'what is restox', 'resto-x', 'resto x', 'restaurant pos', 'resto price', 'table qr', 'kitchen order ticket',
      'kot', 'restaurant billing', 'resto-x cost', 'resto-x kya hai'
    ],
    shortAnswerEn: 'Resto-X is a restaurant POS suite with table QR ordering, live KOT kitchen sync, inventory, and GST billing. Pricing: ₹4,999/year or ₹24,999 Permanent Lifetime (with free Android waiter app).',
    detailedAnswerEn: 'Resto-X is MyBooks\' end-to-end dining management solution:\n• **Features:** Dynamic table QR digital menu, live Kitchen Order Ticket (KOT) sync to chef screens, recipe raw material depletion tracking, and automated GST billing.\n• **Pricing:** ₹4,999/year license OR ₹24,999 Permanent Lifetime ownership (100% full source code delivered with complimentary Android waiter terminal app).\n• **Optional:** Ojas AI WhatsApp bot add-on for +₹999/year or +₹2,500 lifetime.',
    shortAnswerHi: 'Resto-X एक संपूर्ण रेस्टोरेंट POS सुइट है। क़ीमत: ₹4,999/साल या ₹24,999 परमानेंट लाइफटाइम (मुफ़्त Android वेटर ऐप सहित)।',
    detailedAnswerHi: 'Resto-X रेस्टोरेंट प्रबंधन का संपूर्ण सॉफ़्टवेयर है जिसमें टेबल QR डिजिटल मेन्यू, लाइव किचन KOT, इन्वेंटरी और GST बिलिंग शामिल है।',
    source: 'Resto-X Product Master Spec',
    verified: true,
    lastUpdated: '2026-10-17'
  },
  {
    id: 'kb-event-x',
    category: 'product',
    canonicalQuestion: 'What is Event-X?',
    aliases: [
      'what is event-x', 'what is eventx', 'event-x', 'event x', 'wedding app', 'wedding suite',
      'shaadi app', 'guest rsvp', 'event-x cost', 'event-x kya hai'
    ],
    shortAnswerEn: 'Event-X is a Royal Wedding & Event Suite priced at ₹2,999 Permanent Lifetime, including couple timeline, guest RSVP, interactive photo vaults, and venue GPS maps.',
    detailedAnswerEn: 'Event-X provides an elegant digital companion for weddings and corporate gatherings:\n• **Guest Experience:** Interactive RSVP tracking, schedule of ceremonies, live GPS venue navigation, and a shared photo vault.\n• **Couple Portal:** Real-time guest headcount, dietary requirements, and digital blessings wall.\n• **Pricing:** ₹2,999 one-time payment for permanent lifetime access.',
    shortAnswerHi: 'Event-X शादी और इवेंट्स का रॉयल सुइट है। क़ीमत: ₹2,999 परमानेंट लाइफटाइम (गेस्ट RSVP, फोटो वॉल्ट और वेन्यू GPS सहित)।',
    detailedAnswerHi: 'Event-X में मेहमानों के लिए RSVP, डिजिटल फोटो वॉल्ट और वेन्यू मैप्स की सुविधा है। एकमुश्त क़ीमत मात्र ₹2,999 लाइफटाइम है।',
    source: 'Event-X Product Master Spec',
    verified: true,
    lastUpdated: '2026-10-17'
  },
  {
    id: 'kb-fitness-x',
    category: 'product',
    canonicalQuestion: 'What is Fitness-X?',
    aliases: [
      'what is fitness-x', 'what is fitnessx', 'fitness-x', 'fitness x', 'gym app', 'gym software',
      'fitness software', 'gym attendance', 'fitness-x cost', 'fitness-x kya hai'
    ],
    shortAnswerEn: 'Fitness-X is a gym and wellness management suite priced at ₹999/year or ₹2,999 Permanent Lifetime, featuring QR attendance check-in and automated WhatsApp renewal alerts.',
    detailedAnswerEn: 'Fitness-X automates gym and studio operations:\n• **Features:** Member QR check-in, automated WhatsApp payment renewal alerts, trainer scheduling, and workout/diet distribution.\n• **Pricing:** ₹999/year subscription OR ₹2,999 Permanent Lifetime ownership.',
    shortAnswerHi: 'Fitness-X जिम और वेलनेस मैनेजमेंट ऐप है। क़ीमत: ₹999/साल या ₹2,999 परमानेंट लाइफटाइम।',
    detailedAnswerHi: 'Fitness-X जिम सदस्यों के QR चेक-इन, ऑटोमेटेड WhatsApp रिन्यूअल अलर्ट्स और ट्रेनर शेड्यूलिंग का संपूर्ण समाधान है।',
    source: 'Fitness-X Product Master Spec',
    verified: true,
    lastUpdated: '2026-10-17'
  },
  {
    id: 'kb-custom-apps',
    category: 'product',
    canonicalQuestion: 'What are Custom Apps?',
    aliases: [
      'what are custom apps', 'what is custom app', 'custom apps', 'custom app',
      'custom mobile apps', 'custom android apps', 'custom software', 'app cost', 'build app',
      'app development cost', 'app kitne me banegi', 'custom apps kya hai'
    ],
    shortAnswerEn: 'MyBooks builds bespoke native-grade Android applications starting at a special launch price of ₹29,999, fully delivered in 3 weeks (21 days) with 100% full source code ownership.',
    detailedAnswerEn: 'Our custom software engineering workflow:\n• **Delivery Timeline:** 21 days (3 weeks) from architectural blueprint to Google Play Store release.\n• **Ownership:** 100% full source code, backend APIs, and database ownership transferred to you.\n• **Launch Offer:** Starting at ₹29,999 for complete production build and infrastructure setup.\n• **Scope:** E-commerce, customer portals, field logistics, service booking, and business ERPs.',
    shortAnswerHi: 'कस्टम Android ऐप्लिकेशन का स्पेशल लॉन्च ऑफर ₹29,999 है, जो 100% फुल सोर्स कोड ओनरशिप के साथ सिर्फ़ 3 हफ़्तों (21 दिन) में तैयार किया जाता है।',
    detailedAnswerHi: 'MyBooks में कस्टम मोबाइल ऐप 21 दिनों में तैयार होता है। पूरा सोर्स कोड क्लाइंट को दिया जाता है और स्पेशल ऑफर क़ीमत ₹29,999 है।',
    source: 'Engineering Operations Manual',
    verified: true,
    lastUpdated: '2026-10-17'
  },

  // -------------------------------------------------------------
  // 4. ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
  // -------------------------------------------------------------
  {
    id: 'kb-ai-deep-learning',
    category: 'ai',
    canonicalQuestion: 'What is Artificial Intelligence (AI) and Deep Learning?',
    aliases: [
      'what is artificial intelligence', 'what is ai', 'ai kya hota hai', 'ai kya hai',
      'what is deep learning', 'deep learning kya hai', 'explain ai', 'what is machine learning'
    ],
    shortAnswerEn: 'Artificial Intelligence (AI) is technology enabling software to learn, reason, and perform tasks like language understanding, computer vision, and decision-making.',
    detailedAnswerEn: '### What is Artificial Intelligence (AI)?\nArtificial Intelligence is a field of computer science dedicated to building systems capable of performing tasks that ordinarily require human intelligence—such as understanding natural language, recognizing images, generating creative content, and solving complex logic.\n\n### What is Deep Learning?\nDeep Learning is a subset of Machine Learning based on artificial neural networks with multiple layers (hence "deep"). Inspired by the human brain, these deep neural networks automatically discover intricate representations in raw data, powering modern breakthroughs like large language models (LLMs), speech recognition, and autonomous driving.\n\n### 3 Small Business Examples:\n1. **24/7 Automated Customer Support:** Chatbots resolve order and pricing queries instantly.\n2. **Inventory Forecasting:** Algorithms predict stock runouts based on seasonal trends.\n3. **Smart Marketing:** AI drafts product descriptions and targeted email campaigns in seconds.',
    shortAnswerHi: 'आर्टिफिशियल इंटेलिजेंस (AI) वह तकनीक है जो कंप्यूटर को इंसानों की तरह सीखने, समझने और निर्णय लेने में सक्षम बनाती है।',
    detailedAnswerHi: '### आर्टिफिशियल इंटेलिजेंस (AI) क्या है?\nAI कंप्यूटर साइंस की वह शाखा है जो मशीनों को मानवीय बुद्धिमत्ता जैसे भाषा समझना, चित्र पहचानना और तर्क करना सिखाती है।\n\n### डीप लर्निंग क्या है?\nडीप लर्निंग मशीन लर्निंग का एक हिस्सा है जो बहु-स्तरीय न्यूरल नेटवर्क (Artificial Neural Networks) पर काम करता है। यह बड़े डेटासेट से सीखकर आधुनिक टूल्स (जैसे चैटबॉट्स व इमेज रिकॉग्निशन) को संचालित करता है।',
    source: 'Computer Science Education Reference',
    verified: true,
    lastUpdated: '2026-10-17'
  },
  {
    id: 'kb-ai-llm-rag',
    category: 'ai',
    canonicalQuestion: 'What is an LLM and what is RAG?',
    aliases: [
      'what is an llm', 'what is llm', 'what is rag', 'retrieval augmented generation',
      'tokens and context', 'how does ollama work', 'ollama kya hai'
    ],
    shortAnswerEn: 'An LLM (Large Language Model) is a neural network trained on vast text to generate human language. RAG (Retrieval-Augmented Generation) grounds an LLM by feeding it verified local documents before answering.',
    detailedAnswerEn: '• **Large Language Model (LLM):** A deep learning model with billions of parameters (e.g., Llama, Qwen, Mistral) that predicts subsequent tokens to understand and generate text.\n• **Retrieval-Augmented Generation (RAG):** Instead of relying only on the model\'s internal weights (which can hallucinate), RAG retrieves authoritative documents from a local knowledge base and injects them into the prompt, ensuring factual, grounded answers.\n• **Ollama:** An open-source tool that lets you run quantized LLMs locally on your own computer without external cloud API dependencies.',
    shortAnswerHi: 'LLM एक विशाल भाषाई AI मॉडल है। RAG (Retrieval-Augmented Generation) स्थानीय सत्यापित दस्तावेज़ों को जोड़कर AI के उत्तरों को विश्वसनीय बनाता है।',
    detailedAnswerHi: '• **LLM:** अरबों पैरामीटर्स पर प्रशिक्षित मॉडल जो भाषा को समझता और लिखता है।\n• **RAG:** यह स्थानीय डेटाबेस से सही जानकारी निकालकर LLM को देता है ताकि उत्तर में कोई झूठ या काल्पनिक बात न हो।\n• **Ollama:** आपके अपने कंप्यूटर पर बिना इंटरनेट या API शुल्क के AI मॉडल चलाने का ओपन-सोर्स टूल।',
    source: 'Applied AI Architecture Guide',
    verified: true,
    lastUpdated: '2026-10-17'
  },

  // -------------------------------------------------------------
  // 5. SOFTWARE, PROGRAMMING & CODING
  // -------------------------------------------------------------
  {
    id: 'kb-what-is-html',
    category: 'software',
    canonicalQuestion: 'What is HTML?',
    aliases: ['what is html', 'html kya hai', 'explain html', 'html meaning', 'html full form'],
    shortAnswerEn: 'HTML (HyperText Markup Language) is the standard markup language used to structure web pages and their content on the internet.',
    detailedAnswerEn: 'HTML stands for **HyperText Markup Language**. It forms the foundational skeleton of every website on the internet.\n• **How it works:** It uses semantic tags (like `<h1>`, `<p>`, `<a>`, `<div>`, `<button>`) to tell web browsers how to render text, images, links, forms, and multimedia.\n• **Role with CSS & JS:** HTML provides the structure, CSS adds the visual styling, and JavaScript adds dynamic logic and interactivity.',
    shortAnswerHi: 'HTML (HyperText Markup Language) वेब पेजों की मूल संरचना (Skeleton) बनाने वाली मानक मार्कअप भाषा है।',
    detailedAnswerHi: 'HTML का पूरा नाम HyperText Markup Language है। यह इंटरनेट पर सभी वेबसाइटों की नींव है। यह ब्राउज़र को बताती है कि शीर्षक, पैराग्राफ, बटन और छवियां कहाँ और कैसे प्रदर्शित करनी हैं।',
    source: 'Web Standards Documentation (W3C/MDN)',
    verified: true,
    lastUpdated: '2026-10-17'
  },
  {
    id: 'kb-what-is-css-js',
    category: 'software',
    canonicalQuestion: 'What are CSS and JavaScript?',
    aliases: ['what is css', 'what is javascript', 'css kya hai', 'javascript kya hai', 'js vs css'],
    shortAnswerEn: 'CSS (Cascading Style Sheets) styles the look and layout of web pages, while JavaScript adds interactivity, animations, and backend API communication.',
    detailedAnswerEn: '• **CSS (Cascading Style Sheets):** Controls the aesthetics—colors, fonts, responsive grids, Flexbox layouts, borders, and animations.\n• **JavaScript:** The programming language of the web that makes pages interactive—handling button clicks, fetching data from servers, updating page elements dynamically, and managing application state.',
    shortAnswerHi: 'CSS वेबसाइट को सुंदर और रिस्पॉन्सिव डिज़ाइन देती है, जबकि JavaScript क्लिक, डेटा लोडिंग और इंटरैक्शन को संचालित करती है।',
    detailedAnswerHi: 'CSS रंग, फ़ॉन्ट्स और लेआउट निर्धारित करती है। JavaScript वेबसाइट में जान डालती है—जैसे बटन दबाने पर डेटा मंगाना या पॉपअप खोलना।',
    source: 'MDN Web Docs',
    verified: true,
    lastUpdated: '2026-10-17'
  },
  {
    id: 'kb-what-is-python',
    category: 'software',
    canonicalQuestion: 'What is Python?',
    aliases: ['what is python', 'python kya hai', 'explain python', 'why python'],
    shortAnswerEn: 'Python is a high-level, interpreted programming language known for its clean syntax, widely used in AI, machine learning, data science, web backends, and automation.',
    detailedAnswerEn: 'Python is celebrated for its human-readable syntax and immense library ecosystem:\n• **AI & Machine Learning:** PyTorch, TensorFlow, Hugging Face, Scikit-learn.\n• **Web Backends & APIs:** FastAPI, Django, Flask.\n• **Data Analytics:** Pandas, NumPy, Matplotlib.\n• **DevOps & Automation:** Scripting, web scraping, and server administration.',
    shortAnswerHi: 'Python एक सरल और शक्तिशाली प्रोग्रामिंग भाषा है जिसका मुख्य उपयोग AI, मशीन लर्निंग, वेब बैकएंड और डेटा साइंस में होता है।',
    detailedAnswerHi: 'Python अपनी साफ़ और पढ़ने में आसान कोडिंग के लिए मशहूर है। AI रिसर्च से लेकर इंस्टाग्राम के बैकएंड तक में Python का इस्तेमाल होता है।',
    source: 'Python Software Foundation',
    verified: true,
    lastUpdated: '2026-10-17'
  },

  // -------------------------------------------------------------
  // 6. BUSINESS, GROWTH & CUSTOMER ACQUISITION
  // -------------------------------------------------------------
  {
    id: 'kb-business-100-customers',
    category: 'business',
    canonicalQuestion: 'Give me a plan to get 100 paying customers in three months.',
    aliases: [
      'how to get 100 paying customers', '100 customers plan', '100 paying customers in 3 months',
      'acquisition plan', 'grow to 100 customers', 'customer acquisition strategy'
    ],
    shortAnswerEn: 'To acquire 100 paying customers in 90 days at an 8-10% conversion rate, engage approximately 1,000 qualified prospects (~11 per day) across three focused phases.',
    detailedAnswerEn: '### Actionable 90-Day Plan: 100 Paying Customers in 3 Months\n*Conversion Funnel Math:* Assuming an 8–10% demo-to-close conversion rate, you need ~1,000 qualified touches over 90 days (~11 prospects per business day).\n\n• **Phase 1: Month 1 (Days 1–30) — Validation & First 20 Customers**\n  - Define tight Ideal Customer Profile (ICP) with an urgent, high-ROI problem.\n  - Conduct 15 daily direct outreach touches (personalized WhatsApp, LinkedIn, cold calls).\n  - Target: **20 Paying Customers**.\n\n• **Phase 2: Month 2 (Days 31–60) — Double Down on Winning Channels**\n  - Analyze which channel brought the first 20 clients; direct 80% effort there.\n  - Publish 3 case studies/testimonials.\n  - Target: **+35 New Customers** (Cumulative: 55).\n\n• **Phase 3: Month 3 (Days 61–90) — Referral Loops & Pipeline Conversion**\n  - Launch a 15–20% referral credit for existing clients.\n  - Re-engage all warm unclosed leads from Months 1 and 2.\n  - Target: **+45 New Customers** (Total: **100 Paying Customers**).',
    shortAnswerHi: '90 दिनों में 100 ग्राहक पाने के लिए 10% कन्वर्ज़न पर ~1,000 योग्य ग्राहकों तक पहुँचना होगा (लगभग 11 संपर्क प्रतिदिन)।',
    detailedAnswerHi: '### 90 दिनों में 100 भुगतान करने वाले ग्राहकों की कार्ययोजना:\n• **माह 1:** सटीक ICP चुनें और रोज़ाना 15 संभावित ग्राहकों से संपर्क करें। लक्ष्य: 20 ग्राहक।\n• **माह 2:** सबसे सफल चैनल पर ध्यान दें और टेस्टीमोनियल शेयर करें। लक्ष्य: +35 ग्राहक (कुल 55)।\n• **माह 3:** रेफ़रल ऑफ़र दें और पुराने लीड्स का फॉलो-अप करें। लक्ष्य: +45 ग्राहक (कुल 100)।',
    source: 'B2B Sales Engineering Framework',
    verified: true,
    lastUpdated: '2026-10-17'
  },
  {
    id: 'kb-mrr-churn-math',
    category: 'business',
    canonicalQuestion: 'How to calculate MRR and Churn?',
    aliases: [
      'mrr calculation', 'churn calculation', 'calculate mrr', 'mrr churn formula',
      'monthly recurring revenue'
    ],
    shortAnswerEn: 'MRR = Active Paying Customers × Monthly Subscription Price. Churned Customers = Customers × Churn Rate. Remaining MRR = (Initial Customers − Churned Customers) × Price.',
    detailedAnswerEn: '• **Monthly Recurring Revenue (MRR):** Total predictable subscription revenue earned each month.\n  - Formula: `MRR = Active Customers × Monthly Fee`\n• **Churn Rate:** Percentage of subscribers who cancel in a billing period.\n  - Formula: `Lost Customers = Customers × Churn Rate`\n• **Example:** 120 customers at ₹499/month with 15% churn:\n  - Lost: 120 × 0.15 = 18 customers\n  - Remaining: 120 − 18 = 102 customers\n  - Remaining MRR: 102 × ₹499 = **₹50,898**.',
    shortAnswerHi: 'MRR = सक्रिय ग्राहक × मासिक शुल्क। Churn = रद्द करने वाले ग्राहकों की दर। 120 ग्राहक, 15% Churn और ₹499 दर पर शेष MRR = ₹50,898 होता है।',
    detailedAnswerHi: '• **MRR:** मासिक आवर्ती आय।\n• **Churn:** ग्राहकों द्वारा सेवा छोड़ना।\n• **गणना (उदा. 120 ग्राहक, 15% कैंसल, ₹499 शुल्क):**\n  - रद्द ग्राहक: 18\n  - शेष ग्राहक: 102\n  - नया मासिक MRR: 102 × ₹499 = **₹50,898**।',
    source: 'SaaS Metrics Standard Guide',
    verified: true,
    lastUpdated: '2026-10-17'
  },

  // -------------------------------------------------------------
  // 7. INDIAN BUSINESS & COMMERCE
  // -------------------------------------------------------------
  {
    id: 'kb-indian-numbering-gst',
    category: 'indian_biz',
    canonicalQuestion: 'What are Lakhs, Crores, and Indian GST basics?',
    aliases: [
      'what is lakh', 'what is crore', 'lakh crore conversion', 'gst basics',
      'indian numbering system', 'gst kya hai'
    ],
    shortAnswerEn: '1 Lakh is 100,000 (10^5) and 1 Crore is 10,000,000 or 100 Lakhs (10^7). GST (Goods and Services Tax) is India\'s unified indirect consumption tax with standard slabs (0%, 5%, 12%, 18%, 28%).',
    detailedAnswerEn: '• **Indian Numbering Conventions:**\n  - 1 Thousand = 1,000\n  - 1 Lakh = 1,00,000 (One hundred thousand)\n  - 1 Crore = 1,00,00,000 (Ten million / 100 Lakhs)\n• **GST (Goods and Services Tax):**\n  - Unified destination-based tax replacing prior VAT, Service Tax, and Excise.\n  - Divided into CGST (Central), SGST (State), and IGST (Interstate).\n  - Software services generally attract 18% GST with Input Tax Credit (ITC) eligibility for registered businesses.',
    shortAnswerHi: '1 लाख = 1,00,000 और 1 करोड़ = 1,00,00,000 (100 लाख)। GST भारत का एकीकृत अप्रत्यक्ष कर है जिसमें सॉफ़्टवेयर सेवाओं पर आमतौर पर 18% दर लागू होती है।',
    detailedAnswerHi: '• 1 लाख: 100 हजार (1,00,000)\n• 1 करोड़: 100 लाख (1,00,00,000)\n• GST: वस्तु एवं सेवा कर। सॉफ़्टवेयर और डिजिटल सेवाओं पर सामान्यतः 18% GST देय होता है।',
    source: 'Indian Commerce & Taxation Educational Overview',
    verified: true,
    lastUpdated: '2026-10-17'
  },

  // -------------------------------------------------------------
  // 8. GENERAL KNOWLEDGE & SCIENCE
  // -------------------------------------------------------------
  {
    id: 'kb-general-science-gravity',
    category: 'general',
    canonicalQuestion: 'What is Gravity?',
    aliases: ['what is gravity', 'gravity kya hai', 'explain gravity', 'gurutwakarshan'],
    shortAnswerEn: 'Gravity is the fundamental force of attraction by which physical bodies with mass pull other objects toward their center.',
    detailedAnswerEn: 'Gravity is one of the four fundamental forces of nature. Described by Sir Isaac Newton as universal gravitation (`F = G * (m1*m2)/r^2`) and further deepened by Albert Einstein\'s General Relativity as the curvature of spacetime caused by mass and energy. On Earth, gravity accelerates falling objects at approximately 9.8 m/s².',
    shortAnswerHi: 'गुरुत्वाकर्षण (Gravity) वह प्राकृतिक बल है जिसके द्वारा द्रव्यमान (Mass) वाली वस्तुएं एक-दूसरे को अपनी ओर खींचती हैं।',
    detailedAnswerHi: 'गुरुत्वाकर्षण प्रकृति के चार मौलिक बलों में से एक है। पृथ्वी पर इसका त्वरण लगभग 9.8 m/s² होता है, जिससे सभी वस्तुएं ज़मीन की ओर खिंचती हैं।',
    source: 'Physics Fundamentals Encyclopedia',
    verified: true,
    lastUpdated: '2026-10-17'
  },
  {
    id: 'kb-general-solar-system',
    category: 'general',
    canonicalQuestion: 'How many planets are in our Solar System?',
    aliases: ['planets in solar system', 'solar system', 'how many planets', 'graha kitne hain'],
    shortAnswerEn: 'There are 8 recognized planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.',
    detailedAnswerEn: 'In order from the Sun:\n1. Mercury (closest and smallest)\n2. Venus (hottest planet)\n3. Earth (our home)\n4. Mars (the Red Planet)\n5. Jupiter (largest gas giant)\n6. Saturn (famed for its prominent ring system)\n7. Uranus (ice giant with extreme axial tilt)\n8. Neptune (coldest outermost gas/ice giant)\n*Note: Pluto was reclassified by the IAU as a dwarf planet in 2006.*',
    shortAnswerHi: 'हमारे सौरमंडल में 8 ग्रह हैं: बुध, शुक्र, पृथ्वी, मंगल, बृहस्पति, शनि, अरुण (Uranus) और वरुण (Neptune)।',
    detailedAnswerHi: 'सूर्य से दूरी के क्रम में: 1. बुध, 2. शुक्र, 3. पृथ्वी, 4. मंगल, 5. बृहस्पति, 6. शनि, 7. अरुण, और 8. वरुण।',
    source: 'Astronomy Reference & NASA IAU Standard',
    verified: true,
    lastUpdated: '2026-10-17'
  }
];
