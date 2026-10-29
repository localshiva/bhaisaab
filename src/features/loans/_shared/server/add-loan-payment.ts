import "server-only";

import { IAddLoanPaymentRequest } from "@bhaisaab/features/loans/_shared/types/loans";
import { columnIndexToLetter } from "@bhaisaab/shared/server/spreadsheet/column-index-to-letter";
import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import { LOAN_REPORT_SHEET_NAME } from "./loan-report-sheet";

/**
 * Writes the payment into the first empty cell from column E onwards
 * of the loan's row. Column C's formula then picks it up as paid.
 *
 * Returns false, and writes nothing, when the amount is more than
 * the loan's pending amount in column D.
 */
export async function addLoanPayment(
  paymentData: IAddLoanPaymentRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    const { rowIndex } = paymentData;

    const rowResponse = await sheetsClient.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: [
        `${LOAN_REPORT_SHEET_NAME}!D${rowIndex}`,
        `${LOAN_REPORT_SHEET_NAME}!E${rowIndex}:ZZZ${rowIndex}`,
      ],
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const [pendingRange, paymentsRange] = rowResponse.data.valueRanges ?? [];

    // An empty or non-numeric pending cell counts as nothing left to pay.
    const pendingAmount = Number(pendingRange?.values?.[0]?.[0]) || 0;

    if (paymentData.amount > pendingAmount) {
      return false;
    }

    const rowValues = paymentsRange?.values?.[0] ?? [];

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

    const columnLetter = columnIndexToLetter(nextEmptyColumnIndex);

    await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: `${LOAN_REPORT_SHEET_NAME}!${columnLetter}${rowIndex}`,
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
