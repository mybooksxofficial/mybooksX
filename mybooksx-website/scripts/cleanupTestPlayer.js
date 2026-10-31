import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../.d1/local.sqlite');

const db = new DatabaseSync(dbPath);
db.exec("DELETE FROM users WHERE full_name = 'Rahul Sharma'");

console.log('Cleaned test player. Remaining users:');
console.log(db.prepare('SELECT id, full_name, email, phone, points_balance FROM users').all());
