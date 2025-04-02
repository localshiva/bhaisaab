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

    // Get the sheet ID for operations
    const spreadsheetInfo = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [FD_SHEET_NAME],
      fields: "sheets.properties(sheetId,title)",
    });

    const sheetId = spreadsheetInfo.data.sheets?.[0]?.properties?.sheetId;
    if (sheetId === undefined) {
      throw new Error(`Sheet ${FD_SHEET_NAME} not found`);
    }

    // Combine all operations into a single batchUpdate call
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          // Update the values
          {
            updateCells: {
              rows: [
                {
                  values: [
                    { userEnteredValue: { numberValue: depositData.amount } },
                    {
                      userEnteredValue: {
                        numberValue: depositData.interestRate,
                      },
                    },
                    {
                      userEnteredValue: {
                        formulaValue: `=DATEVALUE("${depositData.depositDate}")`,
                      },
                    },
                    {
                      userEnteredValue: {
                        formulaValue: `=DATEVALUE("${depositData.maturityDate}")`,
                      },
                    },
                  ],
                },
              ],
              fields:
                "userEnteredValue.numberValue,userEnteredValue.stringValue,userEnteredValue.formulaValue",
              range: {
                sheetId,
                startRowIndex: nextRowAfterLast - 1,
                endRowIndex: nextRowAfterLast,
                startColumnIndex: 0,
                endColumnIndex: 4,
              },
            },
          },
          // Format cell background
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
          // Add protection
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
                description:
                  "Non-editable fixed deposit entry (can be deleted)",
                warningOnly: false,
                editors: {
                  // No editors means no one can edit, not even owner
                  users: [],
                  groups: [],
                  domainUsersCanEdit: false,
                },
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
