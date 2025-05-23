// @bhaisaab/shared/services/spreadsheet/fixed-deposits/delete.ts
import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";

import { deleteSingleRow } from "../delete-single-row";
import { FD_SHEET_NAME } from "./shared";

/**
 * Deletes a fixed deposit from the spreadsheet by ID
 *
 * @param depositId ID of the fixed deposit to delete (typically row number or unique identifier)
 * @returns A boolean indicating success
 */
export async function deleteFixedDeposit(depositId: number): Promise<boolean> {
  try {
    // Create the Google Sheets client
    const sheetsClient = await createSheetsClient();

    // Get the configured spreadsheet ID
    const { spreadsheetId } = googleServiceConfig;

    // Get the sheet ID for operations
    const spreadsheetInfo = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [FD_SHEET_NAME],
      fields: "sheets.properties(sheetId,title)",
    });

    const sheetId = spreadsheetInfo.data.sheets?.[0]?.properties?.sheetId;
    if (sheetId === undefined || sheetId === null) {
      throw new Error(`Sheet ${FD_SHEET_NAME} not found`);
    }

    // Since depositId is directly the row number and sheetId is known to be 1
    // Delete the row using batchUpdate
    await deleteSingleRow(sheetsClient, spreadsheetId, sheetId, depositId);

    return true;
  } catch (error) {
    console.error("Error deleting fixed deposit:", error);
    throw error;
  }
}
