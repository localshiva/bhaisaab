/**
 * Interface for monthly expense details
 */
export interface IMonthlyExpense {
  amount: number;
  comment?: string;
  columnIndex: number; // Useful for potential future features like editing expenses
}
