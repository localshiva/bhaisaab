import "server-only";

import { IAddLoanPaymentRequest } from "@bhaisaab/features/loans/_shared/types/loans";
import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import { LOAN_REPORT_SHEET_NAME } from "./loan-report-sheet";

/**
 * Writes the payment into the first empty cell from column E onwards
 * of the loan's row. Column C's formula then picks it up as paid.
 */
export async function addLoanPayment(
  paymentData: IAddLoanPaymentRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    const rowResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${LOAN_REPORT_SHEET_NAME}!E${paymentData.rowIndex}:ZZZ${paymentData.rowIndex}`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const rowValues = rowResponse.data.values?.[0] ?? [];

    let filledCellCount = 0;
    for (const value of rowValues) {
      if (value !== null && value !== undefined && value !== "") {
        filledCellCount += 1;
      } else {
        break;
      }
    }

    // Payments start at column E, which is 0-based column 4.
    const nextEmptyColumnIndex = 4 + filledCellCount;

    // Only single letters A to Z are produced.
    const columnLetter = String.fromCodePoint(65 + nextEmptyColumnIndex);

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
