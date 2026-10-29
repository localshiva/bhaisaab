export interface IAddLoanPaymentRequest {
  /** 1-based sheet row of the loan, header row included. */
  rowIndex: number;
  amount: number;
}

export interface IDeleteLoanRequest {
  /**
   * 0-based sheet row of the loan, header row included.
   *
   * Unlike the payment requests, this is passed straight to a
   * `deleteDimension` request, which counts rows from 0.
   */
  rowIndex: number;
}

export type ILoanRow = string[];

/**
 * One filled payment cell of a loan row. `columnIndex` is the cell's
 * 0-based sheet column, so the first payment (column E) is 4.
 */
export interface ILoanPayment {
  amount: number;
  columnIndex: number;
}
