function calculateStreak(focusLog) {
  // Step 1: Extract date keys and convert to Date objects
  const dateStrings = focusLog.map((entry) => Object.keys(entry)[0]);
  const dates = dateStrings.map((d) => new Date(d)).sort((a, b) => a - b);

  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (diff > 1) {
      currentStreak = 1; // reset
    }
  }

  // Check if the last streak includes today
  const today = new Date().toDateString();
  const lastDate = dates[dates.length - 1].toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isCurrentStreakActive =
    lastDate === today || lastDate === yesterday.toDateString();

  return {
    currentStreak: isCurrentStreakActive ? currentStreak : 0,
    maxStreak,
  };
}

const log = [
  { "6/23/2025": { focusTime: 40 } },
  { "6/24/2025": { focusTime: 30 } },
  { "6/25/2025": { focusTime: 50 } },
  { "6/27/2025": { focusTime: 10 } },
];

const { currentStreak, maxStreak } = calculateStreak(log);
console.log("Current:", currentStreak); // 1 if today is 6/27/2025
console.log("Max:", maxStreak); // 3
