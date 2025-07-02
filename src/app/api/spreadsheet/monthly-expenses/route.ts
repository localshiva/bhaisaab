import { getAllMonthlyExpenses } from "@bhaisaab/shared/services/spreadsheet/monthly-expenses/list-monthly-expenses";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextResponse } from "next/server";

/**
 * GET handler for fetching loans data
 */
export async function GET() {
  try {
    // Get loans data using the service
    const values = await getAllMonthlyExpenses();

    if (values.length === 0) {
      return NextResponse.json({
        success: true,
        data: { rows: [], headers: [] },
      });
    }

    // Add original row index to each row before reversing
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
