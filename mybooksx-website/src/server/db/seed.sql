-- Seed Data for MyBooksX Rewards, Initial Questions, and Admin Configuration

-- 1. Official MyBooksX Rewards Catalog (5 Flagship Applications)
INSERT OR IGNORE INTO rewards (id, code, title, description, points_cost, duration_days, is_active, icon_name, created_at)
VALUES 
  ('rew-doctracker', 'DOCTRACKER', 'DocTracker', 'High-speed document indexing, OCR search engine & version controller for digital workflows.', 1000, 30, 1, 'FileText', '2026-10-31T00:00:00.000Z'),
  ('rew-tripx', 'TRIP_X', 'Trip-X', 'Enterprise corporate travel, mileage tracking, route logistics & per-diem management suite.', 2000, 30, 1, 'Compass', '2026-10-31T00:00:00.000Z'),
  ('rew-trackerx', 'TRACKER_X', 'Tracker-X', 'Real-time equipment asset tracking, warranty alerts, depreciation calculator & audit log.', 3000, 30, 1, 'Layers', '2026-10-31T00:00:00.000Z'),
  ('rew-expensex', 'EXPENSE_X', 'Expense-X', 'Automated GST-compliant corporate expense verification, receipt matching & payout system.', 5000, 30, 1, 'Receipt', '2026-10-31T00:00:00.000Z'),
  ('rew-bundle', 'PREMIUM_BUNDLE', 'MyBooksX Premium Bundle', 'Complete Suite: Full 30-day access to DocTracker, Trip-X, Tracker-X and Expense-X combined.', 10000, 30, 1, 'Crown', '2026-10-31T00:00:00.000Z');

