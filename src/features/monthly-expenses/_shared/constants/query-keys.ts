/**
 * React Query keys shared by the monthly expense hooks, so that a mutation
 * can invalidate the queries it affects.
 */
export const monthlyExpensesQueryKey = ["monthlyExpenses"];

export const monthlyExpenseQueryKey = (rowIndex: number) => [
  "monthlyExpense",
  rowIndex,
];
