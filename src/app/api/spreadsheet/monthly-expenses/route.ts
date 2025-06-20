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

    return NextResponse.json({
      success: true,
      data: {
        headers: values[0],
        rows: values.slice(1).reverse(),
      },
    });
  } catch (error) {
    return getServerError(error);
  }
}
