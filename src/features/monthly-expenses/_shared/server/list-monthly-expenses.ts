import "server-only";

import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import { MONTHLY_EXPENSE_SHEET_NAME } from "./monthly-expense-sheet";

/**
 * Reads a range as formatted strings, or an empty array when it is empty.
 *
 * @param range A1 notation including the sheet name, e.g. "Sheet1!A1:Z".
 */
export async function fetchMonthlyExpensesData(
  range: string,
): Promise<string[][]> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values ?? [];
  } catch (error) {
    console.error("Error fetching loans data:", error);
    throw error;
  }
}

/**
 * Reads columns A to E of the Monthly Expense sheet, header row first.
 * Each row is [date, inHand, additionalPayment, totalExpense, remainder].
 */
export async function getAllMonthlyExpenses(): Promise<string[][]> {
  const range = `${MONTHLY_EXPENSE_SHEET_NAME}!A1:E`;
  return fetchMonthlyExpensesData(range);
}
