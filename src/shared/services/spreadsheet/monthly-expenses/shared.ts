import { clientEnv } from "@bhaisaab/shared/utils/env-vars/client.env";

export const MONTHLY_EXPENSE_SHEET_NAME = clientEnv.isDev
  ? //   ? "Monthly Expenses Test"
    "Monthly Expense"
  : "Monthly Expense";

// Converts 0-based column index to column letter (e.g., 0 -> A, 26 -> AA)
export function columnIndexToLetter(index: number): string {
  let letter = "";
  let temp = index;
  while (temp >= 0) {
    letter = String.fromCodePoint((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}
