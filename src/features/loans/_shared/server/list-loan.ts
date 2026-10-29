import "server-only";

import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import { LOAN_REPORT_SHEET_NAME } from "./loan-report-sheet";

/**
 * @param range A1 notation range, including the sheet name.
 */
export async function fetchLoansData(range: string): Promise<string[][]> {
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
 * Returns columns A to D of the Loan Report sheet, header row first.
 * Payment cells from column E onwards are left out.
 */
export async function getAllLoans(): Promise<string[][]> {
  const range = `${LOAN_REPORT_SHEET_NAME}!A1:D`;
  return fetchLoansData(range);
}
