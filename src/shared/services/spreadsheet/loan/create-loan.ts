import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";

import { LOAN_REPORT_SHEET_NAME } from "./shared";

/**
 * Adds a new loan to the loan report sheet and applies formulas
 *
 * @param loanData Data for the new loan to be added
 * @returns Boolean indicating success
 */
export async function addLoan(loanData: {
  provider: string;
  amount: number;
}): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // Get the current data to determine the next row
    const valuesResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${LOAN_REPORT_SHEET_NAME}!A:A`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const nextRowAfterLast = valuesResponse.data.values?.length
      ? valuesResponse.data.values.length + 1
      : 2; // Start at row 2 if sheet is empty (accounting for header row)

    // 1. Add the provider and amount
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: `${LOAN_REPORT_SHEET_NAME}!A${nextRowAfterLast}:B${nextRowAfterLast}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[loanData.provider, loanData.amount]],
      },
    });

    // 2. Get the sheet ID for batch updates
    const spreadsheetInfo = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [LOAN_REPORT_SHEET_NAME],
      fields: "sheets.properties(sheetId,title)",
    });

    const sheetId = spreadsheetInfo.data.sheets?.[0]?.properties?.sheetId;

    if (sheetId === undefined || sheetId === null) {
      throw new Error(`Sheet ${LOAN_REPORT_SHEET_NAME} not found`);
    }

    // 3. Apply the formulas for calculating Paid Amount and Pending Amount
    // We'll use a batch update because it provides more capabilities
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateCells: {
              range: {
                sheetId,
                startRowIndex: nextRowAfterLast - 1, // 0-based index
                endRowIndex: nextRowAfterLast, // exclusive
                startColumnIndex: 2, // Column C (0-based)
                endColumnIndex: 4, // Column E (exclusive)
              },
              rows: [
                {
                  values: [
                    // Column C (Paid Amount)
                    {
                      userEnteredValue: {
                        formulaValue: `=SUM(E${nextRowAfterLast}:IV${nextRowAfterLast})`,
                      },
                    },
                    // Column D (Pending Amount)
                    {
                      userEnteredValue: {
                        formulaValue: `=B${nextRowAfterLast}-C${nextRowAfterLast}`,
                      },
                    },
                  ],
                },
              ],
              fields: "userEnteredValue",
            },
          },
        ],
      },
    });

    return true;
  } catch (error) {
    console.error("Error adding loan:", error);
    throw error;
  }
}
