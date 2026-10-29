import "server-only";

import {
  AddSourceRequest,
  DeleteSourceRequest,
} from "@bhaisaab/features/monthly-returns/_shared/schemas/monthly-returns";
import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

export const SHEET_NAME = "Monthly Returns";

/**
 * An error that `getServerError` answers with `status` and this message,
 * instead of a 500 with a generic message.
 */
function createStatusError(message: string, status: number): Error {
  const error = new Error(message);
  (error as { status?: number }).status = status;

  return error;
}

/**
 * Reads a range as formatted strings, or an empty array when it is empty.
 *
 * @param range A1 notation including the sheet name, e.g. "Sheet1!A1:Z".
 */
export async function fetchMonthlyReturnsData(
  range: string,
): Promise<string[][]> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values ?? [];
  } catch (error) {
    console.error("Error fetching monthly returns data:", error);
    throw error;
  }
}

/**
 * Reads the whole Monthly Returns sheet, header row first.
 * Each row is [type, source, amount].
 */
export async function getAllMonthlyReturns(): Promise<string[][]> {
  const range = `${SHEET_NAME}!A1:Z`;

  return fetchMonthlyReturnsData(range);
}

/**
 * Writes [type, source, amount] into the row below the last filled row.
 *
 * Values go in as RAW, so that the sheet parses nothing.
 * A source such as "=..." or "007" stays text, as typed,
 * and the amount is stored as the number it was sent as.
 *
 * Throws on any failure.
 */
export async function addMonthlyIncomeSource(
  sourceData: AddSourceRequest,
): Promise<void> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // Column A is read only to find the last filled row.
    const valuesResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A:A`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const nextRowAfterLast = valuesResponse.data.values?.length
      ? valuesResponse.data.values.length + 1
      : 2; // Row 1 is the header.

    await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A${nextRowAfterLast}:C${nextRowAfterLast}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[sourceData.type, sourceData.source, sourceData.amount]],
      },
    });
  } catch (error) {
    console.error("Error adding source:", error);
    throw error;
  }
}

/**
 * Deletes the source's A:C cells and shifts the A:C cells below up.
 *
 * It never deletes the whole row, because row 2 also holds the sheet's
 * total formulas in G2:I2, and they would go with the first source.
 *
 * @param deleteData `id` is the 0-based sheet row, where the header is 0.
 *                   `source` must match the row's column B,
 *                   which guards against deleting a row that moved.
 *
 * Throws on any failure.
 */
export async function deleteMonthlyIncomeSource(
  deleteData: DeleteSourceRequest,
): Promise<void> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // deleteRange addresses the sheet by numeric ID, not by name.
    const spreadsheetInfo = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [SHEET_NAME], // Limits the response so sheets[0] is this sheet
      fields: "sheets.properties(sheetId,title)",
    });

    const sheetId = spreadsheetInfo.data.sheets?.[0]?.properties?.sheetId;

    if (sheetId === undefined || sheetId === null) {
      throw new Error(`Sheet ${SHEET_NAME} not found`);
    }

    // A1 rows are 1-based, hence id + 1.
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A${deleteData.id + 1}:C${deleteData.id + 1}`,
    });

    const rowValue = response.data.values?.[0];

    if (!rowValue) {
      throw createStatusError("Row not found", 404);
    }

    if (rowValue[1] !== deleteData.source) {
      throw createStatusError("Income Source does not match", 409);
    }

    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteRange: {
              range: {
                sheetId,
                startRowIndex: deleteData.id,
                endRowIndex: deleteData.id + 1,
                startColumnIndex: 0,
                endColumnIndex: 3,
              },
              shiftDimension: "ROWS",
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error("Error deleting source:", error);
    throw error;
  }
}
