/**
 * Formats an amount as Indian Rupees with Indian digit grouping,
 * for example ₹1,25,000.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0, // Don't show decimals if they're zeros
  }).format(amount);
}
