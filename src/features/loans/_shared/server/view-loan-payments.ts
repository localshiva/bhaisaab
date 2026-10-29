import "server-only";

import { ILoanPayment } from "@bhaisaab/features/loans/_shared/types/loans";
import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import { LOAN_REPORT_SHEET_NAME } from "./loan-report-sheet";

export interface ILoanPaymentsRequest {
  /** 1-based sheet row of the loan, header row included. */
  rowIndex: number;
}

/**
 * Reads the loan's payment cells from column E onwards and returns the
 * non-empty ones in sheet order.
 */
export async function getLoanPayments(
  requestData: ILoanPaymentsRequest,
): Promise<ILoanPayment[]> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    const rowResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${LOAN_REPORT_SHEET_NAME}!E${requestData.rowIndex}:ZZZ${requestData.rowIndex}`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const rowValues = rowResponse.data.values?.[0] ?? [];
    const payments: ILoanPayment[] = [];

    for (const [index, value] of rowValues.entries()) {
      if (value !== null && value !== undefined && value !== "") {
        payments.push({
          amount: Number(value),
          columnIndex: index + 4, // The range starts at column E.
        });
      }
    }

    return payments;
  } catch (error) {
    console.error("Error fetching loan payments:", error);
    throw error;
  }
}
