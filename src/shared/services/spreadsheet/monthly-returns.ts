import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import {
  AddSourceRequest,
  DeleteSourceRequest,
} from "@bhaisaab/shared/constants/validation/monthly-returns";
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
export async function addMonthlyIncomeSource(
  sourceData: AddSourceRequest,
): Promise<boolean> {
  console.info("🚀 ~ sourceData:", sourceData);
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // First, get the current month's sheet or create it if it doesn't exist
    // Get only the metadata about the sheet to find the row count
    const valuesResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A:A`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const nextRowAfterLast = valuesResponse.data.values?.length
      ? valuesResponse.data.values.length + 1
      : 0;

    await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A${nextRowAfterLast}:C${nextRowAfterLast}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[sourceData.type, sourceData.source, sourceData.amount]],
      },
    });

    return true;
  } catch (error) {
    console.error("Error adding source:", error);
    throw error;
  }
}

/**
 * Deletes a source from the monthly returns sheet by row ID
 *
 * @param deleteData Data identifying which source to delete
 * @returns Boolean indicating success
 */
export async function deleteMonthlyIncomeSource(
  deleteData: DeleteSourceRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // Get the sheet ID needed for the deleteRows request
    const spreadsheetInfo = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [SHEET_NAME], // This filters to just this sheet
      fields: "sheets.properties(sheetId,title)",
    });

    const sheetId = spreadsheetInfo.data.sheets?.[0]?.properties?.sheetId;

    if (sheetId === undefined) {
      throw new Error(`Sheet ${SHEET_NAME} not found`);
    }

    // We need to get the actual values to verify we're deleting the right row
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A${deleteData.id + 1}:C${deleteData.id + 1}`,
    });

    const rowValue = response.data.values?.[0];

    if (!rowValue) {
      throw new Error("Row not found");
    }

    if (rowValue[1] !== deleteData.source) {
      throw new Error("Income Source does not match");
    }

    // Don't empty but instead delete the entire row
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: deleteData.id,
                endIndex: deleteData.id + 1,
              },
            },
          },
        ],
      },
    });

    return true;
  } catch (error) {
    console.error("Error deleting source:", error);
    throw error;
  }
}
