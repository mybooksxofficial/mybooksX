export interface GrowthPlan {
  id: string;
  name: string;
  nameHi: string;
  price: string;
  billing: string;
  billingHi: string;
  platformsOrCampaigns: string;
  platformsOrCampaignsHi: string;
  features: string[];
  featuresHi: string[];
  deliverablesNote: string;
  deliverablesNoteHi: string;
}

export interface GrowthService {
  id: 'social-media' | 'email-marketing';
  categoryLabel: string;
  categoryLabelHi: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  startingPrice: string;
  startingPriceHi: string;
  platformsSupported: string;
  plans: GrowthPlan[];
  previewDetails: {
    badge: string;
    headline: string;
    sampleMetrics: { label: string; value: string }[];
    disclaimer: string;
  };
}

export const DIGITAL_GROWTH_SERVICES: GrowthService[] = [
  {
    id: 'social-media',
    categoryLabel: 'MULTI-PLATFORM GROWTH',
    categoryLabelHi: 'मल्टी-प्लेटफ़ॉर्म ग्रोथ',
    title: 'Social Media Management',
    titleHi: 'सोशल मीडिया मैनेजमेंट',
    description: 'Build a consistent online presence with professionally planned content, engaging creatives, and organized publishing across your social media channels.',
    descriptionHi: 'पेशेवर तरीक़े से नियोजित कंटेंट, आकर्षक क्रिएटिव्स और नियमित पोस्टिंग के साथ अपने सोशल मीडिया हैंडल्स पर एक भरोसेमंद ऑनलाइन ब्रांड उपस्थिति बनाएं।',
    startingPrice: 'Starting at ₹12,000/mo',
    startingPriceHi: 'शुरुआत ₹12,000/माह से',
    platformsSupported: 'Instagram, Facebook, LinkedIn & supported channels',
    plans: [
      {
        id: 'smm-starter',
        name: 'Starter Package',
        nameHi: 'स्टार्टर पैकेज',
        price: '₹12,000/month',
        billing: 'Billed monthly • Proposed indicative package',
        billingHi: 'मासिक शुल्क • कस्टमाइज़ किया जा सकने वाला पैकेज',
        platformsOrCampaigns: '1 Selected Platform (e.g. Instagram or LinkedIn)',
        platformsOrCampaignsHi: '1 चयनित प्लेटफ़ॉर्म (जैसे इंस्टाग्राम या लिंक्डइन)',
        features: [
          'Up to 8 high-resolution creative posts per month',
          'Basic monthly content calendar & strategy',
          'Professional caption writing & targeted hashtags',
          'Content scheduling and automated publishing',
          'Monthly performance summary report'
        ],
        featuresHi: [
          'प्रति माह 8 उच्च गुणवत्ता वाले क्रिएटिव पोस्ट',
          'मासिक कंटेंट कैलेंडर और रूपरेखा',
          'पेशेवर कैप्शन राइटिंग व लक्षित हैशटैग्स',
          'शेड्यूलिंग व समय पर ऑटोमेटेड पब्लिशिंग',
          'मासिक परफॉरमेंस समरी रिपोर्ट'
        ],
        deliverablesNote: 'Excludes ad-spend budgets and dedicated video shooting. Can be customized on discovery.',
        deliverablesNoteHi: 'विज्ञापन बजट और ऑन-साइट वीडियो शूटिंग अलग से देय हैं।'
      },
      {
        id: 'smm-growth',
        name: 'Growth Package',
        nameHi: 'ग्रोथ पैकेज',
        price: '₹22,000/month',
        billing: 'Billed monthly • Most popular for growing SMBs',
        billingHi: 'मासिक शुल्क • बढ़ते व्यवसायों के लिए सबसे लोकप्रिय',
        platformsOrCampaigns: 'Up to 3 Selected Platforms (e.g. IG, FB, LinkedIn)',
        platformsOrCampaignsHi: '3 चयनित प्लेटफ़ॉर्म (इंस्टाग्राम, फेसबुक, लिंक्डइन)',
        features: [
          'Up to 12 bespoke creative posts per month',
          'Comprehensive content calendar & publishing queue',
          'Custom brand visual identity & caption copywriting',
          'Basic comment & inbound direct message monitoring',
          'Bi-weekly content review and monthly performance report'
        ],
        featuresHi: [
          'प्रति माह 12 कस्टमाइज़्ड क्रिएटिव पोस्ट्स',
          'विस्तृत मासिक कंटेंट कैलेंडर और कतार',
          'ब्रांड स्टाइल गाइड अनुसार विज़ुअल्स और कॉपीराइटिंग',
          'कमेंट्स और इनबाउंड मैसेजेस की सामान्य मॉनिटरिंग',
          'मासिक विस्तृत परफॉरमेंस और एनालिटिक्स रिपोर्ट'
        ],
        deliverablesNote: 'Reels editing and paid Meta ads campaign management available as add-on.',
        deliverablesNoteHi: 'रील्स एडिटिंग व पेड विज्ञापनों का प्रबंधन अतिरिक्त विकल्प के रूप में उपलब्ध है।'
      },
      {
        id: 'smm-premium',
        name: 'Premium Enterprise',
        nameHi: 'प्रीमियम एंटरप्राइज',
        price: '₹35,000/month',
        billing: 'Billed monthly • Complete brand stewardship',
        billingHi: 'मासिक शुल्क • संपूर्ण सोशल मीडिया रणनीति',
        platformsOrCampaigns: 'Up to 4 Selected Platforms',
        platformsOrCampaignsHi: '4 चयनित प्लेटफ़ॉर्म्स',
        features: [
          'Up to 16 premium creative posts per month',
          'Advanced multi-channel content roadmap & strategy review',
          'Story assets, carousel breakdowns, and graphic design',
          'Organized publishing, comment monitoring & triage',
          'In-depth monthly analytics & executive strategy call'
        ],
        featuresHi: [
          'प्रति माह 16 प्रीमियम क्रिएटिव पोस्ट्स और स्टोरीज़',
          'एडवांस्ड मल्टी-चैनल कंटेंट रोडमैप और स्ट्रैटेजी रिव्यू',
          'कैरोज़ल डिज़ाइन, इन्फ़ोग्राफ़िक्स और कॉपीराइटिंग',
          'मैसेज मॉनिटरिंग और लीड ट्राइएज',
          'मासिक विस्तृत एनालिटिक्स व स्ट्रैटेजी समीक्षा कॉल'
        ],
        deliverablesNote: 'Third-party tools and direct advertisement ad-spend budgets remain external.',
        deliverablesNoteHi: 'विज्ञापन बजट व तृतीय-पक्ष सॉफ़्टवेयर टूल्स के शुल्क शामिल नहीं हैं।'
      }
    ],
    previewDetails: {
      badge: 'CONTENT CALENDAR QUEUE',
      headline: 'Multi-Channel Calendar & Creative Scheduling',
      sampleMetrics: [
        { label: 'Monthly Creative Queue', value: '12 Posts' },
        { label: 'Scheduled Channels', value: '3 Networks' },
        { label: 'Publishing Cadence', value: '3x / Week' }
      ],
      disclaimer: 'Illustrative content workflow mockup. Results vary based on audience and engagement.'
    }
  },
  {
    id: 'email-marketing',
    categoryLabel: 'AUDIENCE RETENTION & AUTOMATION',
    categoryLabelHi: 'ऑडियंस रिटेंशन व ऑटोमेशन',
    title: 'Email Marketing & Campaigns',
    titleHi: 'ईमेल मार्केटिंग व कैंपेन मैनेजमेंट',
    description: 'Help your business stay connected with its audience through thoughtfully designed newsletters, promotional campaigns, automated email sequences, and customer retention communication.',
    descriptionHi: 'आकर्षक न्यूज़लेटर्स, प्रमोशनल कैंपेन्स और ऑटोमेटेड वेलकम सीक्वेंसेस के ज़रिए अपने ग्राहकों से निरंतर जुड़े रहें और बार-बार ऑर्डर प्राप्त करें।',
    startingPrice: 'Starting at ₹8,000/mo',
    startingPriceHi: 'शुरुआत ₹8,000/माह से',
    platformsSupported: 'Mailchimp, Brevo, AWS SES or client-preferred tool',
    plans: [
      {
        id: 'email-starter',
        name: 'Starter Campaigns',
        nameHi: 'स्टार्टर कैंपेन्स',
        price: '₹8,000/month',
        billing: 'Billed monthly • Suitable for emerging brands',
        billingHi: 'मासिक शुल्क • शुरुआती व्यवसायों के लिए उपयुक्त',
        platformsOrCampaigns: 'Up to 2 Targeted Campaigns per month',
        platformsOrCampaignsHi: 'प्रति माह 2 लक्षित ईमेल कैंपेन',
        features: [
          'Clean, responsive mobile-friendly newsletter template design',
          'Compelling subject lines & conversion copywriting',
          'Basic subscriber list hygiene & bounce tracking',
          'Campaign dispatch scheduling & test inbox audits',
          'Monthly campaign performance report (deliverability summary)'
        ],
        featuresHi: [
          'मोबाइल-फ्रेंडली रिस्पॉन्सिव न्यूज़लेटर टेम्पलेट डिज़ाइन',
          'प्रभावशाली सब्जेक्ट लाइन्स व कॉपीराइटिंग',
          'सब्सक्राइबर लिस्ट का बुनियादी प्रबंधन',
          'कैंपेन शेड्यूलिंग व इनबॉक्स डिलीवरी टेस्ट',
          'मासिक परफॉरमेंस समरी रिपोर्ट'
        ],
        deliverablesNote: 'Third-party ESP subscription (Mailchimp/Brevo plan) managed by client.',
        deliverablesNoteHi: 'ईमेल सेवा प्रदाता (ESP) का सब्सक्रिप्शन क्लाइंट द्वारा देय होता है।'
      },
      {
        id: 'email-growth',
        name: 'Growth & Automation',
        nameHi: 'ग्रोथ व ऑटोमेशन',
        price: '₹15,000/month',
        billing: 'Billed monthly • Lead nurturing & customer retention',
        billingHi: 'मासिक शुल्क • लीड नर्चरिंग व ग्राहक रिटेंशन',
        platformsOrCampaigns: 'Up to 4 Campaigns/Month + Automated Flow',
        platformsOrCampaignsHi: '4 कैंपेन/माह + ऑटोमेटेड फ्लो',
        features: [
          'Up to 4 custom promotional & update campaigns per month',
          'Audience segmentation (VIP buyers, inquiries, active users)',
          '1 automated welcome or onboarding email sequence setup',
          'A/B subject line testing for maximum deliverability',
          'Monthly analytics report with open & click engagement trends'
        ],
        featuresHi: [
          'प्रति माह 4 कस्टमाइज़्ड प्रमोशनल व अपडेट कैंपेन्स',
          'ऑडियंस सेग्मेंटेशन (ग्राहक, नए लीड्स, वफ़ादार खरीदार)',
          '1 ऑटोमेटेड वेलकम या ऑनबोर्डिंग ईमेल सीक्वेंस',
          'सब्जेक्ट लाइन A/B टेस्टिंग',
          'मासिक एनालिटिक्स और एंगेजमेंट रिपोर्ट'
        ],
        deliverablesNote: 'ESP platform subscription fees remain separate unless bundled.',
        deliverablesNoteHi: 'ESP प्लेटफ़ॉर्म शुल्क अनुबंध के अनुसार अलग रहते हैं।'
      },
      {
        id: 'email-premium',
        name: 'Full Lifecycle Marketing',
        nameHi: 'फ़ुल लाइफ़साइकल मार्केटिंग',
        price: '₹25,000/month',
        billing: 'Billed monthly • Complete retention engine',
        billingHi: 'मासिक शुल्क • संपूर्ण रिटेंशन इंजन',
        platformsOrCampaigns: 'Up to 8 Campaigns/Month + Multi-Step Drips',
        platformsOrCampaignsHi: '8 कैंपेन/माह + मल्टी-स्टेप ड्रिप सीक्वेंसेस',
        features: [
          'Up to 8 bespoke strategic email campaigns per month',
          'Advanced customer lifecycle segmentation & tag hygiene',
          'Setup of automated nurture drips & re-engagement sequences',
          'Continuous template optimization and deliverability audits',
          'Detailed monthly performance and conversion attribution review'
        ],
        featuresHi: [
          'प्रति माह 8 रणनीतिक ईमेल कैंपेन्स',
          'उन्नत ग्राहक लाइफ़साइकल सेग्मेंटेशन',
          'री-एंगेजमेंट और ड्रिप ऑटोमेशन सेटअप',
          'टेम्पलेट ऑप्टिमाइज़ेशन और स्पैम फ़िल्टर ऑडिट',
          'विस्तृत मासिक परफॉरमेंस समीक्षा'
        ],
        deliverablesNote: 'Does not guarantee exact open/conversion rates; focused on best deliverability practices.',
        deliverablesNoteHi: 'ओपन रेट्स या बिक्री की गारंटी नहीं दी जाती; श्रेष्ठ डिलीवरी मानकों पर काम होता है।'
      }
    ],
    previewDetails: {
      badge: 'CAMPAIGN PERFORMANCE AUDIT',
      headline: 'Segmented Newsletters & Lifecycle Drip Engine',
      sampleMetrics: [
        { label: 'Campaign Frequency', value: '4 Dispatches/Mo' },
        { label: 'Audience Segment', value: 'Active Customers' },
        { label: 'Delivery Integrity', value: 'SPF / DKIM Tested' }
      ],
      disclaimer: 'Illustrative dashboard representation. ESP platform fees are separate.'
    }
  }
];
