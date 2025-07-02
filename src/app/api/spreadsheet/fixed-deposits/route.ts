// app/api/spreadsheet/fixed-deposits/route.ts
import { CreateFixedDepositSchema } from "@bhaisaab/shared/constants/validation/fixed-deposits";
import { createFixedDeposit } from "@bhaisaab/shared/services/spreadsheet/fixed-deposits/create-fixed-deposit";
import { listFixedDeposits } from "@bhaisaab/shared/services/spreadsheet/fixed-deposits/list-fixed-deposits";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler for fetching all fixed deposits
 */
export async function GET() {
  try {
    // Get fixed deposits data using the service
    const values = await listFixedDeposits();

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
        originalRowIndex: index + 1, // +2 for header row and 1-based indexing
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
 * POST handler for creating a new fixed deposit
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = (await request.json()) as unknown;

    // Validate against schema
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

    // Call service to create the fixed deposit
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
