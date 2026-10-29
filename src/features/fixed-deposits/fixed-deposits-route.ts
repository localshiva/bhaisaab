import { CreateFixedDepositSchema } from "@bhaisaab/features/fixed-deposits/_shared/schemas/fixed-deposits";
import { createFixedDeposit } from "@bhaisaab/features/fixed-deposits/_shared/server/create-fixed-deposit";
import { listFixedDeposits } from "@bhaisaab/features/fixed-deposits/_shared/server/list-fixed-deposits";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";

/**
 * Returns the FD Report header row and its deposits, newest first.
 * Each row carries the `originalRowIndex` that the delete route expects.
 */
export async function GET() {
  try {
    const values = await listFixedDeposits();

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
        originalRowIndex: index + 1, // 0-based sheet row; row 0 is the header.
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

/**
 * Validates the body against `CreateFixedDepositSchema` and appends the
 * deposit.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;

    const result = CreateFixedDepositSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "The fixed deposit data you provided is invalid",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    const success = await createFixedDeposit(result.data);

    return NextResponse.json({
      success,
      message: success
        ? "Fixed deposit created successfully"
        : "Failed to create fixed deposit",
    });
  } catch (error) {
    return getServerError(error);
  }
}
