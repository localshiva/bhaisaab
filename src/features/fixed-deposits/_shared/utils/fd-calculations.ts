/**
 * Simple (not compounded) interest for one month.
 *
 * @param interestRate Annual rate as a percentage, such as 7.5.
 */
export function calculateMonthlyInterest(
  amount: number,
  interestRate: number,
): number {
  return (amount * interestRate) / 1200; // 12 months x 100 percent
}

/**
 * Simple interest over the whole term. The term is counted in whole
 * calendar months, ignoring the day of the month.
 */
export function calculateTotalInterest(
  amount: number,
  interestRate: number,
  depositDate: string,
  maturityDate: string,
): number {
  const startDate = new Date(depositDate);
  const endDate = new Date(maturityDate);

  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  const monthlyInterest = calculateMonthlyInterest(amount, interestRate);
  return monthlyInterest * months;
}

/**
 * True once the maturity date has passed or is today.
 */
export function isMatured(maturityDate: string): boolean {
  const today = new Date();
  const maturity = new Date(maturityDate);
  return maturity <= today;
}
