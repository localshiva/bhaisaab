// @bhaisaab/shared/utils/currency.ts

/**
 * Formats a number as Indian Rupees
 *
 * @param amount Number to format
 * @returns Formatted currency string with ₹ symbol
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0, // Don't show decimals if they're zeros
  }).format(amount);
}
