export function calculateStreak(days: any[]) {
  let streak = 0;

  const sorted = days.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (const d of sorted) {
    if (d.status === 'productive') streak++;
    else break;
  }

  return streak;
}