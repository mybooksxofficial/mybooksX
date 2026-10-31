import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const quizServicePath = path.join(rootDir, 'src/server/quizService.ts');
let code = fs.readFileSync(quizServicePath, 'utf8');

// 1. Update calculateSpeedPoints
const oldSpeedPoints = `  static calculateSpeedPoints(isCorrect: boolean, responseTimeMs: number): {
    points: number;
    speedTier: AnswerSubmissionResult['speedTier'];
  } {
    if (!isCorrect) {
      return { points: 0, speedTier: 'Incorrect' };
    }

    const seconds = responseTimeMs / 1000;

    // Generous 1.0s network latency buffer for 30s deadline
    if (seconds <= 5.5) {
      return { points: 200, speedTier: '0-5s (Lightning)' };
    } else if (seconds <= 10.5) {
      return { points: 180, speedTier: '6-10s (Fast)' };
    } else if (seconds <= 15.5) {
      return { points: 160, speedTier: '11-15s (Great)' };
    } else if (seconds <= 20.5) {
      return { points: 130, speedTier: '16-20s (Good)' };
    } else if (seconds <= 25.5) {
      return { points: 100, speedTier: '21-25s (Steady)' };
    } else if (seconds <= 31.0) {
      return { points: 60, speedTier: '26-30s (Clutch)' };
    } else {
      return { points: 0, speedTier: 'Timeout' };
    }
  }`;

const newSpeedPoints = `  static calculateSpeedPoints(isCorrect: boolean, responseTimeMs: number): {
    points: number;
    speedTier: AnswerSubmissionResult['speedTier'];
  } {
    if (!isCorrect) {
      return { points: 0, speedTier: 'Incorrect' };
    }

    const seconds = responseTimeMs / 1000;

    // 45-second question duration with generous 1.0s network latency buffer
    if (seconds <= 7.5) {
      return { points: 200, speedTier: '0-7s (Lightning)' };
    } else if (seconds <= 15.5) {
      return { points: 180, speedTier: '8-15s (Fast)' };
    } else if (seconds <= 25.5) {
      return { points: 150, speedTier: '16-25s (Great)' };
    } else if (seconds <= 35.5) {
      return { points: 120, speedTier: '26-35s (Good)' };
    } else if (seconds <= 46.0) {
      return { points: 90, speedTier: '36-45s (Steady)' };
    } else {
      return { points: 0, speedTier: 'Timeout' };
    }
  }`;

code = code.replace(oldSpeedPoints.replace(/\r\n/g, '\n'), newSpeedPoints);
code = code.replace(oldSpeedPoints.replace(/\n/g, '\r\n'), newSpeedPoints.replace(/\n/g, '\r\n'));

// 2. Update Question Selection in startQuiz:
// Select 20 Mathematical Questions (qm_1 to qm_20)
const oldSelection = `    // 4. Select exactly 10 Questions: 4 Easy, 4 Medium, 2 Hard (Business Related)
    // Prioritizing the 20 curated business questions (qb_e1..qb_e7, qb_m1..qb_m8, qb_h1..qb_h5)
    const easyQ = await db.prepare(
      "SELECT id FROM questions WHERE is_active = 1 AND difficulty = 'Easy' ORDER BY CASE WHEN id LIKE 'qb_%' THEN 0 ELSE 1 END, RANDOM() LIMIT 4"
    ).all<{ id: string }>();
    const medQ = await db.prepare(
      "SELECT id FROM questions WHERE is_active = 1 AND difficulty = 'Medium' ORDER BY CASE WHEN id LIKE 'qb_%' THEN 0 ELSE 1 END, RANDOM() LIMIT 4"
    ).all<{ id: string }>();
    const hardQ = await db.prepare(
      "SELECT id FROM questions WHERE is_active = 1 AND difficulty = 'Hard' ORDER BY CASE WHEN id LIKE 'qb_%' THEN 0 ELSE 1 END, RANDOM() LIMIT 2"
    ).all<{ id: string }>();

    let questionIds = [
      ...(easyQ.results || []).map(q => q.id),
      ...(medQ.results || []).map(q => q.id),
      ...(hardQ.results || []).map(q => q.id)
    ];

    if (questionIds.length < 10) {
      // Fallback: fill up to 10 from active questions
      const anyQ = await db.prepare("SELECT id FROM questions WHERE is_active = 1 ORDER BY RANDOM() LIMIT 10").all<{ id: string }>();
      questionIds = (anyQ.results || []).map(q => q.id);
    }`;

