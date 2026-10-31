import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../.d1/local.sqlite');

const db = new DatabaseSync(dbPath);

// 1. Ensure phone column exists
try {
  db.exec('ALTER TABLE users ADD COLUMN phone TEXT');
  console.log('Added phone column to users table');
} catch (e) {
  // column already exists
  console.log('Phone column already exists or checked:', e.message);
}

// 2. 20 Business Mathematics & Quantitative Reasoning Questions
const mathQuestions = [
  {
    id: 'qm_1',
    question: 'A merchant purchases enterprise inventory for ₹8,000 and sells it for ₹10,000. What is the profit percentage on cost?',
    category: 'Business Mathematics',
    difficulty: 'Easy',
    options: ['20%', '25%', '15%', '12.5%'],
    correctIndex: 1,
    explanation: 'Profit = ₹10,000 - ₹8,000 = ₹2,000. Profit % on cost = (2,000 / 8,000) × 100 = 25%.'
  },
  {
    id: 'qm_2',
    question: 'If a SaaS company invests ₹50,000 in a digital marketing campaign that generates ₹1,50,000 in gross profit, what is the Return on Investment (ROI)?',
    category: 'Business Mathematics',
    difficulty: 'Medium',
    options: ['150%', '200%', '300%', '250%'],
    correctIndex: 1,
    explanation: 'ROI = ((Gain - Cost) / Cost) × 100 = ((1,50,000 - 50,000) / 50,000) × 100 = 200%.'
  },
  {
    id: 'qm_3',
    question: 'A software license is listed at ₹10,000. The vendor offers a 20% promotional discount, followed by an 18% GST on the discounted price. What is the final invoice amount?',
    category: 'Business Mathematics',
    difficulty: 'Medium',
    options: ['₹9,440', '₹9,800', '₹8,900', '₹10,200'],
    correctIndex: 0,
    explanation: 'Discounted price = ₹10,000 - 20% = ₹8,000. GST 18% = ₹1,440. Final amount = ₹8,000 + ₹1,440 = ₹9,440.'
  },
  {
    id: 'qm_4',
    question: 'A company has fixed operating costs of ₹1,20,000 per month. Its product sells for ₹600 with a variable cost of ₹200 per unit. What is the monthly break-even volume?',
    category: 'Business Mathematics',
    difficulty: 'Medium',
    options: ['200 units', '250 units', '300 units', '400 units'],
    correctIndex: 2,
    explanation: 'Contribution margin per unit = ₹600 - ₹200 = ₹400. Break-even volume = ₹1,20,000 / ₹400 = 300 units.'
  },
  {
    id: 'qm_5',
    question: 'If ₹50,000 is invested in a corporate fixed deposit at 12% simple interest per annum, what is the total interest earned after 3 years?',
    category: 'Business Mathematics',
    difficulty: 'Easy',
    options: ['₹15,000', '₹18,000', '₹20,000', '₹16,500'],
    correctIndex: 1,
    explanation: 'Simple Interest = (P × R × T) / 100 = (50,000 × 12 × 3) / 100 = ₹18,000.'
  },
  {
    id: 'qm_6',
    question: 'An engineering firm has 6 developers who can build a custom CRM module in 20 days. How many days would 10 developers take to build the same module working at the same pace?',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    options: ['10 days', '12 days', '15 days', '14 days'],
    correctIndex: 1,
    explanation: 'Total effort = 6 developers × 20 days = 120 dev-days. Time with 10 developers = 120 / 10 = 12 days.'
  },
  {
    id: 'qm_7',
    question: 'A tech company has Current Assets of ₹3,00,000 and Current Liabilities of ₹1,20,000. What is its Current Ratio?',
    category: 'Financial Ratios',
    difficulty: 'Easy',
    options: ['2.0 : 1', '2.5 : 1', '3.0 : 1', '1.8 : 1'],
    correctIndex: 1,
    explanation: 'Current Ratio = Current Assets / Current Liabilities = ₹3,00,000 / ₹1,20,000 = 2.5 : 1.'
  },
  {
    id: 'qm_8',
    question: "A startup's annual recurring revenue (ARR) grew from ₹40,00,000 to ₹60,00,000 over 12 months. What is the Year-over-Year (YoY) revenue growth rate?",
    category: 'Business Mathematics',
    difficulty: 'Easy',
    options: ['33.3%', '40%', '50%', '60%'],
    correctIndex: 2,
    explanation: 'YoY Growth = ((₹60,00,000 - ₹40,00,000) / ₹40,00,000) × 100 = 50%.'
  },
  {
    id: 'qm_9',
    question: 'If a retailer desires a 25% profit margin on the Selling Price of an item that costs ₹750 to produce, what must the selling price be?',
    category: 'Business Mathematics',
    difficulty: 'Hard',
    options: ['₹937.50', '₹1,000', '₹950', '₹1,050'],
    correctIndex: 1,
    explanation: 'Selling Price = Cost / (1 - Margin) = ₹750 / (1 - 0.25) = ₹750 / 0.75 = ₹1,000.'
  },
  {
    id: 'qm_10',
    question: 'A B2B SaaS startup spent ₹2,40,000 on digital acquisition channels last month and successfully acquired 60 paying clients. What is their Customer Acquisition Cost (CAC)?',
    category: 'Business Mathematics',
    difficulty: 'Easy',
    options: ['₹3,500', '₹4,000', '₹4,500', '₹5,000'],
    correctIndex: 1,
    explanation: 'CAC = Total Acquisition Spend / New Clients = ₹2,40,000 / 60 = ₹4,000 per customer.'
  },
  {
    id: 'qm_11',
    question: 'A corporate reserve of ₹2,00,000 is compounded annually at 10% interest. What will be the total compounded amount at the end of 2 years?',
    category: 'Business Mathematics',
    difficulty: 'Medium',
    options: ['₹2,40,000', '₹2,42,000', '₹2,44,000', '₹2,20,000'],
    correctIndex: 1,
    explanation: 'A = P(1 + r)^t = 2,00,000 × (1.10)^2 = 2,00,000 × 1.21 = ₹2,42,000.'
  },
  {
    id: 'qm_12',
    question: 'A company has Total Revenue of ₹5,00,000, Cost of Goods Sold (COGS) of ₹2,00,000, and Operating Expenses of ₹1,50,000. What is its Operating Profit Margin?',
    category: 'Business Mathematics',
    difficulty: 'Medium',
    options: ['25%', '30%', '35%', '40%'],
    correctIndex: 1,
    explanation: 'Operating Profit = ₹5,00,000 - ₹2,00,000 - ₹1,50,000 = ₹1,50,000. Margin = (1,50,000 / 5,00,000) × 100 = 30%.'
  },
  {
    id: 'qm_13',
    question: 'An enterprise server valued at ₹1,50,000 depreciates by 20% in the first year and 10% on the remaining value in the second year. What is its book value after 2 years?',
    category: 'Business Mathematics',
    difficulty: 'Hard',
    options: ['₹1,05,000', '₹1,08,000', '₹1,10,000', '₹1,12,000'],
    correctIndex: 1,
    explanation: 'After Year 1: ₹1,50,000 - 20% = ₹1,20,000. Year 2 depreciation: 10% of 1,20,000 = ₹12,000. Final book value = ₹1,08,000.'
  },
  {
    id: 'qm_14',
    question: 'If an e-commerce platform processes 12,000 monthly transactions with an average order value (AOV) of ₹850, what is its Gross Merchandise Value (GMV) for the month?',
    category: 'Business Mathematics',
    difficulty: 'Easy',
    options: ['₹98,00,000', '₹1,02,00,000 (1.02 Cr)', '₹1,10,00,000', '₹1,20,00,000'],
    correctIndex: 1,
    explanation: 'GMV = Total Orders × AOV = 12,000 × ₹850 = ₹1,02,00,000 (₹1.02 Crore).'
  },
  {
    id: 'qm_15',
    question: 'A SaaS product has 2,000 active subscribers at the start of the quarter. During the quarter, 100 subscribers churn. What is the quarterly churn rate?',
    category: 'SaaS & Metrics',
    difficulty: 'Easy',
    options: ['4%', '5%', '6%', '2.5%'],
    correctIndex: 1,
    explanation: 'Churn Rate = (Churned Customers / Total Starting Customers) × 100 = (100 / 2,000) × 100 = 5%.'
  },
  {
    id: 'qm_16',
    question: 'A business receives two successive trade discounts of 10% and 20% on bulk hardware purchases. What is the single equivalent overall discount percentage?',
    category: 'Business Mathematics',
    difficulty: 'Medium',
    options: ['30%', '28%', '25%', '26%'],
    correctIndex: 1,
    explanation: 'Net price = 100 × (1 - 0.10) × (1 - 0.20) = 100 × 0.90 × 0.80 = 72%. Effective discount = 100% - 72% = 28%.'
  },
  {
    id: 'qm_17',
    question: "If a firm's average inventory is ₹2,00,000 and its annual Cost of Goods Sold (COGS) is ₹12,00,000, what is its Inventory Turnover Ratio?",
    category: 'Financial Ratios',
    difficulty: 'Medium',
    options: ['4 times', '5 times', '6 times', '8 times'],
    correctIndex: 2,
    explanation: 'Inventory Turnover Ratio = Cost of Goods Sold / Average Inventory = ₹12,00,000 / ₹2,00,000 = 6 times.'
  },
  {
    id: 'qm_18',
    question: 'If the ratio of equity to debt in a corporate financing structure is 3 : 2 and total capital is ₹50,00,000, what is the total equity portion?',
    category: 'Corporate Finance',
    difficulty: 'Easy',
    options: ['₹25,00,000', '₹30,00,000', '₹35,00,000', '₹20,00,000'],
    correctIndex: 1,
    explanation: 'Total parts = 3 + 2 = 5. Equity portion = (3 / 5) × ₹50,00,000 = ₹30,00,000.'
  },
  {
    id: 'qm_19',
    question: 'A startup has ₹36,00,000 in bank cash reserves and an average monthly burn rate of ₹4,50,000. How many months of financial runway does the startup have?',
    category: 'Startups',
    difficulty: 'Easy',
    options: ['6 months', '7 months', '8 months', '9 months'],
    correctIndex: 2,
    explanation: 'Runway = Available Cash / Monthly Burn Rate = ₹36,00,000 / ₹4,50,000 = 8 months.'
  },
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

const now = new Date().toISOString();
const stmt = db.prepare(`
  INSERT OR REPLACE INTO questions (id, question, category, difficulty, options_json, correct_index, explanation, is_active, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
`);

for (const q of mathQuestions) {
  stmt.run(q.id, q.question, q.category, q.difficulty, JSON.stringify(q.options), q.correctIndex, q.explanation, now, now);
}

console.log('✅ Successfully inserted 20 mathematical questions.');
console.log('Total questions in DB:', db.prepare('SELECT count(*) as c FROM questions').get());
console.log('Math questions in DB:', db.prepare("SELECT count(*) as c FROM questions WHERE id LIKE 'qm_%'").get());
