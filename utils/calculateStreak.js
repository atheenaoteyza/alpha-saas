export default function calculateStreak(focusLog) {
  // Helper: format to YYYY-MM-DD
  const normalizeDate = (date) => new Date(date).toISOString().split("T")[0];

  // Extract and normalize all date keys
  const dateStrings = focusLog.map((entry) =>
    normalizeDate(Object.keys(entry)[0])
  );

  // Remove duplicates and sort chronologically
  const dates = [...new Set(dateStrings)].sort(
    (a, b) => new Date(a) - new Date(b)
  );

  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);

    const diff = (curr - prev) / (1000 * 60 * 60 * 24); // day difference

    if (diff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (diff > 1) {
      currentStreak = 1; // reset streak
    }
  }

  const today = normalizeDate(new Date());
  const yesterday = normalizeDate(new Date(Date.now() - 1000 * 60 * 60 * 24));
  const lastDate = dates[dates.length - 1];

  const isCurrentStreakActive = lastDate === today || lastDate === yesterday;

  return {
    currentStreak: isCurrentStreakActive ? currentStreak : 0,
    maxStreak,
  };
}
