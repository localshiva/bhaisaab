import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { AddSourceRequest } from "@bhaisaab/shared/constants/validation/monthly-returns";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";

export const SHEET_NAME = "Monthly Returns";

/**
 * Fetches data from the monthly returns spreadsheet
 *
 * @param range The A2 notation range to fetch (e.g., "Sheet1!A2:Z")
 * @returns The values from the specified range
 */
export async function fetchMonthlyReturnsData(
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
    console.error("Error fetching monthly returns data:", error);
    throw error;
  }
}

export async function getAllMonthlyReturns(): Promise<string[][]> {
  const range = `${SHEET_NAME}!A1:Z`;

  return fetchMonthlyReturnsData(range);
}

/**
 * Adds a new source to the monthly returns sheet
 *
 * @param sourceData Data for the new source to be added
 * @returns Boolean indicating success
 */
export async function addSource(
  sourceData: AddSourceRequest,
): Promise<boolean> {
  console.info("🚀 ~ sourceData:", sourceData);
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // First, get the current month's sheet or create it if it doesn't exist
    // Get only the metadata about the sheet to find the row count
    const sheetMetadata = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [`${SHEET_NAME}!A:A`],
      fields: "sheets(data(rowData))",
    });
    console.info("🚀 ~ sheetMetadata:", sheetMetadata);

    return true;
  } catch (error) {
    console.error("Error adding source:", error);
    throw error;
  }
}
