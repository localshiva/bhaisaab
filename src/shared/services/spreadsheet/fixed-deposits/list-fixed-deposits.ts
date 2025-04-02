// @bhaisaab/shared/services/spreadsheet/fixed-deposits/list.ts
import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";

import { FD_SHEET_NAME } from "./shared";

/**
 * Fetches all fixed deposits from the spreadsheet
 *
 * @returns An array of fixed deposits with headers
 */
export async function listFixedDeposits(): Promise<string[][]> {
  try {
    // Create the Google Sheets client
    const sheetsClient = await createSheetsClient();

    // Get the configured spreadsheet ID
    const { spreadsheetId } = googleServiceConfig;

    // Fetch the data from the spreadsheet
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${FD_SHEET_NAME}!A1:D`,
    });

    // Return the values or an empty array if none found
    return response.data.values ?? [];
  } catch (error) {
    console.error("Error fetching fixed deposits data:", error);
    throw error;
  }
}
