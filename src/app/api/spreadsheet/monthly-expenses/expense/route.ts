import { AddMonthlyExpenseSchema } from "@bhaisaab/shared/constants/validation/monthly-expenses";
import { addMonthlyExpense } from "@bhaisaab/shared/services/spreadsheet/monthly-expenses/add-expense";
import { deleteMonthlyExpense } from "@bhaisaab/shared/services/spreadsheet/monthly-expenses/delete-monthly-expense";
import { getMonthlyExpenses } from "@bhaisaab/shared/services/spreadsheet/monthly-expenses/get-expenses";
import { updateMonthlyExpense } from "@bhaisaab/shared/services/spreadsheet/monthly-expenses/update-monthly-expense";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema for PUT request
const UpdateExpenseSchema = z.object({
  rowIndex: z.number().int().positive(),
  columnIndex: z.number().int().min(0),
  amount: z.number().positive(),
  comment: z.string().optional(),
});

// Schema for DELETE request
const DeleteExpenseSchema = z.object({
  rowIndex: z.number().int().positive(),
  columnIndex: z.number().int().min(0),
});

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

/**
 * PUT handler for updating an existing expense
 */
export async function PUT(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = (await request.json()) as unknown;

    // Validate against schema
    const result = UpdateExpenseSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "The expense update data you provided is invalid",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    // Call service to update the expense
    const success = await updateMonthlyExpense(result.data);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update expense",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense updated successfully",
    });
  } catch (error) {
    return getServerError(error);
  }
}

/**
 * DELETE handler for removing an expense
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rowIndex = searchParams.get("rowIndex");
    const columnIndex = searchParams.get("columnIndex");

    if (!rowIndex || !columnIndex) {
      return NextResponse.json(
        {
          success: false,
          error: "Both rowIndex and columnIndex are required",
        },
        { status: 400 },
      );
    }

    // Validate parameters
    const result = DeleteExpenseSchema.safeParse({
      rowIndex: Number.parseInt(rowIndex, 10),
      columnIndex: Number.parseInt(columnIndex, 10),
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid parameters",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    // Call service to delete the expense
    const success = await deleteMonthlyExpense(result.data);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete expense",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    return getServerError(error);
  }
}
