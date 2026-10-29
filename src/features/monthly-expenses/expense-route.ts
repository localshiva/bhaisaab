import { AddMonthlyExpenseSchema } from "@bhaisaab/features/monthly-expenses/_shared/schemas/monthly-expenses";
import { addMonthlyExpense } from "@bhaisaab/features/monthly-expenses/_shared/server/add-expense";
import {
  getLockedMonthResponse,
  isRowCurrentMonth,
} from "@bhaisaab/features/monthly-expenses/_shared/server/current-month-lock";
import { deleteMonthlyExpense } from "@bhaisaab/features/monthly-expenses/_shared/server/delete-monthly-expense";
import { getMonthlyExpenses } from "@bhaisaab/features/monthly-expenses/_shared/server/get-expenses";
import { updateMonthlyExpense } from "@bhaisaab/features/monthly-expenses/_shared/server/update-monthly-expense";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpdateExpenseSchema = z.object({
  rowIndex: z.number().int().positive(),
  columnIndex: z.number().int().min(0),
  amount: z.number().positive(),
  comment: z.string().optional(),
});

const DeleteExpenseSchema = z.object({
  rowIndex: z.number().int().positive(),
  columnIndex: z.number().int().min(0),
});

/**
 * Writes an expense into the first empty cell from column F onward
 * in the month's row, and stores the comment as that cell's note.
 *
 * Only the current month accepts it. Any other month gets a 403.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;

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

    if (!(await isRowCurrentMonth(result.data.rowIndex))) {
      return getLockedMonthResponse();
    }

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
    return getServerError(error);
  }
}

const MonthlyExpenseSchema = z.object({
  rowIndex: z.number().int().positive(),
});

/**
 * Returns the expenses recorded in one month's row, with their notes.
 *
 * `rowIndex` is the 1-based sheet row of the month.
 */
export async function GET(request: NextRequest) {
  try {
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
 * Overwrites one expense cell and replaces its note.
 * A missing comment clears the note.
 *
 * Only the current month accepts it. Any other month gets a 403.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;

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

    if (!(await isRowCurrentMonth(result.data.rowIndex))) {
      return getLockedMonthResponse();
    }

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
 * Clears one expense cell and its note. The cell is emptied, not removed,
 * so the other expenses keep their columns.
 *
 * Only the current month accepts it. Any other month gets a 403.
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

    if (!(await isRowCurrentMonth(result.data.rowIndex))) {
      return getLockedMonthResponse();
    }

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
