import * as SQLite from 'expo-sqlite';

let database;
const gameTypes = ['memory_recall', 'pattern_recognition', 'attention_speed', 'routine_recall', 'reasoning'];

export async function initDb() {
  database = await SQLite.openDatabaseAsync('saarthi.db');
  await database.execAsync(`PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY, name TEXT NOT NULL, preferred_language TEXT DEFAULT 'English', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS game_sessions (id INTEGER PRIMARY KEY, patient_id INTEGER NOT NULL, game_type TEXT NOT NULL, difficulty_level INTEGER NOT NULL, correct_answers INTEGER NOT NULL, total_questions INTEGER NOT NULL, accuracy REAL NOT NULL, avg_response_time_ms INTEGER, played_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY, patient_id INTEGER NOT NULL, type TEXT NOT NULL, label TEXT NOT NULL, scheduled_time TEXT NOT NULL, is_active INTEGER DEFAULT 1, last_completed_at TEXT);
    CREATE TABLE IF NOT EXISTS sync_status (id INTEGER PRIMARY KEY, last_synced_at TEXT, status TEXT DEFAULT 'synced');`);
  const patient = await database.getFirstAsync('SELECT id FROM patients LIMIT 1');
  if (!patient) {
    await database.runAsync('INSERT INTO patients (name, preferred_language) VALUES (?, ?)', 'Amma', 'Assamese');
    await database.runAsync("INSERT INTO reminders (patient_id, type, label, scheduled_time) VALUES (1, 'medicine', 'Morning Blood Pressure & Vitamin D', '10:00')");
    for (let i = 0; i < gameTypes.length; i += 1) {
      for (let day = 12; day >= 1; day -= 1) {
        const improving = i < 2, declining = i === 2;
        const accuracy = improving ? 0.58 + (12 - day) * 0.028 : declining ? 0.88 - (12 - day) * 0.025 : 0.73 + (day % 2) * 0.02;
        await database.runAsync('INSERT INTO game_sessions (patient_id, game_type, difficulty_level, correct_answers, total_questions, accuracy, avg_response_time_ms, played_at) VALUES (1, ?, ?, ?, 10, ?, ?, datetime(\'now\', ?))', gameTypes[i], Math.min(5, 1 + Math.floor((12 - day) / 4)), Math.round(accuracy * 10), accuracy, 2200 + day * 45, `-${day} days`);
      }
    }
    await database.runAsync("INSERT INTO sync_status (last_synced_at, status) VALUES (CURRENT_TIMESTAMP, 'synced')");
  }
}

export async function getHomeData() {
  return { patient: await database.getFirstAsync('SELECT * FROM patients LIMIT 1'), reminder: await database.getFirstAsync('SELECT * FROM reminders WHERE is_active = 1 ORDER BY scheduled_time LIMIT 1') };
}
export async function updatePreferredLanguage(language) { await database.runAsync('UPDATE patients SET preferred_language = ? WHERE id = 1', language); }
export async function markReminderDone(id) { await database.runAsync('UPDATE reminders SET last_completed_at = CURRENT_TIMESTAMP WHERE id = ?', id); }
export async function getNextDifficulty(gameType) {
  const rows = await database.getAllAsync('SELECT accuracy, difficulty_level FROM game_sessions WHERE game_type = ? ORDER BY played_at DESC LIMIT 3', gameType);
  const average = rows.reduce((sum, item) => sum + item.accuracy, 0) / Math.max(rows.length, 1);
  const current = rows[0]?.difficulty_level || 1;
  return Math.max(1, Math.min(5, average > 0.85 ? current + 1 : average < 0.5 ? current - 1 : current));
}
export async function logGameSession(gameType, correct, total, difficulty, responseMs) {
  await database.runAsync('INSERT INTO game_sessions (patient_id, game_type, difficulty_level, correct_answers, total_questions, accuracy, avg_response_time_ms) VALUES (1, ?, ?, ?, ?, ?, ?)', gameType, difficulty, correct, total, correct / total, responseMs);
}
export async function getDashboard() {
  const sessions = await database.getAllAsync('SELECT * FROM game_sessions ORDER BY played_at DESC');
  return gameTypes.map((key) => {
    const rows = sessions.filter((item) => item.game_type === key).slice(0, 7);
    const recent = rows.slice(0, 3).reduce((sum, x) => sum + x.accuracy, 0) / 3;
    const prior = rows.slice(3, 6).reduce((sum, x) => sum + x.accuracy, 0) / 3;
    const trend = recent - prior > .08 ? 'improving' : recent - prior < -.08 ? 'declining' : 'stable';
    return { key, rows, accuracy: Math.round((rows[0]?.accuracy || 0) * 100), difficulty: rows[0]?.difficulty_level || 1, trend };
  });
}
