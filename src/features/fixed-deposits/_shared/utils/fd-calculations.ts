/**
 * Calculates monthly interest for a fixed deposit
 */
export function calculateMonthlyInterest(
  amount: number,
  interestRate: number,
): number {
  return (amount * interestRate) / 1200; // 1200 = 12 months * 100 (to convert percentage)
}

/**
 * Calculates total expected interest for a fixed deposit
 */
export function calculateTotalInterest(
  amount: number,
  interestRate: number,
  depositDate: string,
  maturityDate: string,
): number {
  const startDate = new Date(depositDate);
  const endDate = new Date(maturityDate);

  // Calculate months between deposit and maturity (approximate)
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  const monthlyInterest = calculateMonthlyInterest(amount, interestRate);
  return monthlyInterest * months;
}

/**
 * Determines if a fixed deposit is matured based on maturity date
 */
export function isMatured(maturityDate: string): boolean {
  const today = new Date();
  const maturity = new Date(maturityDate);
  return maturity <= today;
}
