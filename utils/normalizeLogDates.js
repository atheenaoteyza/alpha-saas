export function normalizeLogDatesToLocal(logs) {
  return logs.map((entry) => {
    const localDateStr = new Date(entry.date).toLocaleDateString("en-CA");
    return { ...entry, date: localDateStr };
  });
}
