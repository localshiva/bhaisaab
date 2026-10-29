import "server-only";

import { IDeleteLoanRequest } from "@bhaisaab/features/loans/_shared/types/loans";
import { deleteSingleRow } from "@bhaisaab/shared/server/spreadsheet/delete-single-row";
import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import { LOAN_REPORT_SHEET_NAME } from "./loan-report-sheet";

/**
 * Removes the loan's row from the Loan Report sheet. The rows below it
 * shift up, so client row indexes go stale until the list is refetched.
 */
export async function deleteLoan(
  deleteData: IDeleteLoanRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    const spreadsheetInfo = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [LOAN_REPORT_SHEET_NAME],
      fields: "sheets.properties(sheetId,title)",
    });

    const sheetId = spreadsheetInfo.data.sheets?.[0]?.properties?.sheetId;

    if (sheetId === undefined || sheetId === null) {
      throw new Error(`Sheet ${LOAN_REPORT_SHEET_NAME} not found`);
    }

    await deleteSingleRow(
      sheetsClient,
      spreadsheetId,
      sheetId,
      deleteData.rowIndex,
    );

    return true;
  } catch (error) {
    console.error("Error deleting loan:", error);
    throw error;
  }
}
