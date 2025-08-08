export function normalizeLogDatesToLocal(logs) {
  return logs.map((entry) => {
    // If already in YYYY-MM-DD, keep it
    if (/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
      return entry;
    }

    // Otherwise, normalize
    const localDateStr = new Date(entry.date).toLocaleDateString("en-CA");
    return { ...entry, date: localDateStr };
  });
}
