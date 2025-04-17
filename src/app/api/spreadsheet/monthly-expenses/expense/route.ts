import { AddMonthlyExpenseSchema } from "@bhaisaab/shared/constants/validation/monthly-expenses";
import { addMonthlyExpense } from "@bhaisaab/shared/services/spreadsheet/monthly-expenses/add-expense";
import { getMonthlyExpenses } from "@bhaisaab/shared/services/spreadsheet/monthly-expenses/get-expenses";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

// Simple schema for validating the rowIndex parameter
const MonthlyExpenseSchema = z.object({
  rowIndex: z.number().int().positive(),
});

/**
 * GET handler for fetching monthly expenses
 */
export async function GET(request: NextRequest) {
  try {
    // Get the rowIndex from the query string
    const searchParams = request.nextUrl.searchParams;
    const rowIndex = searchParams.get("rowIndex");

    if (!rowIndex) {
      return NextResponse.json(
        {
          success: false,
          error: "Row index is required",
        },
        { status: 400 },
      );
    }

    // Validate the rowIndex
    const result = MonthlyExpenseSchema.safeParse({
      rowIndex: Number.parseInt(rowIndex, 10),
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid row index",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    // Fetch the expense data
    const expenses = await getMonthlyExpenses(result.data);

    return NextResponse.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    return getServerError(error);
  }
}
