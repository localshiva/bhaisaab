import {
  AddSourceSchema,
  DeleteSourceSchema,
} from "@bhaisaab/shared/constants/validation/monthly-returns";
import {
  addMonthlyIncomeSource,
  deleteMonthlyIncomeSource,
  getAllMonthlyReturns,
} from "@bhaisaab/shared/services/spreadsheet/monthly-returns";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";

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
    return getServerError(error);
  }
}

/**
 * POST handler for adding a new source to the monthly returns
 * This is an idempotent operation - if the same source is added multiple times,
 * it will only be added once to the current month's sheet
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = (await request.json()) as unknown;

    // Validate against schema
    const result = AddSourceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "The income data you provided is invalid",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    // Call service to add the source
    const success = await addMonthlyIncomeSource(result.data);

    if (!success) {
      // status and error message
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add source",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success,
      message: "Source added successfully",
    });
  } catch (error) {
    // Return appropriate error response
    return getServerError(error);
  }
}

/**
 * DELETE handler for removing a source from monthly returns
 */
export async function DELETE(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = (await request.json()) as unknown;

    // Validate against schema
    const result = DeleteSourceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "The delete request data you provided is invalid",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    // Call service to delete the source
    const success = await deleteMonthlyIncomeSource(result.data);

    if (!success) {
      // status and error message
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete source",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success,
      message: "Source deleted successfully",
    });
  } catch (error) {
    return getServerError(error);
  }
}
