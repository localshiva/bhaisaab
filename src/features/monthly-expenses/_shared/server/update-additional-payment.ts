import "server-only";

import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import { MONTHLY_EXPENSE_SHEET_NAME } from "./monthly-expense-sheet";

export interface IUpdateAdditionalPaymentRequest {
  rowIndex: number; // 1-based sheet row of the month
  amount: number;
}

/**
 * Writes the amount into column C (Additional Payment) of the month's row,
 * replacing any value already there.
 */
export async function updateAdditionalPayment(
  updateData: IUpdateAdditionalPaymentRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    const ADDITIONAL_PAYMENT_COLUMN = "C";

    await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: `${MONTHLY_EXPENSE_SHEET_NAME}!${ADDITIONAL_PAYMENT_COLUMN}${updateData.rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[updateData.amount]],
      },
    });

    return true;
  } catch (error) {
    console.error("Error updating additional payment:", error);
    throw error;
  }
}
