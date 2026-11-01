/**
 * 20 Mathematical & Business Quantitative Reasoning Questions
 * 15-Minute Quest Arena (qm_1 to qm_20)
 * Formatted with balanced distribution across options:
 * Exactly 5 A's, 5 B's, 5 C's, and 5 D's.
 */

export interface MathQuestQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const MATH_QUEST_QUESTIONS: MathQuestQuestion[] = [
  // 1. Correct: C (Index 2)
  {
    id: 'qm_1',
    question: 'A merchant purchases enterprise inventory for ₹8,000 and sells it for ₹10,000. What is the profit percentage on cost?',
    category: 'Business Mathematics',
    difficulty: 'Easy',
    options: ['15%', '20%', '25%', '30%'],
    correctIndex: 2,
    explanation: 'Profit = ₹10,000 - ₹8,000 = ₹2,000. Profit % on cost = (2,000 / 8,000) × 100 = 25%.'
  },
  // 2. Correct: A (Index 0)
  {
    id: 'qm_2',
    question: 'If a SaaS company invests ₹50,000 in a digital marketing campaign that generates ₹1,50,000 in gross profit, what is the Return on Investment (ROI)?',
    category: 'Business Mathematics',
    difficulty: 'Medium',
    options: ['200%', '150%', '300%', '250%'],
    correctIndex: 0,
    explanation: 'ROI = ((Gain - Cost) / Cost) × 100 = ((1,50,000 - 50,000) / 50,000) × 100 = 200%.'
  },
  // 3. Correct: D (Index 3)
  {
    id: 'qm_3',
    question: 'A software license is listed at ₹10,000. The vendor offers a 20% promotional discount, followed by an 18% GST on the discounted price. What is the final invoice amount?',
    category: 'Business Mathematics',
    difficulty: 'Medium',
    options: ['₹8,900', '₹9,800', '₹10,200', '₹9,440'],
    correctIndex: 3,
    explanation: 'Discounted price = ₹10,000 - 20% = ₹8,000. GST 18% = ₹1,440. Final amount = ₹8,000 + ₹1,440 = ₹9,440.'
  },
  // 4. Correct: B (Index 1)
  {
    id: 'qm_4',
    question: 'A company has fixed operating costs of ₹1,20,000 per month. Its product sells for ₹600 with a variable cost of ₹200 per unit. What is the monthly break-even volume?',
    category: 'Business Mathematics',
    difficulty: 'Medium',
    options: ['250 units', '300 units', '350 units', '400 units'],
    correctIndex: 1,
    explanation: 'Contribution margin per unit = ₹600 - ₹200 = ₹400. Break-even volume = ₹1,20,000 / ₹400 = 300 units.'
  },
  // 5. Correct: C (Index 2)
  {
    id: 'qm_5',
    question: 'If ₹50,000 is invested in a corporate fixed deposit at 12% simple interest per annum, what is the total interest earned after 3 years?',
    category: 'Business Mathematics',
    difficulty: 'Easy',
    options: ['₹15,000', '₹16,500', '₹18,000', '₹20,000'],
    correctIndex: 2,
    explanation: 'Simple Interest = (P × R × T) / 100 = (50,000 × 12 × 3) / 100 = ₹18,000.'
  },
  // 6. Correct: A (Index 0)
  {
    id: 'qm_6',
    question: 'An engineering firm has 6 developers who can build a custom CRM module in 20 days. How many days would 10 developers take to build the same module working at the same pace?',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    options: ['12 days', '10 days', '15 days', '14 days'],
    correctIndex: 0,
    explanation: 'Total effort = 6 developers × 20 days = 120 dev-days. Time with 10 developers = 120 / 10 = 12 days.'
  },
  // 7. Correct: D (Index 3)
  {
    id: 'qm_7',
    question: 'A tech company has Current Assets of ₹3,00,000 and Current Liabilities of ₹1,20,000. What is its Current Ratio?',
    category: 'Financial Ratios',
    difficulty: 'Easy',
    options: ['1.8 : 1', '2.0 : 1', '3.0 : 1', '2.5 : 1'],
    correctIndex: 3,
    explanation: 'Current Ratio = Current Assets / Current Liabilities = ₹3,00,000 / ₹1,20,000 = 2.5 : 1.'
  },
  // 8. Correct: B (Index 1)
  {
    id: 'qm_8',
    question: 'A startup\'s annual recurring revenue (ARR) grew from ₹40,00,000 to ₹60,00,000 over 12 months. What is the Year-over-Year (YoY) revenue growth rate?',
    category: 'Business Mathematics',
    difficulty: 'Easy',
    options: ['40%', '50%', '33.3%', '60%'],
    correctIndex: 1,
    explanation: 'YoY Growth = ((₹60,00,000 - ₹40,00,000) / ₹40,00,000) × 100 = 50%.'
  },
  // 9. Correct: C (Index 2)
  {
    id: 'qm_9',
    question: 'If a retailer desires a 25% profit margin on the Selling Price of an item that costs ₹750 to produce, what must the selling price be?',
    category: 'Business Mathematics',
    difficulty: 'Hard',
    options: ['₹937.50', '₹950', '₹1,000', '₹1,050'],
    correctIndex: 2,
    explanation: 'Selling Price = Cost / (1 - Margin) = ₹750 / (1 - 0.25) = ₹750 / 0.75 = ₹1,000.'
  },
  // 10. Correct: A (Index 0)
  {
    id: 'qm_10',
    question: 'A B2B SaaS startup spent ₹2,40,000 on digital acquisition channels last month and successfully acquired 60 paying clients. What is their Customer Acquisition Cost (CAC)?',
    category: 'Business Mathematics',
    difficulty: 'Easy',
    options: ['₹4,000', '₹3,500', '₹4,500', '₹5,000'],
    correctIndex: 0,
    explanation: 'CAC = Total Acquisition Spend / New Clients = ₹2,40,000 / 60 = ₹4,000 per customer.'
  },
  // 11. Correct: D (Index 3)
  {
    id: 'qm_11',
    question: 'A corporate reserve of ₹2,00,000 is compounded annually at 10% interest. What will be the total compounded amount at the end of 2 years?',
    category: 'Business Mathematics',
    difficulty: 'Medium',
    options: ['₹2,20,000', '₹2,40,000', '₹2,44,000', '₹2,42,000'],
    correctIndex: 3,
    explanation: 'A = P(1 + r)^t = 2,00,000 × (1.10)^2 = 2,00,000 × 1.21 = ₹2,42,000.'
  },
  // 12. Correct: B (Index 1)
  {
    id: 'qm_12',
    question: 'A company has Total Revenue of ₹5,00,000, Cost of Goods Sold (COGS) of ₹2,00,000, and Operating Expenses of ₹1,50,000. What is its Operating Profit Margin?',
    category: 'Business Mathematics',
    difficulty: 'Medium',
    options: ['25%', '30%', '35%', '40%'],
    correctIndex: 1,
    explanation: 'Operating Profit = ₹5,00,000 - ₹2,00,000 - ₹1,50,000 = ₹1,50,000. Margin = (1,50,000 / 5,00,000) × 100 = 30%.'
  },
  // 13. Correct: C (Index 2)
  {
    id: 'qm_13',
    question: 'An enterprise server valued at ₹1,50,000 depreciates by 20% in the first year and 10% on the remaining value in the second year. What is its book value after 2 years?',
    category: 'Business Mathematics',
    difficulty: 'Hard',
    options: ['₹1,05,000', '₹1,10,000', '₹1,08,000', '₹1,12,000'],
    correctIndex: 2,
    explanation: 'After Year 1: ₹1,50,000 - 20% = ₹1,20,000. Year 2 depreciation: 10% of 1,20,000 = ₹12,000. Final book value = ₹1,08,000.'
  },
  // 14. Correct: A (Index 0)
  {
    id: 'qm_14',
    question: 'If an e-commerce platform processes 12,000 monthly transactions with an average order value (AOV) of ₹850, what is its Gross Merchandise Value (GMV) for the month?',
    category: 'Business Mathematics',
    difficulty: 'Easy',
    options: ['₹1,02,00,000 (₹1.02 Cr)', '₹98,00,000', '₹1,10,00,000', '₹1,20,00,000'],
    correctIndex: 0,
    explanation: 'GMV = Total Orders × AOV = 12,000 × ₹850 = ₹1,02,00,000 (₹1.02 Crore).'
  },
  // 15. Correct: D (Index 3)
  {
    id: 'qm_15',
    question: 'A SaaS product has 2,000 active subscribers at the start of the quarter. During the quarter, 100 subscribers churn. What is the quarterly churn rate?',
    category: 'SaaS & Metrics',
    difficulty: 'Easy',
    options: ['2.5%', '4%', '6%', '5%'],
    correctIndex: 3,
    explanation: 'Churn Rate = (Churned Customers / Total Starting Customers) × 100 = (100 / 2,000) × 100 = 5%.'
  },
  // 16. Correct: B (Index 1)
  {
    id: 'qm_16',
    question: 'A business receives two successive trade discounts of 10% and 20% on bulk hardware purchases. What is the single equivalent overall discount percentage?',
    category: 'Business Mathematics',
    difficulty: 'Medium',
    options: ['30%', '28%', '25%', '26%'],
    correctIndex: 1,
    explanation: 'Net price = 100 × (1 - 0.10) × (1 - 0.20) = 100 × 0.90 × 0.80 = 72%. Effective discount = 100% - 72% = 28%.'
  },
  // 17. Correct: C (Index 2)
  {
    id: 'qm_17',
    question: 'If a firm\'s average inventory is ₹2,00,000 and its annual Cost of Goods Sold (COGS) is ₹12,00,000, what is its Inventory Turnover Ratio?',
    category: 'Financial Ratios',
    difficulty: 'Medium',
    options: ['4 times', '5 times', '6 times', '8 times'],
    correctIndex: 2,
    explanation: 'Inventory Turnover Ratio = Cost of Goods Sold / Average Inventory = ₹12,00,000 / ₹2,00,000 = 6 times.'
  },
  // 18. Correct: A (Index 0)
  {
    id: 'qm_18',
    question: 'If the ratio of equity to debt in a corporate financing structure is 3 : 2 and total capital is ₹50,00,000, what is the total equity portion?',
    category: 'Corporate Finance',
    difficulty: 'Easy',
    options: ['₹30,00,000', '₹25,00,000', '₹35,00,000', '₹20,00,000'],
    correctIndex: 0,
    explanation: 'Total parts = 3 + 2 = 5. Equity portion = (3 / 5) × ₹50,00,000 = ₹30,00,000.'
  },
  // 19. Correct: D (Index 3)
  {
    id: 'qm_19',
    question: 'A startup has ₹36,00,000 in bank cash reserves and an average monthly burn rate of ₹4,50,000. How many months of financial runway does the startup have?',
    category: 'Startups',
    difficulty: 'Easy',
    options: ['6 months', '7 months', '9 months', '8 months'],
    correctIndex: 3,
    explanation: 'Runway = Available Cash / Monthly Burn Rate = ₹36,00,000 / ₹4,50,000 = 8 months.'
  },
  // 20. Correct: B (Index 1)
  {
    id: 'qm_20',
    question: 'If an automated cloud ledger server audits 450 invoice batches in 15 minutes, how many batches will it audit in 1 hour at the same processing rate?',
    category: 'Quantitative Aptitude',
    difficulty: 'Easy',
    options: ['1,500', '1,800', '2,000', '2,250'],
    correctIndex: 1,
    explanation: '1 hour = 60 minutes = 4 × 15 minutes. Batches processed = 450 × 4 = 1,800 batches.'
  }
];
