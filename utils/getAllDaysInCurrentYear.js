// utils/getAllDaysInCurrentYear.js
export default function getAllDaysInCurrentYear() {
  const year = new Date().getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  const weeks = [];
  let currentWeek = [];
  let currentDate = new Date(start);

  // fill the first week with null if not started on Sunday
  for (let i = 0; i < currentDate.getDay(); i++) {
    currentWeek.push(null);
  }

  while (currentDate <= end) {
    currentWeek.push(currentDate.toISOString().split("T")[0]);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // fill the last week with null if not ended a 7 day week

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }
  return weeks;
}
