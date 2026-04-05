export const DEFAULT_RATE = 149.5;

/**
 * Get USD/JPY exchange rate for a given date.
 * In production, this will fetch from the Supabase fx_rates table.
 */
export function getRate(_dateStr?: string): number {
  return DEFAULT_RATE;
}

/**
 * Convert an amount to JPY.
 * If the currency is already JPY, return as-is.
 */
export function toJPY(amount: number, currency: string, dateStr?: string): number {
  if (currency === 'JPY') return amount;
  return Math.round(amount * getRate(dateStr));
}

/**
 * Format a number as a currency string with symbol.
 */
export function formatCurrency(amount: number, currency: string = 'JPY'): string {
  const sym = currency === 'USD' ? '$' : '\u00a5';
  return `${sym}${Math.abs(amount).toLocaleString()}`;
}
