export default function calcStreak(log) {
  if (!log || log.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  // Extract and sort dates
  const dates = log.map((entry) => new Date(entry.date)).sort((a, b) => a - b);

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

  // Check if current streak includes today or yesterday
  const lastDate = dates[dates.length - 1];
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isCurrentStreakActive =
    lastDate.toDateString() === today.toDateString() ||
    lastDate.toDateString() === yesterday.toDateString();

  return {
    currentStreak: isCurrentStreakActive ? currentStreak : 0,
    maxStreak,
  };
}

// const log = [
//   { "6/23/2025": { date: "6/23/2025", focusTime: 40 } },
//   { "6/24/2025": { date: "6/24/2025", focusTime: 40 } },
//   { "6/25/2025": { date: "6/25/2025", focusTime: 40 } },
//   { "6/25/2025": { date: "6/25/2025", focusTime: 40 } },
//   { "6/27/2025": { date: "6/27/2025", focusTime: 40 } },
// ];

const log = [
  { date: "6/23/2025", focusTime: 900 },
  { date: "6/24/2025", focusTime: 1200 },
];
