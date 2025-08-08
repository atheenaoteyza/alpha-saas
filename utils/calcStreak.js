export default function calcStreak(log) {
  if (!log || log.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  // Get unique date strings in YYYY-MM-DD format
  const uniqueDateStrings = [
    ...new Set(
      log.map((entry) => new Date(entry.date).toLocaleDateString("en-CA"))
    ),
  ];

  // Convert YYYY-MM-DD to local Date objects (safe from UTC shifts)
  const dates = uniqueDateStrings
    .map((dateStr) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day); // local midnight
    })
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

  // Compare to today's and yesterday's date (local)
  const todayStr = new Date().toLocaleDateString("en-CA");
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString("en-CA");

  const lastDateStr = dates[dates.length - 1].toLocaleDateString("en-CA");

  console.log("🟨 lastDateStr:", lastDateStr);
  console.log("🟩 todayStr:", todayStr);
  console.log("🟧 yesterdayStr:", yesterdayStr);

  const isCurrentStreakActive =
    lastDateStr === todayStr || lastDateStr === yesterdayStr;

  return {
    currentStreak: isCurrentStreakActive ? currentStreak : 0,
    maxStreak,
  };
}
