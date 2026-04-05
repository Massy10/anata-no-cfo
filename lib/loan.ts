/**
 * Calculate monthly payment using equal principal and interest method (元利均等返済).
 */
export function calcMonthly(principal: number, annualRate: number, years: number): number {
  if (annualRate === 0) return Math.round(principal / (years * 12));
  const mr = annualRate / 100 / 12;
  const n = years * 12;
  return Math.round(
    (principal * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)
  );
}

/**
 * Calculate total repayment amount over the full loan term.
 */
export function calcTotal(principal: number, annualRate: number, years: number): number {
  return calcMonthly(principal, annualRate, years) * years * 12;
}
