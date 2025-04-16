import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";

import { MONTHLY_EXPENSE_SHEET_NAME } from "./shared";

/**
 * Fetches data from the loan report spreadsheet
 *
 * @param range The A1 notation range to fetch (e.g., "Sheet1!A1:Z")
 * @returns The values from the specified range
 */
export async function fetchMonthlyExpensesData(
  range: string,
): Promise<string[][]> {
  try {
    // Create the Google Sheets client
    const sheetsClient = await createSheetsClient();

    // Get the configured spreadsheet ID
    const { spreadsheetId } = googleServiceConfig;

    // Fetch the data from the spreadsheet
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    // Return the values or an empty array if none found
    return response.data.values ?? [];
  } catch (error) {
    console.error("Error fetching loans data:", error);
    throw error;
  }
}

/**
 * Fetches all loans data from the loan report sheet
 *
 * @returns Array of loan data rows
 */
export async function getAllMonthlyExpenses(): Promise<string[][]> {
  const range = `${MONTHLY_EXPENSE_SHEET_NAME}!A1:D`;
  return fetchMonthlyExpensesData(range);
}
