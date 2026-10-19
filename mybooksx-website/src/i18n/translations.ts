export type Language = 'en' | 'hi';

export interface Translations {
  nav: {
    products: string;
    services: string;
    pricing: string;
    solutions: string;
    spinWheel: string;
    work: string;
    process: string;
    faq: string;
    startProject: string;
  };
  hero: {
    badge: string;
    title1: string;
    titleHighlight: string;
    title2: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    trustBullet1: string;
    trustBullet2: string;
    trustBullet3: string;
    contactQuick: string;
  };
  festiveBanner: {
    tag: string;
    title: string;
    subtitle: string;
    highlight: string;
  };
  products: {
    badge: string;
    title: string;
    subtitle: string;
    bundleNote: string;
    items: {
      id: string;
      tag: string;
      name: string;
      desc: string;
      originalPrice: string;
      salePrice: string;
      billingType: string;
      bundlePerk: string;
      features: string[];
      popular?: boolean;
    }[];
  };
  offers: {
    badge: string;
    title: string;
    subtitle: string;
    deals: {
      tag: string;
      title: string;
      originalPrice: string;
      discountPrice: string;
      billingNote: string;
      desc: string;
      features: string[];
      cta: string;
      popular?: boolean;
    }[];
  };
  spinWheel: {
    badge: string;
    title: string;
    subtitle: string;
    spinBtn: string;
    spinning: string;
    alreadySpunTitle: string;
    alreadySpunDesc: string;
    wonTitle: string;
    congrats: string;
    codeLabel: string;
    applyCta: string;
    disclaimer: string;
  };
  customSolution: {
    badge: string;
    title: string;
    subtitle: string;
    businessTypeLabel: string;
    businessTypePlaceholder: string;
    nameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    serviceNeededLabel: string;
    budgetLabel: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    sendViaEmailBtn: string;
    sendViaWhatsAppBtn: string;
    successTitle: string;
    successDesc: string;
    directReach: string;
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      id: string;
      title: string;
      desc: string;
      features: string[];
    }[];
  };
  interactiveFinder: {
    badge: string;
    title: string;
    subtitle: string;
    tabs: { id: string; label: string }[];
    recs: Record<string, {
      title: string;
      description: string;
      timeline: string;
      bestFor: string;
      deliverables: string[];
    }>;
  };
  projects: {
    badge: string;
    title: string;
    subtitle: string;
    demoNote: string;
    items: {
      tag: string;
      title: string;
      desc: string;
      metrics: string;
    }[];
  };
  process: {
    badge: string;
    title: string;
    subtitle: string;
    steps: {
      num: string;
      title: string;
      desc: string;
    }[];
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      q: string;
      a: string;
    }[];
  };
  footer: {
    tagline: string;
    callUs: string;
    emailUs: string;
    address: string;
    rights: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      products: "Products Suite",
      services: "Services",
      pricing: "Pricing & Deals",
      solutions: "Solutions",
      spinWheel: "Lucky Spin Wheel",
      work: "Featured Work",
      process: "Process",
      faq: "FAQ",
      startProject: "Start Project",
    },
    hero: {
      badge: "ROYAL LUXURY DIGITAL ENGINEERING",
      title1: "Complex Ideas.",
      titleHighlight: "Beautifully Engineered.",
      title2: "Built for ambitious growing businesses.",
      subtitle: "MyBooksX creates bespoke web applications, custom Android applications, AI automated pipelines, and dedicated software suites built specifically around your exact daily workflow.",
      primaryCta: "Claim Festive Deal & Start",
      secondaryCta: "Spin Discount Wheel",
      trustBullet1: "Bespoke Architecture",
      trustBullet2: "Zero Generic Templates",
      trustBullet3: "Direct Founder Access",
      contactQuick: "Direct Hotline: +91 9644570828 | mybooksxofficial@gmail.com",
    },
    festiveBanner: {
      tag: "SPECIAL FESTIVE OFFER",
      title: "Exclusive Season Sale & Product Ecosystem",
      subtitle: "Build any custom software or Android app and unlock our flagship product suite (Ojas AI, Event-X, Fitness-X) for FREE or just ₹999!",
      highlight: "Special Price Cuts Applied on All Products"
    },
    products: {
      badge: "OUR PRODUCT SUITE",
      title: "Ready-To-Deploy Flagship Products",
      subtitle: "Special pricing available independently, OR bundled for FREE / ₹999 when you commission custom software development!",
      bundleNote: "BUNDLE SPECIAL: Get Ojas AI, Event-X, or Fitness-X for FREE (or just ₹999) when you develop a custom app or website with us!",
      items: [
        {
          id: "resto-x",
          tag: "RESTAURANT & CAFE POS",
          name: "Resto-X",
          desc: "Complete restaurant billing, kitchen display system (KDS), table QR ordering, inventory, and automated GST reporting.",
          originalPrice: "₹9,000/yr",
          salePrice: "₹5,499/yr",
          billingType: "or Permanent Lifetime License at ₹24,999 (Includes Free App)",
          bundlePerk: "Includes Free Android Waiter/Billing App with Permanent License!",
          features: [
            "Table QR digital ordering & billing",
            "Kitchen Order Ticket (KOT) sync",
            "Raw material inventory & recipe tracking",
            "WhatsApp digital invoice dispatch",
            "Lifetime license includes complimentary Android app"
          ],
          popular: true
        },
        {
          id: "event-x",
          tag: "WEDDING & EVENT SUITE",
          name: "Event-X (Wedding App)",
          desc: "Royal wedding & premium event companion app for guest RSVP, photo sharing vault, event itinerary, and location maps.",
          originalPrice: "₹18,000",
          salePrice: "₹9,999",
          billingType: "Full Event Lifetime Access",
          bundlePerk: "FREE with Custom Website or Android App orders (or ₹999 add-on)",
          features: [
            "Bespoke couple story & ceremony countdown",
            "Interactive RSVP & guest check-in",
            "Real-time guest photo upload feed",
            "Digital invitation cards & venue GPS map",
            "Push notifications for ceremonies"
          ],
          popular: false
        },
        {
          id: "ojas-ai",
          tag: "INTELLIGENT AI AGENT",
          name: "Ojas AI",
          desc: "Next-generation 24/7 business AI assistant that speaks English & Hindi, handles customer leads, and extracts invoice data.",
          originalPrice: "₹25,000",
          salePrice: "₹14,999",
          billingType: "One-Time Setup & Integration",
          bundlePerk: "FREE with Enterprise custom development (or ₹999 add-on)",
          features: [
            "Bilingual Hindi & English conversational AI",
            "Trained on your private business catalog & FAQ",
            "Automated WhatsApp lead reply bot",
            "Paper invoice & receipt OCR reader",
            "Seamless webhook integration with your CRM"
          ],
          popular: true
        },
        {
          id: "fitness-x",
          tag: "HEALTH & GYM SUITE",
          name: "Fitness-X",
          desc: "Modern gym, fitness club & trainer management app with member check-in, subscription renewal alerts, and workout plans.",
          originalPrice: "₹16,000",
          salePrice: "₹8,999",
          billingType: "One-Time Setup with Cloud Hub",
          bundlePerk: "FREE with Custom App order (or ₹999 add-on)",
          features: [
            "Member attendance & biometric/QR scan",
            "Automated WhatsApp renewal reminders",
            "Trainer scheduling & client tracking",
            "Integrated UPI subscription payments",
            "Mobile-friendly member dashboard"
          ],
          popular: false
        }
      ]
    },
    offers: {
      badge: "LIMITED PERIOD CUSTOM PRICING",
      title: "Transparent & Honest Engineering Costs",
      subtitle: "Bespoke digital architecture crafted for high ROI with zero hidden licensing charges.",
      deals: [
        {
          tag: "HIGH DEMAND",
          title: "Customized Website Development",
          originalPrice: "₹38,000",
          discountPrice: "₹24,999",
          billingNote: "Yearly ₹5,999/yr (₹6,999 with Ojas AI) • Lifetime ₹24,999 with 100% source code",
          desc: "Full bespoke luxury responsive website engineered for your exact branding, search engine rankings, and high conversion.",
          features: [
            "Unique bespoke luxury design (Neutral Elegance theme)",
            "Dynamic multilingual engine (English & Hindi)",
            "Mobile-first ultra-responsive performance",
            "Direct WhatsApp & Email lead transmission",
            "Google Search Console & SEO optimization ready",
            "Yearly: ₹5,999/yr (or ₹6,999/yr with Ojas AI) • Lifetime: ₹24,999"
          ],
          cta: "Claim Custom Website",
          popular: true
        },
        {
          tag: "FLAGSHIP ENTERPRISE",
          title: "Customized Android App Development",
          originalPrice: "₹65,000",
          discountPrice: "₹29,999",
          billingNote: "Yearly ₹6,999/yr (₹7,999 with Ojas AI) • Lifetime ₹29,999 with 100% source code",
          desc: "Native-grade Android mobile application customized to your inventory, dispatch, field staff, or customer ordering flow.",
          features: [
            "Custom-built Mobile App & Play Store launch",
            "Real-time cloud database synchronization",
            "Push alerts, user authentication & OTP login",
            "Payment gateway integration (UPI, QR, Cards)",
            "Yearly: ₹6,999/yr (or ₹7,999/yr with Ojas AI) • Lifetime: ₹29,999",
            "Admin web dashboard included"
          ],
          cta: "Claim Android App",
          popular: true
        },
        {
          tag: "ALL-IN-ONE ENTERPRISE",
          title: "Custom Business ERP & Billing Hub",
          originalPrice: "₹85,000",
          discountPrice: "₹49,999",
          billingNote: "multi-branch operational hub",
          desc: "Replace chaotic spreadsheets with a single connected software that unifies warehouse stock, staff attendance, vendor bills, and daily profit.",
          features: [
            "Custom web ERP with role-based access",
            "Multi-branch live inventory transfer",
            "Automated GST invoicing & WhatsApp dispatch",
            "Staff attendance & salary payroll calculations",
            "Includes Ojas AI customer bot free of cost",
            "Full source code ownership transfer"
          ],
          cta: "Get Custom ERP (₹49,999)",
          popular: false
        }
      ]
    },
    spinWheel: {
      badge: "FESTIVE LUCKY WHEEL",
      title: "Spin the Wheel & Claim Your Exclusive Voucher",
      subtitle: "Give our royal wheel a spin to unlock special festive discounts! Each visitor can spin once.",
      spinBtn: "SPIN THE WHEEL NOW",
      spinning: "Spinning the Wheel...",
      alreadySpunTitle: "You have already spun the wheel!",
      alreadySpunDesc: "Your lucky voucher has been saved. Use this discount code in your inquiry:",
      wonTitle: "Congratulations! You Unlocked",
      congrats: "Discount Voucher unlocked! Mention this promo code when submitting your inquiry:",
      codeLabel: "PROMO CODE:",
      applyCta: "Apply Discount to My Inquiry",
      disclaimer: "Valid for 1 spin per user. Applicable on custom software, website, and Android app orders.",
    },
    customSolution: {
      badge: "SUBMIT YOUR INQUIRY",
      title: "Tell Us What You Want To Build",
      subtitle: "Enter your business details below. Select whether to send via WhatsApp or directly via Email to our leadership team.",
      businessTypeLabel: "Business Type / Industry",
      businessTypePlaceholder: "e.g., Restaurant, Retail, Gym, Wedding Planner, Manufacturing",
      nameLabel: "Your Full Name",
      phoneLabel: "Phone / WhatsApp Number",
      emailLabel: "Email Address",
      serviceNeededLabel: "Select Required Service / Product",
      budgetLabel: "Approximate Budget",
      detailsLabel: "Describe Your Vision or Workflow Challenges",
      detailsPlaceholder: "Describe your business operations and what digital features you need developed...",
      sendViaWhatsAppBtn: "Send Inquiry via WhatsApp",
      sendViaEmailBtn: "Send Inquiry via Email",
      successTitle: "Inquiry Successfully Prepared!",
      successDesc: "Your details have been recorded. Our senior engineers at mybooksxofficial@gmail.com and hotline +91 9644570828 will connect with you.",
      directReach: "Prefer instant phone call? Ring us at +91 9644570828"
    },
    services: {
      badge: "OUR CAPABILITIES",
      title: "Bespoke Digital Engineering",
      subtitle: "We engineer systems that match your exact business routines instead of forcing you into rigid templates.",
      items: [
        {
          id: "custom-software",
          title: "Custom Business Software",
          desc: "Dedicated internal operational tools, billing portals, and inventory controllers built to eliminate paperwork and manual human error.",
          features: ["Role-based access", "Automated ledger tracking", "Custom reporting dashboards"]
        },
        {
          id: "web-apps",
          title: "Next-Gen Web Platforms",
          desc: "Modern, high-performance browser applications, client self-service portals, and cloud SaaS platforms with elegant UI/UX.",
          features: ["Real-time data synchronization", "Mobile & tablet friendly", "Bilingual interfaces"]
        },
        {
          id: "android-apps",
          title: "Custom Android Applications",
          desc: "Performant, dependable Android mobile apps for your staff in the field, delivery tracking, or direct customer ordering.",
          features: ["Offline-first data sync", "Instant push alerts", "Biometric and OTP login"]
        },
        {
          id: "ai-agents",
          title: "Ojas AI Workflows & Bots",
          desc: "Embed practical generative AI agents directly into your software for customer inquiry replies, invoice scanning, and automated summarization.",
          features: ["Custom trained knowledgebase", "Automated document OCR", "Zero repetitive tasks"]
        },
        {
          id: "resto-pos",
          title: "Resto-X Restaurant Suites",
          desc: "Specialized dining software with table ordering, KOT, and inventory starting at ₹5,499/yr or ₹24,999 lifetime with free app.",
          features: ["Kitchen display", "QR ordering", "Complimentary Android app"]
        },
        {
          id: "event-vivah",
          title: "Event-X Celebration Suites",
          desc: "Exclusive customized digital wedding experience with personalized invite cards, photo vaults, and event itineraries at only ₹9,999 (or free in bundles).",
          features: ["High definition photo gallery", "Interactive venue map", "Ceremony countdown & alerts"]
        }
      ]
    },
    interactiveFinder: {
      badge: "SOLUTION SELECTOR",
      title: "Find the Perfect Tech Blueprint for Your Needs",
      subtitle: "Click your primary business goal to see recommended stack, realistic timelines, and implementation strategy.",
      tabs: [
        { id: "resto", label: "Resto-X & Dining" },
        { id: "event", label: "Event-X & Wedding" },
        { id: "fitness", label: "Fitness-X & Gym" },
        { id: "ojas", label: "Ojas AI Automation" },
        { id: "custom", label: "Custom Android / ERP" }
      ],
      recs: {
        resto: {
          title: "Resto-X Hospitality Architecture",
          description: "Cut dining order delays with unified table QR billing, kitchen order tickets, and raw material tracking. Choose annual ₹5,499 or ₹24,999 lifetime with free waiter app.",
          timeline: "3 to 5 Days Rapid Deployment",
          bestFor: "Cafes, fine dining restaurants, food courts, and cloud kitchens.",
          deliverables: ["Cloud Billing POS", "Complimentary Android Waiter App", "Kitchen Display Screen", "WhatsApp Invoice Dispatch"]
        },
        event: {
          title: "Event-X Royal Digital Wedding Suite",
          description: "A lavish, personalized mobile app for your grand wedding celebrations with guests from all across the globe. Only ₹9,999 (or FREE with custom projects).",
          timeline: "2 to 4 Days Deployment",
          bestFor: "Couples, families, and event planners looking for a royal digital experience.",
          deliverables: ["Customized Event Web/Android App", "Interactive RSVP & Guest Management", "Live Guest Photo Sharing Feed", "Venue GPS & Schedule Timeline"]
        },
        fitness: {
          title: "Fitness-X Gym & Club Manager",
          description: "Simplify member subscriptions, biometric attendance, and personal training slots. Available at ₹8,999 or bundled with custom orders.",
          timeline: "1 Week Delivery",
          bestFor: "Gyms, yoga studios, crossfit boxes, and sports clubs.",
          deliverables: ["Member Management Portal", "Automated WhatsApp Renewal Alerts", "QR Check-in Scanner", "Trainer Schedule Manager"]
        },
        ojas: {
          title: "Ojas AI Business Intelligence Co-Pilot",
          description: "Equip your business with an AI assistant that answers client questions 24/7 in English and Hindi, and reads handwritten bills. Available at ₹14,999 or bundled.",
          timeline: "1 to 2 Weeks Delivery",
          bestFor: "Companies spending too many hours responding to repetitive customer queries.",
          deliverables: ["Bilingual AI Support Assistant", "Document & Invoice Auto-Scanner", "Smart WhatsApp Bot Integration", "Human Fallback Escalation"]
        },
        custom: {
          title: "Bespoke Enterprise Operations & Android Suite",
          description: "Say goodbye to chaotic spreadsheets. We build a unified dashboard that tracks jobs, staff attendance, vendor bills, and profit margins starting at ₹29,999.",
          timeline: "3 to 4 Weeks Delivery",
          bestFor: "Growing businesses with 5 to 100+ team members needing structured operational flow.",
          deliverables: ["Custom Web Management Portal", "Staff Mobile Check-in App", "Daily Profit/Loss Automated Reports", "Multi-branch cloud support"]
        }
      }
    },
    projects: {
      badge: "DEMONSTRATION SHOWCASE",
      title: "Real-World Engineering Concepts",
      subtitle: "Take an interactive look at typical bespoke software architectures built by MyBooksX.",
      demoNote: "Interactive Prototype / Conceptual Case Study",
      items: [
        {
          tag: "Resto-X Case Study",
          title: "Cloud Restaurant POS & Android KOT System",
          desc: "Centralized hub managing table QR billing, kitchen printouts, and automated GST reporting across 3 cafe locations.",
          metrics: "3x Faster Table Turnover • Zero Order Errors"
        },
        {
          tag: "Custom Android App",
          title: "Field Sales & Dispatch Tracker for Android",
          desc: "Custom Android application featuring offline route logging, customer signature capture, and instant WhatsApp payment links.",
          metrics: "Offline-First • Cut Paperwork by 85%"
        },
        {
          tag: "Event-X Vivah",
          title: "Royal Vivah: Interactive Wedding Companion",
          desc: "A breathtaking digital companion app for wedding guests featuring instant Hindi/English greetings, photo vault, and countdown reminders.",
          metrics: "1,200+ Guest Uploads • 100% RSVP Accuracy"
        },
        {
          tag: "Ojas AI Integration",
          title: "Intelligent Multi-Channel Inquiry Bot",
          desc: "Automated support system handling client quotes, catalogue dispatch, and order status updates around the clock in Hindi and English.",
          metrics: "24/7 Zero Latency • 65% Support Deflection"
        }
      ]
    },
    process: {
      badge: "OUR METHODOLOGY",
      title: "A Transparent, 5-Step Path to Launch",
      subtitle: "No confusing jargon. You know exactly what stage your software is at every single day.",
      steps: [
        {
          num: "01",
          title: "Deep Workflow Discovery",
          desc: "We analyze your exact business routines, pain points, paper forms, and current software gaps to architect the ideal solution."
        },
        {
          num: "02",
          title: "Bespoke Architecture & Design",
          desc: "We craft custom user interfaces and interactive prototypes that match your brand identity and staff workflows."
        },
        {
          num: "03",
          title: "Agile Engineering & Build",
          desc: "Clean, robust code engineered with modern frameworks, bank-grade encryption, and rapid iterative progress updates."
        },
        {
          num: "04",
          title: "Rigorous Testing & Training",
          desc: "Stress-testing across mobile devices, tablets, and desktops. We train your staff so adoption is smooth and immediate."
        },
        {
          num: "05",
          title: "Launch & Continuous Support",
          desc: "Seamless deployment with our annual maintenance package (cut from ₹8,000 to ₹5,999/yr) ensuring security & 100% uptime."
        }
      ]
    },
    faq: {
      badge: "COMMON QUESTIONS",
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about partnering with MyBooksX.",
      items: [
        {
          q: "What are your flagship products and pricing?",
          a: "We offer Resto-X (Restaurant POS at ₹5,499/yr or ₹24,999 lifetime with free app), Event-X (Wedding app at ₹9,999), Fitness-X (Gym manager at ₹8,999), and Ojas AI (Smart business assistant at ₹14,999). Best of all, if you commission custom app or software development, you can get Event-X, Fitness-X, or Ojas AI bundled for FREE or just ₹999!"
        },
        {
          q: "What are your custom software development rates?",
          a: "Custom website development is on festive sale at ₹24,999 (cut from ₹38,000/₹30,000). Custom Android app development is ₹29,999 (cut from ₹65,000/₹50,000) with complete source code and Play Store launch setup."
        },
        {
          q: "What is your Android app yearly maintenance cost?",
          a: "Our yearly Android app maintenance fee has been permanently cut from ₹8,000 down to just ₹5,999/year. It covers cloud server health, database backups, security patches, and OS compatibility updates."
        },
        {
          q: "How does the Lucky Spin Wheel work?",
          a: "Each visitor can spin the wheel once. It unlocks guaranteed high-value vouchers (such as 10% OFF, 12% OFF, 7% OFF, or Flat ₹1,000 OFF). Once spun, your coupon code is securely saved and automatically applied to your inquiry."
        },
        {
          q: "How do I submit an inquiry?",
          a: "You can submit your business details in our Custom Solution form and choose to send it via WhatsApp (to +91 9644570828) or via Direct Email (to mybooksxofficial@gmail.com). Our team will connect with you promptly."
        }
      ]
    },
    footer: {
      tagline: "Custom Software Development, Web Applications & Digital Engineering. Built with royal luxury craftsmanship for forward-thinking enterprises.",
      callUs: "Phone / WhatsApp: +91 9644570828",
      emailUs: "Email: mybooksxofficial@gmail.com",
      address: "India • Serving Worldwide Clients",
      rights: "All rights reserved. MyBooksX Software Development Studio."
    }
  },
  hi: {
    nav: {
      products: "प्रोडक्ट्स सुइट",
      services: "सेवाएं",
      pricing: "कीमतें और ऑफर्स",
      solutions: "सॉल्यूशंस",
      spinWheel: "लकी स्पिन व्हील",
      work: "हमारा काम",
      process: "प्रक्रिया",
      faq: "सवाल-जवाब",
      startProject: "प्रोजेक्ट शुरू करें",
    },
    hero: {
      badge: "रॉयल लग्जरी डिजिटल इंजीनियरिंग",
      title1: "जटिल विचार।",
      titleHighlight: "शानदार इंजीनियरिंग।",
      title2: "आपके व्यवसाय के लिए विशेष सॉफ़्टवेयर।",
      subtitle: "MyBooksX आपके व्यवसाय के लिए कस्टम वेबसाइट्स, एंड्रॉइड ऐप्स, AI वर्कफ़्लो और एंटरप्राइज सॉफ़्टवेयर तैयार करता है, जो ठीक उसी तरह काम करते हैं जैसे आपका बिज़नेस चलता है।",
      primaryCta: "त्योहारी ऑफर पाएं और शुरू करें",
      secondaryCta: "डिस्काउंट व्हील घुमाएँ",
      trustBullet1: "कस्टम आर्किटेक्चर",
      trustBullet2: "100% आपकी ज़रूरतों के अनुसार",
      trustBullet3: "डायरेक्ट फाउंडर सपोर्ट",
      contactQuick: "हेल्पलाइन: +91 9644570828 | mybooksxofficial@gmail.com",
    },
    festiveBanner: {
      tag: "विशेष त्योहारी महा-ऑफर",
      title: "सीमित समय के लिए विशेष छूट और प्रोडक्ट इकोसिस्टम",
      subtitle: "कस्टम वेबसाइट या एंड्रॉइड ऐप बनवाएं और हमारे प्रमुख प्रोडक्ट्स (Ojas AI, Event-X, Fitness-X) बिल्कुल मुफ़्त या सिर्फ ₹999 में पाएं!",
      highlight: "सभी प्रोडक्ट्स और सेवाओं पर भारी छूट लागू"
    },
    products: {
      badge: "हमारे प्रमुख प्रोडक्ट्स",
      title: "तुरंत उपयोग के लिए तैयार डिजिटल प्रोडक्ट्स",
      subtitle: "इन्हें स्वतंत्र रूप से खरीदें, या कस्टम ऐप बनवाने पर मुफ़्त / सिर्फ ₹999 में बंडल करवाएं!",
      bundleNote: "बंडल स्पेशल: जब आप हमारे साथ कस्टम ऐप या वेबसाइट बनवाते हैं, तो Ojas AI, Event-X, या Fitness-X बिल्कुल मुफ़्त (या सिर्फ ₹999) में प्राप्त करें!",
      items: [
        {
          id: "resto-x",
          tag: "रेस्टोरेंट व कैफे POS",
          name: "Resto-X",
          desc: "रेस्टोरेंट के लिए संपूर्ण डिजिटल बिलिंग, किचन डिस्प्ले (KOT), टेबल QR कोड ऑर्डरिंग, इन्वेंटरी और GST रिपोर्टिंग।",
          originalPrice: "₹9,000/वर्ष",
          salePrice: "₹5,499/वर्ष",
          billingType: "या लाइफटाइम परमानेंट लाइसेंस ₹24,999 में (मुफ़्त ऐप के साथ)",
          bundlePerk: "लाइफटाइम लाइसेंस के साथ एंड्रॉइड वेटर/बिलिंग ऐप बिल्कुल मुफ़्त!",
          features: [
            "टेबल QR डिजिटल मेनू व ऑर्डरिंग",
            "किचन ऑर्डर टिकट (KOT) सिंक",
            "कच्चे माल की इन्वेंटरी व रेसिपी ट्रैकिंग",
            "व्हाट्सएप पर तुरंत डिजिटल इनवॉइस",
            "परमानेंट प्लान में एंड्रॉइड ऐप मुफ़्त"
          ],
          popular: true
        },
        {
          id: "event-x",
          tag: "वेडिंग और इवेंट सुइट",
          name: "Event-X (वेडिंग ऐप)",
          desc: "शाही शादी और आयोजनों के लिए खास ऐप — मेहमानों के लिए डिजिटल इनवाइट, लाइव फोटो गैलरी और गूगल मैप्स वेन्यू।",
          originalPrice: "₹18,000",
          salePrice: "₹9,999",
          billingType: "पूर्ण इवेंट लाइफटाइम एक्सेस",
          bundlePerk: "कस्टम ऐप या वेबसाइट बनवाने पर मुफ़्त (या सिर्फ ₹999)",
          features: [
            "वर-वधु की कहानी व रस्मों का काउंटडाउन",
            "डिजिटल RSVP व मेहमानों की लिस्ट",
            "मेहमानों द्वारा लाइव फोटो शेयरिंग",
            "डिजिटल निमंत्रण व वेन्यू नेविगेशन",
            "कार्यक्रमों के लिए ऑटोमैटिक अलर्ट्स"
          ],
          popular: false
        },
        {
          id: "ojas-ai",
          tag: "इंटेलिजेंट AI एजेंट",
          name: "Ojas AI",
          desc: "24/7 काम करने वाला स्मार्ट AI बिज़नेस असिस्टेंट जो हिंदी और अंग्रेजी दोनों में ग्राहकों से बात करता है और बिल स्कैन करता है।",
          originalPrice: "₹25,000",
          salePrice: "₹14,999",
          billingType: "एकमुश्त सेटअप व इंटीग्रेशन",
          bundlePerk: "कस्टम डेवलपमेंट के साथ मुफ़्त (या सिर्फ ₹999 में जोड़ें)",
          features: [
            "हिंदी और अंग्रेजी में धाराप्रवाह बातचीत",
            "आपकी कंपनी की जानकारी और कैटलॉग पर ट्रेंड",
            "व्हाट्सएप पर ऑटोमैटिक रिप्लाई बॉट",
            "हाथ से लिखे बिलों का OCR स्कैनर",
            "आपके CRM से तुरंत जुड़ाव"
          ],
          popular: true
        },
        {
          id: "fitness-x",
          tag: "जिम और फिटनेस सुइट",
          name: "Fitness-X",
          desc: "जिम, योगा सेंटर और फिटनेस क्लब के लिए आधुनिक ऐप — मेंबर्स की बायोमेट्रिक हाजिरी, रिन्यूअल अलर्ट और फीस ट्रैकर।",
          originalPrice: "₹16,000",
          salePrice: "₹8,999",
          billingType: "क्लाउड हब के साथ एकमुश्त सेटअप",
          bundlePerk: "कस्टम ऐप बनवाने पर मुफ़्त (या सिर्फ ₹999 में)",
          features: [
            "मेंबर अटेंडेंस व QR स्कैन",
            "व्हाट्सएप पर ऑटोमैटिक फीस रिन्यूअल मैसेज",
            "ट्रेनर शेड्यूल व क्लाइंट ट्रैकिंग",
            "UPI और ऑनलाइन फीस पेमेंट",
            "मेंबर्स के लिए आसान मोबाइल ऐप"
          ],
          popular: false
        }
      ]
    },
    offers: {
      badge: "सीमित समय के लिए कस्टम डेवलपमेंट रेट्स",
      title: "स्पष्ट, पारदर्शी और रियायती कीमतें",
      subtitle: "प्रीमियम डिजिटल इंजीनियरिंग, बिना किसी छुपे हुए खर्च के। स्थायी मालिकाना हक के साथ।",
      deals: [
        {
          tag: "सबसे लोकप्रिय",
          title: "कस्टमाइज्ड वेबसाइट डेवलपमेंट",
          originalPrice: "₹38,000",
          discountPrice: "₹24,999",
          billingNote: "इयरली ₹5,999/साल (Ojas AI सहित ₹6,999) • लाइफटाइम ₹24,999 100% सोर्स कोड सहित",
          desc: "आपके व्यवसाय के लिए विशेष रूप से बनाई गई वेबसाइट, जो ग्राहकों का भरोसा जीतती है और बिक्री बढ़ाती है।",
          features: [
            "यूनिक रॉयल लग्जरी डिज़ाइन (Neutral Elegance थीम)",
            "हिंदी और अंग्रेजी दोनों भाषाओं में संपूर्ण सपोर्ट",
            "मोबाइल और टैबलेट पर सुपरफास्ट डिस्प्ले",
            "व्हाट्सएप और ईमेल इंक्वायरी सीधे कनेक्टेड",
            "गूगल सर्च (SEO) के लिए पूरी तरह अनुकूलित",
            "इयरली: ₹5,999/साल (या Ojas AI सहित ₹6,999) • लाइफटाइम: ₹24,999"
          ],
          cta: "कस्टम वेबसाइट ऑर्डर करें",
          popular: true
        },
        {
          tag: "हाई रिटर्न बिज़नेस ऐप",
          title: "कस्टमाइज्ड एंड्रॉइड ऐप डेवलपमेंट",
          originalPrice: "₹65,000",
          discountPrice: "₹29,999",
          billingNote: "इयरली ₹6,999/साल (Ojas AI सहित ₹7,999) • लाइफटाइम ₹29,999 100% सोर्स कोड सहित",
          desc: "आपके बिज़नेस, बिलिंग, इन्वेंटरी या आर्डर बुकिंग के लिए खास तौर पर तैयार किया गया फास्ट एंड्रॉइड ऐप।",
          features: [
            "आपकी ज़रूरतों के अनुसार मोबाइल ऐप और प्ले स्टोर सेटअप",
            "रियल-टाइम क्लाउड डेटाबेस सिंक",
            "पुश नोटिफिकेशन और सुरक्षित यूजर लॉगिन",
            "पेमेंट गेटवे (UPI, कार्ड) इंटीग्रेशन",
            "इयरली: ₹6,999/साल (या Ojas AI सहित ₹7,999) • लाइफटाइम: ₹29,999",
            "मालिक के लिए आसान एडमिन पैनल"
          ],
          cta: "एंड्रॉइड ऐप ऑर्डर करें",
          popular: true
        },
        {
          tag: "संपूर्ण एंटरप्राइज सुइट",
          title: "कस्टम बिज़नेस ERP व बिलिंग हब",
          originalPrice: "₹85,000",
          discountPrice: "₹49,999",
          billingNote: "मल्टी-ब्रांच संचालन केंद्र",
          desc: "एक्सेल शीट्स की झंझट खत्म। एक ही स्क्रीन पर गोदामों का स्टॉक, कर्मचारियों की उपस्थिति, बिल और शुद्ध लाभ देखें।",
          features: [
            "रोल-बेस्ड एक्सेस के साथ कस्टम वेब ERP",
            "गोदामों के बीच रियल-टाइम स्टॉक ट्रांसफर",
            "ऑटोमैटिक GST इनवॉइस व व्हाट्सएप रसीद",
            "स्टाफ अटेंडेंस और सैलरी पेरोल सिस्टम",
            "Ojas AI कस्टमर बॉट बिल्कुल मुफ़्त शामिल",
            "पूरा सोर्स कोड आपके नाम"
          ],
          cta: "कस्टम ERP बनवाएं (₹49,999)",
          popular: false
        }
      ]
    },
    spinWheel: {
      badge: "त्योहारी लकी व्हील",
      title: "पहिया घुमाएँ और विशेष छूट अनलॉक करें",
      subtitle: "अपनी किस्मत आजमाएं! हर आगंतुक इसे एक बार घुमा सकता है और गारंटीड छूट (10%, 12%, 7% या ₹1,000 फ्लैट) पा सकता है।",
      spinBtn: "अभी व्हील घुमाएँ",
      spinning: "पहिया घूम रहा है...",
      alreadySpunTitle: "आप पहले ही व्हील घुमा चुके हैं!",
      alreadySpunDesc: "आपका लकी वाउचर कोड सुरक्षित है। इंक्वायरी भेजते समय इस कूपन कोड का उपयोग करें:",
      wonTitle: "बधाई हो! आपने जीता",
      congrats: "आपके नए प्रोजेक्ट पर डिस्काउंट वाउचर लागू हो गया है! इंक्वायरी में यह प्रोमो कोड दर्ज करें:",
      codeLabel: "प्रोमो कोड:",
      applyCta: "यह डिस्काउंट मेरे प्रोजेक्ट पर लगाएं",
      disclaimer: "प्रति यूजर 1 बार स्पिन करने की अनुमति। वेबसाइट, ऐप और कस्टम सॉफ़्टवेयर पर मान्य।",
    },
    customSolution: {
      badge: "अपनी इंक्वायरी भेजें",
      title: "बताएं आपको क्या विकसित करवाना है",
      subtitle: "नीचे अपनी जानकारी भरें। आप अपनी इंक्वायरी सीधे व्हाट्सएप या ईमेल के माध्यम से हमारे नेतृत्व को भेज सकते हैं।",
      businessTypeLabel: "व्यवसाय का प्रकार / इंडस्ट्री",
      businessTypePlaceholder: "जैसे: रेस्टोरेंट, रिटेल दुकान, जिम, वेडिंग प्लानर, मैन्युफैक्चरिंग",
      nameLabel: "आपका पूरा नाम",
      phoneLabel: "फ़ोन / व्हाट्सएप नंबर",
      emailLabel: "ईमेल आईडी",
      serviceNeededLabel: "आवश्यक सेवा या प्रोडक्ट चुनें",
      budgetLabel: "अनुमानित बजट",
      detailsLabel: "अपनी ज़रूरत या वर्तमान समस्या के बारे में लिखें",
      detailsPlaceholder: "बताएं कि आपका व्यवसाय क्या करता है और कौन सा काम आपको डिजिटल या ऑटोमैटिक करवाना है...",
      sendViaWhatsAppBtn: "व्हाट्सएप द्वारा इंक्वायरी भेजें",
      sendViaEmailBtn: "ईमेल द्वारा इंक्वायरी भेजें",
      successTitle: "इंक्वायरी तैयार हो गई है!",
      successDesc: "आपकी जानकारी नोट कर ली गई है। हमारी टीम mybooksxofficial@gmail.com और हेल्पलाइन +91 9644570828 से आपसे तुरंत संपर्क करेगी।",
      directReach: "तुरंत बात करने के लिए कॉल करें: +91 9644570828"
    },
    services: {
      badge: "हमारी तकनीकी क्षमताएं",
      title: "आपकी आवश्यकताओं के अनुसार सॉफ़्टवेयर",
      subtitle: "हम रेडीमेड टेम्पलेट के बजाय आपकी वास्तविक कार्यप्रणाली के अनुसार सिस्टम तैयार करते हैं।",
      items: [
        {
          id: "custom-software",
          title: "कस्टम बिज़नेस सॉफ़्टवेयर",
          desc: "आंतरिक बिलिंग, इन्वेंटरी और लेज़र सॉफ़्टवेयर जो कागजी काम और मानवीय गलतियों को पूरी तरह समाप्त कर देता है।",
          features: ["रोल-बेस्ड एक्सेस", "ऑटोमैटिक लेज़र ट्रैकिंग", "कस्टम रिपोर्टिंग"]
        },
        {
          id: "web-apps",
          title: "आधुनिक वेब प्लेटफॉर्म्स",
          desc: "सुपरफास्ट ब्राउज़र एप्लिकेशन और क्लाउड पोर्टल, जिनका लुक और परफॉर्मेंस बेहद प्रीमियम और सुरक्षित होता है।",
          features: ["रियल-टाइम डेटा सिंक", "मोबाइल फ्रेंडली", "द्विभाषी इंटरफ़ेस"]
        },
        {
          id: "android-apps",
          title: "कस्टम एंड्रॉइड एप्लिकेशन",
          desc: "फील्ड स्टाफ, डिलीवरी ट्रैकिंग या सीधे ग्राहकों के लिए मजबूत, आसान और भरोसेमंद मोबाइल ऐप।",
          features: ["ऑफलाइन डेटा सपोर्ट", "तुरंत पुश नोटिफिकेशन", "OTP और बायोमेट्रिक लॉगिन"]
        },
        {
          id: "ai-agents",
          title: "Ojas AI वर्कफ़्लो और बॉट्स",
          desc: "ग्राहकों के सवालों के तुरंत जवाब, इनवॉइस स्कैनिंग और ऑटोमैटिक डेटा प्रविष्टि के लिए व्यावहारिक AI टूल्स।",
          features: ["कस्टम नॉलेजबेस", "ऑटोमैटिक बिल OCR", "बिना थके 24/7 काम"]
        },
        {
          id: "resto-pos",
          title: "Resto-X रेस्टोरेंट सुइट",
          desc: "टेबल ऑर्डरिंग, KOT और इन्वेंटरी सॉफ़्टवेयर सिर्फ ₹5,499/वर्ष या ₹24,999 लाइफटाइम (मुफ़्त ऐप के साथ)।",
          features: ["किचन डिस्प्ले", "QR कोड ऑर्डरिंग", "मुफ़्त एंड्रॉइड ऐप"]
        },
        {
          id: "event-vivah",
          title: "Event-X डिजिटल वेडिंग सुइट",
          desc: "शादी के खास पलों को यादगार बनाने के लिए विशेष ऐप — सिर्फ ₹9,999 में (या कस्टम ऐप के साथ मुफ़्त)।",
          features: ["HD फोटो गैलरी", "इंटरएक्टिव वेन्यू मैप", "इवेंट काउंटडाउन व अलर्ट"]
        }
      ]
    },
    interactiveFinder: {
      badge: "सॉल्यूशन सेलेक्टर",
      title: "अपनी ज़रूरत के अनुसार सही तकनीक चुनें",
      subtitle: "अपने मुख्य लक्ष्य पर क्लिक करें और देखें कि हम उसे कैसे तैयार करेंगे।",
      tabs: [
        { id: "resto", label: "Resto-X रेस्टोरेंट" },
        { id: "event", label: "Event-X वेडिंग" },
        { id: "fitness", label: "Fitness-X जिम" },
        { id: "ojas", label: "Ojas AI ऑटोमेशन" },
        { id: "custom", label: "कस्टम एंड्रॉइड / ERP" }
      ],
      recs: {
        resto: {
          title: "Resto-X डाइनिंग आर्किटेक्चर",
          description: "टेबल QR बिलिंग, KOT और कच्चे माल की ट्रैकिंग के साथ डाइनिंग ऑर्डर की गति बढ़ाएं। सालाना ₹5,499 या ₹24,999 लाइफटाइम (मुफ़्त वेटर ऐप के साथ)।",
          timeline: "3 से 5 दिनों में लाइव",
          bestFor: "कैफे, रेस्टोरेंट, फूड कोर्ट और क्लाउड किचन।",
          deliverables: ["क्लाउड बिलिंग POS", "मुफ़्त एंड्रॉइड वेटर ऐप", "किचन डिस्प्ले स्क्रीन", "व्हाट्सएप इनवॉइस"]
        },
        event: {
          title: "Event-X रॉयल डिजिटल वेडिंग सुइट",
          description: "आपकी शाही शादी के लिए खूबसूरत मोबाइल ऐप। सिर्फ ₹9,999 (या कस्टम प्रोजेक्ट्स के साथ मुफ़्त)।",
          timeline: "2 से 4 दिनों में लाइव",
          bestFor: "वर-वधु, परिवार और वेडिंग प्लानर्स जो कुछ नया जोड़ना चाहते हैं।",
          deliverables: ["कस्टम एंड्रॉइड/वेब ऐप", "डिजिटल RSVP लिस्ट", "लाइव फोटो शेयरिंग", "वेन्यू लोकेशन व टाइमलाइन"]
        },
        fitness: {
          title: "Fitness-X जिम व क्लब मैनेजर",
          description: "मेंबर्स की फीस, बायोमेट्रिक हाजिरी और वर्कआउट शेड्यूल को संभालें। ₹8,999 में उपलब्ध या बंडल में मुफ़्त।",
          timeline: "1 सप्ताह में डिलीवरी",
          bestFor: "जिम, योगा सेंटर और स्पोर्ट्स क्लब।",
          deliverables: ["मेंबर मैनेजमेंट पोर्टल", "व्हाट्सएप रिन्यूअल अलर्ट", "QR अटेंडेंस स्कैनर", "ट्रेनर शेड्यूल मैनेजर"]
        },
        ojas: {
          title: "Ojas AI बिज़नेस को-पायलट",
          description: "एक ऐसा स्मार्ट AI सहायक जो ग्राहकों के सवालों का 24/7 हिंदी और अंग्रेजी में जवाब देता है और बिल स्कैन करता है। ₹14,999 या बंडल में मुफ़्त।",
          timeline: "1 से 2 सप्ताह में तैयार",
          bestFor: "कंपनियां जहां ग्राहकों के सवालों का जवाब देने में समय खर्च होता है।",
          deliverables: ["द्विभाषी AI सपोर्ट बॉट", "दस्तावेज़ व इनवॉइस स्कैनर", "स्मार्ट व्हाट्सएप इंटीग्रेशन", "कस्टमर फॉलोअप"]
        },
        custom: {
          title: "कस्टम बिज़नेस ऑपरेशन्स व एंड्रॉइड सुइट",
          description: "एक्सेल शीट्स की झंझट खत्म। एक ही स्क्रीन पर काम, कर्मचारियों की उपस्थिति, बिल और शुद्ध लाभ देखें (शुरुआत ₹29,999 से)।",
          timeline: "3 से 4 सप्ताह में तैयार",
          bestFor: "5 से 100+ कर्मचारियों वाली कंपनियां जिन्हें व्यवस्थित सिस्टम चाहिए।",
          deliverables: ["कस्टम मैनेजमेंट पोर्टल", "स्टाफ मोबाइल अटेंडेंस ऐप", "दैनिक लाभ-हानि रिपोर्ट", "मल्टी-ब्रांच क्लाउड सपोर्ट"]
        }
      }
    },
    projects: {
      badge: "प्रोटोटाइप और कार्यप्रणाली",
      title: "वास्तविक इंजीनियरिंग की झलक",
      subtitle: "MyBooksX द्वारा तैयार की जाने वाली आधुनिक सॉफ्टवेयर संरचनाओं को करीब से देखें।",
      demoNote: "इंटरएक्टिव प्रोटोटाइप / संकल्पनात्मक केस स्टडी",
      items: [
        {
          tag: "Resto-X केस स्टडी",
          title: "क्लाउड रेस्टोरेंट POS और एंड्रॉइड KOT सिस्टम",
          desc: "3 कैफे लोकेशन्स में टेबल QR बिलिंग, किचन प्रिंटआउट और ऑटोमैटिक GST रिपोर्टिंग का एक केंद्रीय हब।",
          metrics: "3 गुना तेज़ चेकआउट • 0% ऑर्डर गलती"
        },
        {
          tag: "कस्टम मोबाइल ऐप",
          title: "फील्ड सेल्स और डिलीवरी ट्रैकर ऐप",
          desc: "एंड्रॉइड मोबाइल ऐप जिसमें बिना इंटरनेट (ऑफलाइन) भी ऑर्डर बुकिंग, डिजिटल हस्ताक्षर और व्हाट्सएप बिलिंग उपलब्ध है।",
          metrics: "ऑफलाइन सपोर्ट • 85% कागजी बचत"
        },
        {
          tag: "Event-X विवाह",
          title: "शाही विवाह: डिजिटल वेडिंग कम्पैनियन",
          desc: "शादी के मेहमानों के लिए तैयार किया गया खूबसूरत ऐप, जिसमें फोटो वॉल्ट, डिजिटल निमंत्रण और रस्मों का शेड्यूल शामिल है।",
          metrics: "1,200+ फोटो अपलोड्स • 100% सटीक RSVP"
        },
        {
          tag: "Ojas AI इंटीग्रेशन",
          title: "मल्टी-चैनल स्मार्ट कस्टमर इंक्वायरी बॉट",
          desc: "दिन-रात ग्राहकों को कोटेशन, कैटलॉग और आर्डर स्टेटस की जानकारी हिंदी और अंग्रेजी में तुरंत प्रदान करने वाला बॉट।",
          metrics: "24/7 ज़ीरो डिले • 65% समय की बचत"
        }
      ]
    },
    process: {
      badge: "हमारी कार्यपद्धति",
      title: "सॉफ्टवेयर निर्माण के 5 पारदर्शी चरण",
      subtitle: "बिना किसी तकनीकी उलझन के। आपको हर दिन पता रहेगा कि आपका सॉफ्टवेयर किस चरण में है।",
      steps: [
        {
          num: "01",
          title: "व्यावसायिक ज़रूरत को समझना",
          desc: "हम आपकी वर्तमान कार्यप्रणाली, कागजी बिलों और कमियों को बारीकी से समझकर सही समाधान की रूपरेखा बनाते हैं।"
        },
        {
          num: "02",
          title: "कस्टम डिज़ाइन और आर्किटेक्चर",
          desc: "आपके ब्रांड के अनुरूप आसान और सुंदर यूजर इंटरफ़ेस (UI/UX) तैयार करते हैं जिसे कोई भी आसानी से चला सके।"
        },
        {
          num: "03",
          title: "विश्वसनीय कोडिंग और निर्माण",
          desc: "आधुनिक तकनीकों और बैंक-स्तरीय सुरक्षा के साथ साफ़-सुथरा कोड विकसित किया जाता है।"
        },
        {
          num: "04",
          title: "गहन परीक्षण और टीम ट्रेनिंग",
          desc: "मोबाइल, टैबलेट और कंप्यूटर पर कड़ा परीक्षण किया जाता है और आपकी टीम को पूरा प्रशिक्षण दिया जाता है।"
        },
        {
          num: "05",
          title: "सफल लॉन्च और वार्षिक देखरेख",
          desc: "आसानी से लाइव करें। हमारा वार्षिक मेंटेनेंस पैकेज (₹8,000 से घटाकर सिर्फ ₹5,999/वर्ष) सुरक्षा और अपडेट्स सुनिश्चित करता है।"
        }
      ]
    },
    faq: {
      badge: "अक्सर पूछे जाने वाले सवाल",
      title: "आपके मन के सवालों के जवाब",
      subtitle: "MyBooksX के साथ काम करने से जुड़ी सभी आवश्यक जानकारियां।",
      items: [
        {
          q: "आपके प्रमुख प्रोडक्ट्स और उनकी कीमतें क्या हैं?",
          a: "हमारे पास Resto-X (रेस्टोरेंट POS ₹5,499/वर्ष या ₹24,999 लाइफटाइम फ्री ऐप के साथ), Event-X (वेडिंग ऐप ₹9,999 में), Fitness-X (जिम ऐप ₹8,999 में), और Ojas AI (बिजनेस चैटबॉट ₹14,999 में) हैं। विशेष बात: कस्टम ऐप या वेबसाइट बनवाने पर Event-X, Fitness-X या Ojas AI बिल्कुल मुफ़्त या सिर्फ ₹999 में प्राप्त करें!"
        },
        {
          q: "कस्टम वेबसाइट और ऐप डेवलपमेंट के क्या रेट्स हैं?",
          a: "कस्टमाइज्ड वेबसाइट त्योहारी सेल में सिर्फ ₹24,999 (पहले ₹38,000 / ₹30,000) और कस्टमाइज्ड एंड्रॉइड ऐप डेवलपमेंट सिर्फ ₹29,999 (पहले ₹65,000 / ₹50,000) में संपूर्ण सोर्स कोड और प्ले स्टोर सेटअप के साथ उपलब्ध है।"
        },
        {
          q: "एंड्रॉइड ऐप के लिए सालाना मेंटेनेंस चार्ज कितना है?",
          a: "हमारे एंड्रॉइड ऐप का सालाना मेंटेनेंस शुल्क ₹8,000 से घटाकर हमेशा के लिए सिर्फ ₹5,999/वर्ष कर दिया गया है, जिसमें सर्वर, सुरक्षा, डेटा बैकअप और नए अपडेट्स शामिल हैं।"
        },
        {
          q: "डिस्काउंट स्पिन व्हील कैसे काम करता है?",
          a: "हर यूजर व्हील को एक बार घुमा सकता है। इसमें 10%, 12%, 7% या ₹1,000 फ्लैट छूट का वाउचर कोड सुरक्षित रूप से मिलता है जो आपकी इंक्वायरी में अपने आप जुड़ जाता है।"
        },
        {
          q: "हम अपनी इंक्वायरी कैसे भेज सकते हैं?",
          a: "आप फॉर्म में अपनी जानकारी भरें और एक क्लिक में सीधे व्हाट्सएप (9644570828 पर) या डायरेक्ट ईमेल (mybooksxofficial@gmail.com पर) भेजने का विकल्प चुन सकते हैं।"
        }
      ]
    },
    footer: {
      tagline: "कस्टम सॉफ़्टवेयर डेवलपमेंट, वेब एप्लिकेशन और डिजिटल इंजीनियरिंग। आधुनिक व्यवसायों के लिए रॉयल लग्जरी क्राफ्ट्समैनशिप।",
      callUs: "फ़ोन / व्हाट्सएप: +91 9644570828",
      emailUs: "ईमेल: mybooksxofficial@gmail.com",
      address: "भारत • वैश्विक स्तर पर सेवाएं उपलब्ध",
      rights: "सर्वाधिकार सुरक्षित। MyBooksX सॉफ़्टवेयर डेवलपमेंट स्टूडियो।"
    }
  }
};
