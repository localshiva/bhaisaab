import "server-only";

import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import { FD_SHEET_NAME } from "./fd-report-sheet";

/**
 * Returns columns A to D of the FD Report sheet, header row first.
 */
export async function listFixedDeposits(): Promise<string[][]> {
  try {
    const sheetsClient = await createSheetsClient();

    const { spreadsheetId } = googleServiceConfig;

    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${FD_SHEET_NAME}!A1:D`,
    });

    return response.data.values ?? [];
  } catch (error) {
    console.error("Error fetching fixed deposits data:", error);
    throw error;
  }
}
