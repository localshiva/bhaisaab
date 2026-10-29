import {
  AddSourceSchema,
  DeleteSourceSchema,
} from "@bhaisaab/features/monthly-returns/_shared/schemas/monthly-returns";
import {
  addMonthlyIncomeSource,
  deleteMonthlyIncomeSource,
  getAllMonthlyReturns,
} from "@bhaisaab/features/monthly-returns/_shared/server/monthly-returns";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";

/**
 * Lists the Monthly Returns sheet with the header row split out.
 * Rows keep sheet order, so list index i is 0-based sheet row i + 1.
 */
export async function GET() {
  try {
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
 * Appends an income source as a new row below the last filled row.
 * It does not check for duplicates.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;

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

    await addMonthlyIncomeSource(result.data);

    return NextResponse.json({
      success: true,
      message: "Source added successfully",
    });
  } catch (error) {
    return getServerError(error);
  }
}

/**
 * Deletes a source's row from the sheet.
 * It fails if the named row holds a different source than the request.
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;

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

    await deleteMonthlyIncomeSource(result.data);

    return NextResponse.json({
      success: true,
      message: "Source deleted successfully",
    });
  } catch (error) {
    return getServerError(error);
  }
}
