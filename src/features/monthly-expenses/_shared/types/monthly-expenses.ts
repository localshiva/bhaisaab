/** One expense cell in a month's row. The comment is the cell's note. */
export interface IMonthlyExpense {
  amount: number;
  comment?: string;
  columnIndex: number; // 0-based sheet column, used to edit or delete the cell
}

/** One month's expenses, as the expense route returns them. */
export interface IMonthlyExpenseDetails {
  isCurrentMonth: boolean; // whether the month accepts changes
  expenses: IMonthlyExpense[];
}

/** A month row as listed by the monthly expenses route. */
export interface IMonthlyExpenseRow {
  data: string[]; // [date, inHand, additionalPayment, totalExpense, remainder]
  originalRowIndex: number; // 1-based sheet row
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
