// @bhaisaab/shared/services/spreadsheet/loan/add-payment.ts
import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";

import { LOAN_REPORT_SHEET_NAME } from "./shared";

/**
 * Interface for the loan payment request
 */
export interface IAddLoanPaymentRequest {
  rowIndex: number; // The row index (1-based) of the loan to add payment for
  amount: number; // The payment amount
}

/**
 * Adds a payment to an existing loan
 *
 * @param paymentData Data for the new payment to be added
 * @returns Boolean indicating success
 */
export async function addLoanPayment(
  paymentData: IAddLoanPaymentRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // First, get the current row data to find the next empty cell for payment
    const rowResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${LOAN_REPORT_SHEET_NAME}!E${paymentData.rowIndex}:IV${paymentData.rowIndex}`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    // Find the next empty cell in the row
    const rowValues = rowResponse.data.values?.[0] ?? [];

    // Count non-empty cells to determine the next column
    let filledCellCount = 0;
    for (const value of rowValues) {
      if (value !== null && value !== undefined && value !== "") {
        filledCellCount += 1;
      } else {
        break; // Stop at the first empty cell
      }
    }

    // E is the 5th column (index 4), so we add filledCellCount to get the next empty column
    const nextEmptyColumnIndex = 4 + filledCellCount;

    // Convert column index to A1 notation (0 = A, 1 = B, etc.)
    const columnLetter = String.fromCodePoint(65 + nextEmptyColumnIndex); // 65 is ASCII for 'A'

    // Update the cell with the payment amount
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: `${LOAN_REPORT_SHEET_NAME}!${columnLetter}${paymentData.rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[paymentData.amount]],
      },
    });

    return true;
  } catch (error) {
    console.error("Error adding loan payment:", error);
    throw error;
  }
}
