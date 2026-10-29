import "server-only";

import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import { LOAN_REPORT_SHEET_NAME } from "./loan-report-sheet";

/**
 * Appends a loan row to the Loan Report sheet.
 *
 * Columns A and B get the provider and amount. Column C gets a formula
 * that sums the payments from column E onwards, and column D gets the
 * pending amount (B - C).
 */
export async function addLoan(loanData: {
  provider: string;
  amount: number;
}): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    const valuesResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${LOAN_REPORT_SHEET_NAME}!A:A`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const nextRowAfterLast = valuesResponse.data.values?.length
      ? valuesResponse.data.values.length + 1
      : 2; // Row 1 is the header.

    await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: `${LOAN_REPORT_SHEET_NAME}!A${nextRowAfterLast}:B${nextRowAfterLast}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[loanData.provider, loanData.amount]],
      },
    });

    const spreadsheetInfo = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [LOAN_REPORT_SHEET_NAME],
      fields: "sheets.properties(sheetId,title)",
    });

    const sheetId = spreadsheetInfo.data.sheets?.[0]?.properties?.sheetId;

    if (sheetId === undefined || sheetId === null) {
      throw new Error(`Sheet ${LOAN_REPORT_SHEET_NAME} not found`);
    }

    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateCells: {
              range: {
                sheetId,
                startRowIndex: nextRowAfterLast - 1, // 0-based
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
                        formulaValue: `=SUM(E${nextRowAfterLast}:ZZZ${nextRowAfterLast})`,
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
