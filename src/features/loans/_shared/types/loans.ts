/**
 * Interface for the loan payment request
 */
export interface IAddLoanPaymentRequest {
  rowIndex: number; // The row index (1-based) of the loan to add payment for
  amount: number; // The payment amount
}

/**
 * Interface for the loan deletion request
 */
export interface IDeleteLoanRequest {
  rowIndex: number; // The row index (1-based) of the loan to delete
}

export type ILoanRow = string[];

/**
 * Interface for loan payment details
 */
export interface ILoanPayment {
  amount: number;
  columnIndex: number;
}
