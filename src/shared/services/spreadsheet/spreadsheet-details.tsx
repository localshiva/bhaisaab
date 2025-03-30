// @/bhaisaab/shared/services/spreadsheet-service.ts
import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";
import { sheets_v4 } from "googleapis";

/**
 * Fetches data from the configured Google Spreadsheet
 *
 * @param range The A1 notation range to fetch (e.g., "Sheet1!A1:E10")
 * @returns The values from the specified range
 */
export async function fetchSpreadsheetData(
  range: string,
): Promise<unknown[][]> {
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
    console.error("Error fetching spreadsheet data:", error);
    throw error;
  }
}

/**
 * Gets information about the spreadsheet including sheet names
 */
export async function getSpreadsheetInfo(): Promise<sheets_v4.Schema$Spreadsheet> {
  try {
    // Create the Google Sheets client
    const sheetsClient = await createSheetsClient();

    // Get the configured spreadsheet ID
    const { spreadsheetId } = googleServiceConfig;

    // Fetch the spreadsheet metadata
    const response = await sheetsClient.spreadsheets.get({
      spreadsheetId,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching spreadsheet info:", error);
    throw error;
  }
}
