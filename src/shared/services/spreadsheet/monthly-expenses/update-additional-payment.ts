// @bhaisaab/shared/services/spreadsheet/monthly-expense/update-additional-payment.ts
import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";

import { MONTHLY_EXPENSE_SHEET_NAME } from "./shared";

/**
 * Interface for updating the additional payment column
 */
export interface IUpdateAdditionalPaymentRequest {
  rowIndex: number; // The row index of the month
  amount: number; // Amount to add as additional payment
}

/**
 * Updates the additional payment for a specific month
 * Column C holds the Additional Payment value
 *
 * @param updateData Data for updating the additional payment
 * @returns Boolean indicating success
 */
export async function updateAdditionalPayment(
  updateData: IUpdateAdditionalPaymentRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // Additional Payment is in column C
    const ADDITIONAL_PAYMENT_COLUMN = "C";

    // Update the cell with the additional payment amount
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
