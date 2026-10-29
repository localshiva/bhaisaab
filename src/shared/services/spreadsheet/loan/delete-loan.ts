// @bhaisaab/shared/services/spreadsheet/loan/delete-loan.ts
import { deleteSingleRow } from "@bhaisaab/shared/server/spreadsheet/delete-single-row";
import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import { LOAN_REPORT_SHEET_NAME } from "./shared";

/**
 * Interface for the loan deletion request
 */
export interface IDeleteLoanRequest {
  rowIndex: number; // The row index (1-based) of the loan to delete
}

/**
 * Deletes a loan from the loan report sheet
 *
 * @param deleteData Data identifying which loan to delete
 * @returns Boolean indicating success
 */
export async function deleteLoan(
  deleteData: IDeleteLoanRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // Get the sheet ID needed for the deleteRows request
    const spreadsheetInfo = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [LOAN_REPORT_SHEET_NAME], // This filters to just this sheet
      fields: "sheets.properties(sheetId,title)",
    });

    const sheetId = spreadsheetInfo.data.sheets?.[0]?.properties?.sheetId;

    if (sheetId === undefined || sheetId === null) {
      throw new Error(`Sheet ${LOAN_REPORT_SHEET_NAME} not found`);
    }

    // Use the existing utility function to delete the row
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
