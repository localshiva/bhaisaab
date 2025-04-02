// @bhaisaab/shared/services/spreadsheet/fixed-deposits/create.ts
import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { CreateFixedDepositRequest } from "@bhaisaab/shared/constants/validation/fixed-deposits";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";

import { FD_SHEET_NAME } from "./shared";

/**
 * Creates a new fixed deposit in the sheet
 *
 * @param depositData Data for the new fixed deposit to be added
 * @returns Boolean indicating success
 */
export async function createFixedDeposit(
  depositData: CreateFixedDepositRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // Get the current sheet to find the row count
    const valuesResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${FD_SHEET_NAME}!A:A`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    // Determine the next row
    const nextRowAfterLast = valuesResponse.data.values?.length
      ? valuesResponse.data.values.length + 1
      : 2; // Start from row 2 as headers already exist

    // Add the new fixed deposit row with only the 4 required columns
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: `${FD_SHEET_NAME}!A${nextRowAfterLast}:D${nextRowAfterLast}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            depositData.amount,
            depositData.interestRate,
            depositData.depositDate,
            depositData.maturityDate,
          ],
        ],
      },
    });

    // Get the sheet ID for formatting
    const spreadsheetInfo = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [FD_SHEET_NAME],
      fields: "sheets.properties(sheetId,title)",
    });

    const sheetId = spreadsheetInfo.data.sheets?.[0]?.properties?.sheetId;
    if (sheetId === undefined) {
      throw new Error(`Sheet ${FD_SHEET_NAME} not found`);
    }

    // Format the entire row with background color
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: nextRowAfterLast - 1,
                endRowIndex: nextRowAfterLast,
                startColumnIndex: 0,
                endColumnIndex: 4,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.95,
                    green: 0.95,
                    blue: 0.95,
                  },
                },
              },
              fields: "userEnteredFormat(backgroundColor)",
            },
          },
        ],
      },
    });

    // Protect the sheet range separately
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addProtectedRange: {
              protectedRange: {
                range: {
                  sheetId,
                  startRowIndex: nextRowAfterLast - 1,
                  endRowIndex: nextRowAfterLast,
                  startColumnIndex: 0,
                  endColumnIndex: 4,
                },
                description: "Protected fixed deposit entry",
                warningOnly: false,
              },
            },
          },
        ],
      },
    });

    return true;
  } catch (error) {
    console.error("Error creating fixed deposit:", error);
    throw error;
  }
}
