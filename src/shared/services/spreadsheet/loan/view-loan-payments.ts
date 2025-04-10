// @bhaisaab/shared/services/spreadsheet/loan/view-loan-payments.ts
import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";

import { LOAN_REPORT_SHEET_NAME } from "./shared";

/**
 * Interface for the loan payments request
 */
export interface ILoanPaymentsRequest {
  rowIndex: number; // The row index (1-based) of the loan to view payments for
}

/**
 * Interface for loan payment details
 */
export interface ILoanPayment {
  amount: number;
  columnIndex: number; // Useful for potential future features like editing payments
}

/**
 * Fetches all payments for a specific loan
 *
 * @param requestData Data identifying which loan to fetch payments for
 * @returns Array of payment amounts
 */
export async function getLoanPayments(
  requestData: ILoanPaymentsRequest,
): Promise<ILoanPayment[]> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // Fetch the row with payment data (starting from column E)
    const rowResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${LOAN_REPORT_SHEET_NAME}!E${requestData.rowIndex}:ZZZ${requestData.rowIndex}`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const rowValues = rowResponse.data.values?.[0] ?? [];
    const payments: ILoanPayment[] = [];

    // Process each cell to find payments (non-empty cells)
    for (const [index, value] of rowValues.entries()) {
      if (value !== null && value !== undefined && value !== "") {
        // Add payment with its amount and column index (E is 4 in 0-based index)
        payments.push({
          amount: Number(value),
          columnIndex: index + 4, // +4 because we start from column E (index 4)
        });
      }
    }

    return payments;
  } catch (error) {
    console.error("Error fetching loan payments:", error);
    throw error;
  }
}
