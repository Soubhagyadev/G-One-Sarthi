// Browser demo adapter. Native platforms use db.js and persist the same data in SQLite.
const games = ['memory_recall', 'pattern_recognition', 'attention_speed', 'routine_recall', 'reasoning'];
let reminder = { id: 1, scheduled_time: '10:00', label: 'Morning Blood Pressure & Vitamin D' };
let sessions = [];

export async function initDb() {
  if (sessions.length) return;
  games.forEach((gameType, index) => {
    for (let day = 12; day >= 1; day -= 1) {
      const value = index < 2 ? .58 + (12 - day) * .028 : index === 2 ? .88 - (12 - day) * .025 : .73 + (day % 2) * .02;
      sessions.push({ game_type: gameType, accuracy: value, difficulty_level: Math.min(5, 1 + Math.floor((12 - day) / 4)), played_at: day });
    }
  });
}
export async function getHomeData() { return { patient: { name: 'Amma', preferred_language: 'Assamese' }, reminder }; }
export async function markReminderDone() { reminder = { ...reminder, completed: true }; }
export async function getNextDifficulty(gameType) {
  const recent = sessions.filter(x => x.game_type === gameType).slice(-3);
  const average = recent.reduce((sum, x) => sum + x.accuracy, 0) / recent.length;
  const current = recent[recent.length - 1]?.difficulty_level || 1;
  return Math.max(1, Math.min(5, average > .85 ? current + 1 : average < .5 ? current - 1 : current));
}
export async function logGameSession(gameType, correct, total, difficulty) { sessions.push({ game_type: gameType, accuracy: correct / total, difficulty_level: difficulty, played_at: 0 }); }
export async function getDashboard() {
  return games.map((key) => {
    const rows = sessions.filter(x => x.game_type === key).slice(-7).reverse();
    const recent = rows.slice(0, 3).reduce((sum, x) => sum + x.accuracy, 0) / 3;
    const prior = rows.slice(3, 6).reduce((sum, x) => sum + x.accuracy, 0) / 3;
    return { key, rows, accuracy: Math.round(rows[0].accuracy * 100), difficulty: rows[0].difficulty_level, trend: recent - prior > .08 ? 'improving' : recent - prior < -.08 ? 'declining' : 'stable' };
  });
}
