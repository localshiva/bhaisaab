/**
 * React Query keys shared by the loan hooks, so that a mutation
 * can invalidate the queries it affects.
 */
export const loansQueryKey = ["loans"];

export const loanPaymentsQueryKey = (rowIndex: number) => [
  "loanPayments",
  rowIndex,
];
