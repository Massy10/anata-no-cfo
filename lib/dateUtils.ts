/**
 * Convert Supabase ISO date string to Japanese display format
 * "2026-04-04" → "4月4日"
 */
export function isoToJP(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

/**
 * Convert Japanese display string to ISO date string
 * "4月4日" → "2026-04-04"
 * Month > current month is assumed to be from previous year
 */
export function jpToISO(jpDate: string): string {
  const match = jpDate.match(/(\d+)月(\d+)日/);
  if (!match) return new Date().toISOString().split('T')[0];
  const now = new Date();
  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);
  const year = month > now.getMonth() + 1 ? now.getFullYear() - 1 : now.getFullYear();
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
