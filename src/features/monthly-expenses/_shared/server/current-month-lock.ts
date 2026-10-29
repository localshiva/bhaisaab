import "server-only";

import { isCurrentIndiaMonth } from "@bhaisaab/features/monthly-expenses/_shared/utils/current-month";
import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";
import { NextResponse } from "next/server";

import { MONTHLY_EXPENSE_SHEET_NAME } from "./monthly-expense-sheet";

/**
 * Whether a month row is today's month in India time.
 *
 * Reads column A of the row as displayed text,
 * the same text the month list shows.
 *
 * @param rowIndex 1-based sheet row of the month.
 */
export async function isRowCurrentMonth(rowIndex: number): Promise<boolean> {
  const sheetsClient = await createSheetsClient();
  const { spreadsheetId } = googleServiceConfig;

  const response = await sheetsClient.spreadsheets.values.get({
    spreadsheetId,
    range: `${MONTHLY_EXPENSE_SHEET_NAME}!A${rowIndex}`,
  });

  const monthText = response.data.values?.[0]?.[0] as string | undefined;

  return isCurrentIndiaMonth(monthText);
}

/**
 * The 403 answer a write endpoint gives for a month that is not current.
 * The endpoint writes nothing before returning it.
 */
export function getLockedMonthResponse() {
  return NextResponse.json(
    {
      success: false,
      error: "Only the current month can be changed.",
    },
    { status: 403 },
  );
}
