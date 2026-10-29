import { getAllMonthlyExpenses } from "@bhaisaab/features/monthly-expenses/_shared/server/list-monthly-expenses";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextResponse } from "next/server";

/**
 * Lists every month in the Monthly Expense sheet, newest first.
 *
 * Each row carries its 1-based sheet row index,
 * which the expense and additional payment routes use to address that month.
 */
export async function GET() {
  try {
    const values = await getAllMonthlyExpenses();

    if (values.length === 0) {
      return NextResponse.json({
        success: true,
        data: { rows: [], headers: [] },
      });
    }

    const rowsWithIndex = values
      .slice(1)
      .map((row, index) => ({
        data: row,
        originalRowIndex: index + 2, // +2 for header row and 1-based indexing
      }))
      .reverse();

    return NextResponse.json({
      success: true,
      data: {
        headers: values[0],
        rows: rowsWithIndex,
      },
    });
  } catch (error) {
    return getServerError(error);
  }
}
