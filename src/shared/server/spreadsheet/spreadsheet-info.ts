import "server-only";

import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";
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
