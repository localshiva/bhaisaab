import { AddMonthlyExpenseSchema } from "@bhaisaab/shared/constants/validation/monthly-expenses";
import { addMonthlyExpense } from "@bhaisaab/shared/services/spreadsheet/monthly-expenses/add-expense";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler for adding an expense with a note to a monthly record
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = (await request.json()) as unknown;

    // Validate against schema
    const result = AddMonthlyExpenseSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "The expense data you provided is invalid",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    // Call service to add the expense
    const success = await addMonthlyExpense(result.data);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add expense",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense added successfully",
    });
  } catch (error) {
    // Return appropriate error response
    return getServerError(error);
  }
}
