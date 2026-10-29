/**
 * Interface for monthly expense details
 */
export interface IMonthlyExpense {
  amount: number;
  comment?: string;
  columnIndex: number; // Useful for potential future features like editing expenses
}

export interface IMonthlyExpenseRow {
  data: string[]; // [date, inHand, additionalPayment, totalExpense, remainder]
  originalRowIndex: number;
}

export interface IUpdateExpenseRequest {
  rowIndex: number;
  columnIndex: number;
  amount: number;
  comment?: string;
}

export interface IDeleteExpenseRequest {
  rowIndex: number;
  columnIndex: number;
}
