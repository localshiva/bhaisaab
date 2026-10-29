/**
 * React Query keys shared by the loan hooks, so that a mutation
 * can invalidate the queries it affects.
 */
export const loansQueryKey = ["loans"];

/**
 * Prefix of every loan's payments key. Matching on it reaches the
 * payments of all loans at once.
 */
export const allLoanPaymentsQueryKey = ["loanPayments"];

export const loanPaymentsQueryKey = (rowIndex: number) => [
  ...allLoanPaymentsQueryKey,
  rowIndex,
];
