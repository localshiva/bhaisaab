import "server-only";

import { CreateFixedDepositRequest } from "@bhaisaab/features/fixed-deposits/_shared/schemas/fixed-deposits";
import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import { FD_SHEET_NAME } from "./fd-report-sheet";

/**
 * Appends a deposit row to the FD Report sheet in one batch update.
 *
 * Columns A to D get amount, interest rate, deposit date and maturity
 * date. The dates are written as `DATEVALUE` formulas, so the sheet
 * stores real dates, and the new cells get a light grey background.
 */
export async function createFixedDeposit(
  depositData: CreateFixedDepositRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    const valuesResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${FD_SHEET_NAME}!A:A`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const nextRowAfterLast = valuesResponse.data.values?.length
      ? valuesResponse.data.values.length + 1
      : 2; // Row 1 is the header.

    const spreadsheetInfo = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [FD_SHEET_NAME],
      fields: "sheets.properties(sheetId,title)",
    });

    const sheetId = spreadsheetInfo.data.sheets?.[0]?.properties?.sheetId;
    if (sheetId === undefined || sheetId === null) {
      throw new Error(`Sheet ${FD_SHEET_NAME} not found`);
    }

    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
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

    return true;
  } catch (error) {
    console.error("Error creating fixed deposit:", error);
    throw error;
  }
}
