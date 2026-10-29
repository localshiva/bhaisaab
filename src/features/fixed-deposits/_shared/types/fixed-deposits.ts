export interface IFixedDepositRow {
  data: string[]; // [amount, interestRate, depositDate, maturityDate]
  originalRowIndex: number;
}
