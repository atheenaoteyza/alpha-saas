export default function calcStreak(log) {
  if (!log || log.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  // Extract unique date strings
  const uniqueDateStrings = [
    ...new Set(log.map((entry) => new Date(entry.date).toDateString())),
  ];

  // Convert back to Date objects and sort
  const dates = uniqueDateStrings
    .map((dateStr) => new Date(dateStr))
    .sort((a, b) => a - b);

  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24); // day difference

    if (diff === 1) {
      currentStreak++;
    } else if (diff > 1) {
      currentStreak = 1;
    }

    maxStreak = Math.max(maxStreak, currentStreak);
  }

  // Check if the last date is today or yesterday
  const lastDate = dates[dates.length - 1];
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isCurrentStreakActive =
    lastDate.toDateString() === today.toDateString() ||
    lastDate.toDateString() === yesterday.toDateString();

  console.log("Streak calc input:", log);
  console.log(
    "Parsed dates:",
    dates.map((d) => d.toDateString())
  );
  console.log("Last date:", lastDate.toDateString());
  console.log("Today:", today.toDateString());

  // If today is 6/25/2025 → currentStreak: 2, maxStreak: 2

  return {
    currentStreak: isCurrentStreakActive ? currentStreak : 0,
    maxStreak,
  };
}