const newSelection = `    // 4. Select exactly 20 Mathematical Questions (15-Minute Duration)
    // Primary pool: Curated Mathematical & Quantitative reasoning questions (qm_1 .. qm_20)
    const mathQ = await db.prepare(
      "SELECT id FROM questions WHERE is_active = 1 AND id LIKE 'qm_%' ORDER BY CAST(SUBSTR(id, 4) AS INTEGER) ASC LIMIT 20"
    ).all<{ id: string }>();

    let questionIds = (mathQ.results || []).map(q => q.id);

    if (questionIds.length < 20) {
      // Fallback: fill up to 20 from active questions
      const remainingNeed = 20 - questionIds.length;
      const placeholders = questionIds.map(() => '?').join(',');
      const query = questionIds.length > 0
        ? \`SELECT id FROM questions WHERE is_active = 1 AND id NOT IN (\${placeholders}) ORDER BY RANDOM() LIMIT ?\`
        : \`SELECT id FROM questions WHERE is_active = 1 ORDER BY RANDOM() LIMIT 20\`;
      const stmt = db.prepare(query);
      const moreQ = questionIds.length > 0
        ? await stmt.bind(...questionIds, remainingNeed).all<{ id: string }>()
        : await stmt.all<{ id: string }>();
      questionIds = [...questionIds, ...(moreQ.results || []).map(q => q.id)];
    }`;

code = code.replace(oldSelection.replace(/\r\n/g, '\n'), newSelection);
code = code.replace(oldSelection.replace(/\n/g, '\r\n'), newSelection.replace(/\n/g, '\r\n'));

// 3. Update durations:
// 300 -> 900 (15 minutes overall)
// 30 -> 45 (45 seconds per question)
// 30000 -> 45000 (ms timeout)
code = code.replace(/totalQuestDurationSeconds:\s*300/g, 'totalQuestDurationSeconds: 900');
code = code.replace(/questionDurationSeconds:\s*30/g, 'questionDurationSeconds: 45');
code = code.replace(/overallRemainingSeconds:\s*300/g, 'overallRemainingSeconds: 900');
code = code.replace(/questionRemainingSeconds:\s*30/g, 'questionRemainingSeconds: 45');
code = code.replace(/totalElapsedSec >= 300/g, 'totalElapsedSec >= 900');
code = code.replace(/totalQuestElapsedSec >= 300/g, 'totalQuestElapsedSec >= 900');
code = code.replace(/300\.0 - totalElapsedSec/g, '900.0 - totalElapsedSec');
code = code.replace(/300 - Math\.round\(totalElapsedSec\)/g, '900 - Math.round(totalElapsedSec)');
code = code.replace(/300 - Math\.round\(totalQuestElapsedSec\)/g, '900 - Math.round(totalQuestElapsedSec)');
code = code.replace(/30\.0 - questionElapsedSec/g, '45.0 - questionElapsedSec');
code = code.replace(/isTimeout \? 30000 : responseTimeMs/g, 'isTimeout ? 45000 : responseTimeMs');
code = code.replace(/5 minutes \(300 seconds\)/gi, '15 minutes (900 seconds)');
code = code.replace(/5-minute deadline/gi, '15-minute deadline');
code = code.replace(/5-Minute Deadline/gi, '15-Minute Deadline');
code = code.replace(/5-minute timer/gi, '15-minute timer');
code = code.replace(/5-minute window/gi, '15-minute window');
code = code.replace(/30 seconds per question/gi, '45 seconds per question');
code = code.replace(/Individual question duration: 30 seconds/gi, 'Individual question duration: 45 seconds');
code = code.replace(/10 questions/gi, '20 questions');
code = code.replace(/10 Questions/gi, '20 Questions');

fs.writeFileSync(quizServicePath, code, 'utf8');
console.log('✅ Updated src/server/quizService.ts to 20 Mathematical Questions & 15-Minute Duration (900s / 45s)');
