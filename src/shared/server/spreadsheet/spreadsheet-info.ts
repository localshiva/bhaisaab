import "server-only";

import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";
import { sheets_v4 } from "googleapis";

/**
 * Fetches only the spreadsheet title and each sheet's ID and title.
 */
export async function getSpreadsheetInfo(): Promise<sheets_v4.Schema$Spreadsheet> {
  const sheetsClient = await createSheetsClient();

  const { spreadsheetId } = googleServiceConfig;

  const response = await sheetsClient.spreadsheets.get({
    spreadsheetId,
    fields: "properties.title,sheets.properties(sheetId,title)",
  });

  if (!response.data) {
    throw new Error("No spreadsheet data returned");
  }

  return response.data;
}
