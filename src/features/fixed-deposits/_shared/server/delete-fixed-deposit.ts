import "server-only";

import { deleteSingleRow } from "@bhaisaab/shared/server/spreadsheet/delete-single-row";
import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import { FD_SHEET_NAME } from "./fd-report-sheet";

/**
 * Removes a row from the FD Report sheet. The rows below it shift up.
 *
 * @param depositId 0-based sheet row of the deposit, header row included.
 */
export async function deleteFixedDeposit(depositId: number): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();

    const { spreadsheetId } = googleServiceConfig;

    const spreadsheetInfo = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [FD_SHEET_NAME],
      fields: "sheets.properties(sheetId,title)",
    });

    const sheetId = spreadsheetInfo.data.sheets?.[0]?.properties?.sheetId;
    if (sheetId === undefined || sheetId === null) {
      throw new Error(`Sheet ${FD_SHEET_NAME} not found`);
    }

    await deleteSingleRow(sheetsClient, spreadsheetId, sheetId, depositId);

    return true;
  } catch (error) {
    console.error("Error deleting fixed deposit:", error);
    throw error;
  }
}
