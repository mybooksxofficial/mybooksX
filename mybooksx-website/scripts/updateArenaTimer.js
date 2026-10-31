import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const arenaPath = path.join(rootDir, 'src/pages/QuestArenaPage.tsx');
let code = fs.readFileSync(arenaPath, 'utf8');

code = code.replace(/setTotalQuestions\(10\)/g, 'setTotalQuestions(20)');
code = code.replace(/totalQuestions \|\| 10/g, 'totalQuestions || 20');
code = code.replace(/setOverallTimeLeft\(300\.0\)/g, 'setOverallTimeLeft(900.0)');
code = code.replace(/setQuestionTimeLeft\(30\.0\)/g, 'setQuestionTimeLeft(45.0)');
code = code.replace(/300\.0 - elapsedOverall/g, '900.0 - elapsedOverall');
code = code.replace(/30\.0 - elapsedQuestion/g, '45.0 - elapsedQuestion');
code = code.replace(/5-Minute/g, '15-Minute');
code = code.replace(/5-minute/g, '15-minute');
code = code.replace(/30-second/g, '45-second');
code = code.replace(/30-Second/g, '45-Second');
code = code.replace(/300 seconds/g, '900 seconds');
code = code.replace(/30 seconds/g, '45 seconds');
code = code.replace(/10 business questions/gi, '20 mathematical questions');
code = code.replace(/10 questions/gi, '20 questions');
code = code.replace(/05:00/g, '15:00');
code = code.replace(/00:30/g, '00:45');

fs.writeFileSync(arenaPath, code, 'utf8');
console.log('✅ Updated src/pages/QuestArenaPage.tsx to 20 questions and 15:00 timer (45s per question)');

