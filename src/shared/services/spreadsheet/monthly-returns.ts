import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";

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
  const range = "Monthly Returns!A1:Z";

  return fetchMonthlyReturnsData(range);
}
