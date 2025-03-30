import { getAllMonthlyReturns } from "@bhaisaab/shared/services/spreadsheet/monthly-returns";
import { NextResponse } from "next/server";

/**
 * GET handler for fetching monthly returns data
 */
export async function GET() {
  try {
    // Get monthly returns data using the service
    const values = await getAllMonthlyReturns();

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
        rows: values.slice(1),
      },
    });
  } catch (error) {
    console.error("API error fetching monthly returns:", error);

    // Return appropriate error response
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
