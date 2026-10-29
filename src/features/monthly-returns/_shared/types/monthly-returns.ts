/**
 * One sheet row as the API returns it.
 *
 * Strings in column order, starting `[type, source, amount]`.
 * Trailing empty cells are left out, so a blank row is `[]`.
 */
export type IMonthlyReturnsRow = string[];

/** An income source the page lists, parsed from a row with a usable amount. */
export interface IIncomeSource {
  /** 0-based sheet row, where the header is 0. Sent as the delete id. */
  id: number;
  type: string;
  source: string;
  amount: number;
}
