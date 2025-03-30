import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";
import { sheets_v4 } from "googleapis";

/**
 * Gets information about the spreadsheet including sheet names
 */
export async function getSpreadsheetInfo(): Promise<sheets_v4.Schema$Spreadsheet> {
  // Create the Google Sheets client
  const sheetsClient = await createSheetsClient();

  // Get the configured spreadsheet ID
  const { spreadsheetId } = googleServiceConfig;

  // Fetch the spreadsheet metadata
  const response = await sheetsClient.spreadsheets.get({
    spreadsheetId,
    fields: "properties.title,sheets.properties(sheetId,title)",
  });

  if (!response.data) {
    throw new Error("No spreadsheet data returned");
  }

  return response.data;
}
