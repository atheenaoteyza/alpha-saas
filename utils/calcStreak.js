export default function calcStreak(log) {
  if (!log || log.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  // Use local date strings like "2025-08-07" to prevent timezone issues
  const uniqueDateStrings = [
    ...new Set(
      log.map(
        (entry) => new Date(entry.date).toLocaleDateString("en-CA") // YYYY-MM-DD
      )
    ),
  ];

  // Convert back to Date objects and sort
  const dates = uniqueDateStrings
    .map((dateStr) => new Date(dateStr + "T00:00:00")) // set to local midnight
    .sort((a, b) => a - b);

  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      currentStreak++;
    } else if (diff > 1) {
      currentStreak = 1;
    }

    maxStreak = Math.max(maxStreak, currentStreak);
  }

  // Compare to local today and yesterday
  const todayStr = new Date().toLocaleDateString("en-CA");
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString("en-CA");

  const lastDateStr = dates[dates.length - 1].toLocaleDateString("en-CA");

  const isCurrentStreakActive =
    lastDateStr === todayStr || lastDateStr === yesterdayStr;

  return {
    currentStreak: isCurrentStreakActive ? currentStreak : 0,
    maxStreak,
  };
}