-- 2. 20 Business-Related Questions: 7 Easy, 8 Medium, 5 Hard
-- Easy 1 (Correct: 0)
INSERT OR REPLACE INTO questions (id, question, category, difficulty, options_json, correct_index, explanation, is_active, created_at, updated_at)
VALUES
  ('qb_e1', 'In business and corporate finance, what does "ROI" stand for?', 'Finance', 'Easy',
   '["Return on Investment", "Rate of Inflation", "Risk of Insolvency", "Revenue on Inventory"]',
   0, 'ROI stands for Return on Investment, measuring the profitability of an investment relative to its cost.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Easy 2 (Correct: 1)
  ('qb_e2', 'Which financial statement shows a company''s assets, liabilities, and shareholders'' equity at a specific point in time?', 'Accounting', 'Easy',
   '["Income Statement", "Balance Sheet", "Cash Flow Statement", "Auditor Report"]',
   1, 'The Balance Sheet provides a snapshot of a company''s financial position at a single point in time.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Easy 3 (Correct: 2)
  ('qb_e3', 'What is the term for the revenue remaining after deducting all operating expenses, interest, and taxes?', 'Finance', 'Easy',
   '["Gross Revenue", "Operating Budget", "Net Profit", "Accounts Receivable"]',
   2, 'Net Profit (or the bottom line) is the actual profit after all expenses, interest, and taxes are subtracted.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Easy 4 (Correct: 3)
  ('qb_e4', 'In modern cloud computing and digital business models, what does "SaaS" stand for?', 'Digital Business', 'Easy',
   '["System and Analytics Solution", "Server Automated Architecture Service", "Security and Access System", "Software as a Service"]',
   3, 'SaaS stands for Software as a Service, delivering software applications over the internet on a subscription basis.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Easy 5 (Correct: 0)
  ('qb_e5', 'In digital marketing and website growth, what does "SEO" stand for?', 'Marketing', 'Easy',
   '["Search Engine Optimization", "Social Engagement Operation", "Sales Execution Online", "Strategic Enterprise Output"]',
   0, 'SEO stands for Search Engine Optimization, optimizing websites to rank higher in organic search results.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Easy 6 (Correct: 1)
  ('qb_e6', 'In the startup ecosystem, what is a privately held startup valued at $1 billion or more commonly called?', 'Entrepreneurship', 'Easy',
   '["Centaur", "Unicorn", "Blue Chip", "Pacesetter"]',
   1, 'A Unicorn is a privately held startup company valued at over $1 billion.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Easy 7 (Correct: 2)
  ('qb_e7', 'Which department in a corporation is primarily responsible for talent recruitment, onboarding, and employee benefits?', 'Management', 'Easy',
   '["Public Relations (PR)", "Research & Development (R&D)", "Human Resources (HR)", "Business Development (BD)"]',
   2, 'Human Resources (HR) oversees talent acquisition, personnel management, compensation, and workplace culture.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Medium 1 (Correct: 3)
  ('qb_m1', 'In financial analysis and corporate reporting, what does "EBITDA" measure?', 'Finance', 'Medium',
   '["Net cash available exclusively for debt liquidation", "Total market capitalization minus liabilities", "Gross product value before employee payroll deductions", "Operating profitability before non-operating expenses and non-cash charges"]',
   3, 'EBITDA measures core operating profitability before interest, taxes, depreciation, and amortization.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Medium 2 (Correct: 0)
  ('qb_m2', 'In venture-backed startups, what does the term "Burn Rate" specify?', 'Startups', 'Medium',
   '["The rate at which a company spends its cash balance before generating positive cash flow", "The quarterly departure rate of sales staff", "The average discount percentage given to enterprise customers", "The rate of hardware depreciation per fiscal year"]',
   0, 'Burn Rate is the speed at which a new company uses up its venture capital before reaching cash-flow positivity.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Medium 3 (Correct: 1)
  ('qb_m3', 'In customer growth analytics, what does "CAC" represent?', 'Marketing', 'Medium',
   '["Client Accounting Charge for bookkeeping", "Customer Acquisition Cost (total sales/marketing spend divided by new customers)", "Continuous Account Cost for server infrastructure", "Customer Annuity Credit in customer rewards"]',
   1, 'CAC (Customer Acquisition Cost) measures total sales and marketing expenses divided by customers won.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Medium 4 (Correct: 2)
  ('qb_m4', 'In pricing economics, what does high "Price Elasticity of Demand" mean for a product?', 'Economics', 'Medium',
   '["Demand remains identical regardless of substantial price increases", "The product cannot legally be discounted below manufacturing cost", "A small percentage change in price leads to a significant percentage change in quantity demanded", "Suppliers can scale production infinitely without cost changes"]',
   2, 'High elasticity means consumers are sensitive to price variations, causing demand to shift sharply when prices change.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Medium 5 (Correct: 3)
  ('qb_m5', 'In strategic management, what are the four essential pillars evaluated in a "SWOT" analysis?', 'Strategy', 'Medium',
   '["Sales, Workforce, Operations, Technology", "Strategy, Wealth, Objectives, Timeline", "Security, Warranty, Organization, Testing", "Strengths, Weaknesses, Opportunities, Threats"]',
   3, 'SWOT analysis evaluates internal Strengths and Weaknesses along with external Opportunities and Threats.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Medium 6 (Correct: 0)
  ('qb_m6', 'In financial management, what does "Liquidity" describe regarding an enterprise asset?', 'Finance', 'Medium',
   '["How rapidly an asset can be converted into cash without substantial loss of market value", "The ratio of fixed physical equipment to intellectual property", "The price volatility of company securities on open exchanges", "The percentage of revenue subject to international exchange fees"]',
   0, 'Liquidity refers to how quickly an asset can be converted into ready cash without losing value.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Medium 7 (Correct: 1)
  ('qb_m7', 'In subscription-based software businesses, which key metric tracks the rate at which existing customers cancel subscriptions?', 'SaaS & Metrics', 'Medium',
   '["Bounce Rate", "Churn Rate", "Dropoff Frequency", "Attrition Coefficient"]',
   1, 'Churn Rate measures the percentage of recurring customers or revenue lost over a defined measurement period.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Medium 8 (Correct: 2)
  ('qb_m8', 'Which regulatory authority in India is responsible for regulating securities markets, stock brokers, and merchant bankers?', 'Business Regulation', 'Medium',
   '["Reserve Bank of India (RBI)", "Insolvency and Bankruptcy Board of India (IBBI)", "Securities and Exchange Board of India (SEBI)", "Insurance Regulatory and Development Authority (IRDAI)"]',
   2, 'SEBI is the primary statutory regulator overseeing capital and securities markets across India.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Hard 1 (Correct: 3)
  ('qb_h1', 'In enterprise SaaS evaluation, what does a "Net Revenue Retention" (NRR) rate of 120% indicate?', 'Corporate Finance', 'Hard',
   '["Customer acquisition cost is fully repaid within 1.2 fiscal quarters", "The company gained 20% more net customers than it lost across all regions", "Total operating expenditures exceeded gross profit by exactly 20%", "Existing cohorts generate 20% more revenue year-over-year after accounting for expansions, contractions, and churn"]',
   3, 'An NRR above 100% (e.g. 120%) means expansion revenue from retained clients outpaces all lost revenue from churn and downgrades.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Hard 2 (Correct: 0)
  ('qb_h2', 'Under Michael Porter''s Five Forces strategic framework, which force analyzes the risk of buyers coercing lower prices or higher quality?', 'Strategic Management', 'Hard',
   '["Bargaining Power of Buyers", "Threat of Substitute Products", "Rivalry Among Existing Competitors", "Barriers to Entry"]',
   0, 'The Bargaining Power of Buyers assesses how much pressure customers can place on businesses to lower prices or improve service.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Hard 3 (Correct: 1)
  ('qb_h3', 'What is the fundamental difference between "Accrual Accounting" and "Cash Accounting"?', 'Accounting Standards', 'Hard',
   '["Cash accounting is legally required for all public enterprises under IFRS and US GAAP", "Accrual recognizes revenues and expenses when earned or incurred regardless of when cash changes hands", "Accrual completely omits depreciation of tangible capital equipment", "Cash accounting capitalizes invoices as immediate equity upon dispatch"]',
   1, 'Accrual accounting records financial transactions when obligations are incurred, matching expenses with revenues in real time.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Hard 4 (Correct: 2)
  ('qb_h4', 'How does the "Quick Ratio" (Acid-Test Ratio) differ from the standard "Current Ratio" in balance sheet analysis?', 'Financial Ratios', 'Hard',
   '["It removes trade receivables and considers only physical cash in bank accounts", "It divides total long-term debt by equity rather than short-term liabilities", "It excludes inventory and prepaid expenses from current assets because they cannot be liquidated instantly", "It benchmarks operational cash flow against interest payment schedules"]',
   2, 'The Quick Ratio excludes inventory from liquid assets because inventory may take time to convert into cash at book value.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

-- Hard 5 (Correct: 3)
  ('qb_h5', 'In corporate valuation and M&A deals, what does a "Discounted Cash Flow" (DCF) model determine?', 'Corporate Finance & M&A', 'Hard',
   '["The historical auction liquidation value of physical property, plants, and patents", "The price-to-earnings multiple derived strictly from public sector competitors", "The replacement cost of all tangible equipment under current market conditions", "The present value of anticipated future free cash flows discounted back using a weighted average cost of capital (WACC)"]',
   3, 'A DCF model estimates the intrinsic value of an investment based on its expected future cash flows adjusted for the time value of money.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z');


-- 3. 20 Business Mathematics & Quantitative Reasoning Questions
INSERT OR REPLACE INTO questions (id, question, category, difficulty, options_json, correct_index, explanation, is_active, created_at, updated_at)
VALUES
  ('qm_1', 'A merchant purchases enterprise inventory for ₹8,000 and sells it for ₹10,000. What is the profit percentage on cost?', 'Business Mathematics', 'Easy',
   '["20%", "25%", "15%", "12.5%"]',
   1, 'Profit = ₹10,000 - ₹8,000 = ₹2,000. Profit % on cost = (2,000 / 8,000) × 100 = 25%.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_2', 'If a SaaS company invests ₹50,000 in a digital marketing campaign that generates ₹1,50,000 in gross profit, what is the Return on Investment (ROI)?', 'Business Mathematics', 'Medium',
   '["150%", "200%", "300%", "250%"]',
   1, 'ROI = ((Gain - Cost) / Cost) × 100 = ((1,50,000 - 50,000) / 50,000) × 100 = 200%.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_3', 'A software license is listed at ₹10,000. The vendor offers a 20% promotional discount, followed by an 18% GST on the discounted price. What is the final invoice amount?', 'Business Mathematics', 'Medium',
   '["₹9,440", "₹9,800", "₹8,900", "₹10,200"]',
   0, 'Discounted price = ₹10,000 - 20% = ₹8,000. GST 18% = ₹1,440. Final amount = ₹8,000 + ₹1,440 = ₹9,440.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_4', 'A company has fixed operating costs of ₹1,20,000 per month. Its product sells for ₹600 with a variable cost of ₹200 per unit. What is the monthly break-even volume?', 'Business Mathematics', 'Medium',
   '["200 units", "250 units", "300 units", "400 units"]',
   2, 'Contribution margin per unit = ₹600 - ₹200 = ₹400. Break-even volume = ₹1,20,000 / ₹400 = 300 units.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_5', 'If ₹50,000 is invested in a corporate fixed deposit at 12% simple interest per annum, what is the total interest earned after 3 years?', 'Business Mathematics', 'Easy',
   '["₹15,000", "₹18,000", "₹20,000", "₹16,500"]',
   1, 'Simple Interest = (P × R × T) / 100 = (50,000 × 12 × 3) / 100 = ₹18,000.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_6', 'An engineering firm has 6 developers who can build a custom CRM module in 20 days. How many days would 10 developers take to build the same module working at the same pace?', 'Quantitative Aptitude', 'Medium',
   '["10 days", "12 days", "15 days", "14 days"]',
   1, 'Total effort = 6 developers × 20 days = 120 dev-days. Time with 10 developers = 120 / 10 = 12 days.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_7', 'A tech company has Current Assets of ₹3,00,000 and Current Liabilities of ₹1,20,000. What is its Current Ratio?', 'Financial Ratios', 'Easy',
   '["2.0 : 1", "2.5 : 1", "3.0 : 1", "1.8 : 1"]',
   1, 'Current Ratio = Current Assets / Current Liabilities = ₹3,00,000 / ₹1,20,000 = 2.5 : 1.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_8', 'A startup''s annual recurring revenue (ARR) grew from ₹40,00,000 to ₹60,00,000 over 12 months. What is the Year-over-Year (YoY) revenue growth rate?', 'Business Mathematics', 'Easy',
   '["33.3%", "40%", "50%", "60%"]',
   2, 'YoY Growth = ((₹60,00,000 - ₹40,00,000) / ₹40,00,000) × 100 = 50%.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_9', 'If a retailer desires a 25% profit margin on the Selling Price of an item that costs ₹750 to produce, what must the selling price be?', 'Business Mathematics', 'Hard',
   '["₹937.50", "₹1,000", "₹950", "₹1,050"]',
   1, 'Selling Price = Cost / (1 - Margin) = ₹750 / (1 - 0.25) = ₹750 / 0.75 = ₹1,000.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_10', 'A B2B SaaS startup spent ₹2,40,000 on digital acquisition channels last month and successfully acquired 60 paying clients. What is their Customer Acquisition Cost (CAC)?', 'Business Mathematics', 'Easy',
   '["₹3,500", "₹4,000", "₹4,500", "₹5,000"]',
   1, 'CAC = Total Acquisition Spend / New Clients = ₹2,40,000 / 60 = ₹4,000 per customer.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_11', 'A corporate reserve of ₹2,00,000 is compounded annually at 10% interest. What will be the total compounded amount at the end of 2 years?', 'Business Mathematics', 'Medium',
   '["₹2,40,000", "₹2,42,000", "₹2,44,000", "₹2,20,000"]',
   1, 'A = P(1 + r)^t = 2,00,000 × (1.10)^2 = 2,00,000 × 1.21 = ₹2,42,000.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_12', 'A company has Total Revenue of ₹5,00,000, Cost of Goods Sold (COGS) of ₹2,00,000, and Operating Expenses of ₹1,50,000. What is its Operating Profit Margin?', 'Business Mathematics', 'Medium',
   '["25%", "30%", "35%", "40%"]',
   1, 'Operating Profit = ₹5,00,000 - ₹2,00,000 - ₹1,50,000 = ₹1,50,000. Margin = (1,50,000 / 5,00,000) × 100 = 30%.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_13', 'An enterprise server valued at ₹1,50,000 depreciates by 20% in the first year and 10% on the remaining value in the second year. What is its book value after 2 years?', 'Business Mathematics', 'Hard',
   '["₹1,05,000", "₹1,08,000", "₹1,10,000", "₹1,12,000"]',
   1, 'After Year 1: ₹1,50,000 - 20% = ₹1,20,000. Year 2 depreciation: 10% of 1,20,000 = ₹12,000. Final book value = ₹1,08,000.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_14', 'If an e-commerce platform processes 12,000 monthly transactions with an average order value (AOV) of ₹850, what is its Gross Merchandise Value (GMV) for the month?', 'Business Mathematics', 'Easy',
   '["₹98,00,000", "₹1,02,00,000 (₹1.02 Cr)", "₹1,10,00,000", "₹1,20,00,000"]',
   1, 'GMV = Total Orders × AOV = 12,000 × ₹850 = ₹1,02,00,000 (₹1.02 Crore).', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_15', 'A SaaS product has 2,000 active subscribers at the start of the quarter. During the quarter, 100 subscribers churn. What is the quarterly churn rate?', 'SaaS & Metrics', 'Easy',
   '["4%", "5%", "6%", "2.5%"]',
   1, 'Churn Rate = (Churned Customers / Total Starting Customers) × 100 = (100 / 2,000) × 100 = 5%.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_16', 'A business receives two successive trade discounts of 10% and 20% on bulk hardware purchases. What is the single equivalent overall discount percentage?', 'Business Mathematics', 'Medium',
   '["30%", "28%", "25%", "26%"]',
   1, 'Net price = 100 × (1 - 0.10) × (1 - 0.20) = 100 × 0.90 × 0.80 = 72%. Effective discount = 100% - 72% = 28%.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_17', 'If a firm''s average inventory is ₹2,00,000 and its annual Cost of Goods Sold (COGS) is ₹12,00,000, what is its Inventory Turnover Ratio?', 'Financial Ratios', 'Medium',
   '["4 times", "5 times", "6 times", "8 times"]',
   2, 'Inventory Turnover Ratio = Cost of Goods Sold / Average Inventory = ₹12,00,000 / ₹2,00,000 = 6 times.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_18', 'If the ratio of equity to debt in a corporate financing structure is 3 : 2 and total capital is ₹50,00,000, what is the total equity portion?', 'Corporate Finance', 'Easy',
   '["₹25,00,000", "₹30,00,000", "₹35,00,000", "₹20,00,000"]',
   1, 'Total parts = 3 + 2 = 5. Equity portion = (3 / 5) × ₹50,00,000 = ₹30,00,000.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_19', 'A startup has ₹36,00,000 in bank cash reserves and an average monthly burn rate of ₹4,50,000. How many months of financial runway does the startup have?', 'Startups', 'Easy',
   '["6 months", "7 months", "8 months", "9 months"]',
   2, 'Runway = Available Cash / Monthly Burn Rate = ₹36,00,000 / ₹4,50,000 = 8 months.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z'),

  ('qm_20', 'If an automated cloud ledger server audits 450 invoice batches in 15 minutes, how many batches will it audit in 1 hour at the same processing rate?', 'Quantitative Aptitude', 'Easy',
   '["1,500", "1,800", "2,000", "2,250"]',
   1, '1 hour = 60 minutes = 4 × 15 minutes. Batches processed = 450 × 4 = 1,800 batches.', 1, '2026-10-31T00:00:00.000Z', '2026-10-31T00:00:00.000Z');
