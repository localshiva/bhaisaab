// app/api/spreadsheet/fixed-deposits/[id]/route.ts
import { deleteFixedDeposit } from "@bhaisaab/shared/services/spreadsheet/fixed-deposits/delete-fixed-deposit";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";

/**
 * DELETE handler for removing a fixed deposit by ID
 * Designed to be idempotent - returns success even if record doesn't exist
 */
export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Fixed deposit ID is required",
        },
        { status: 400 },
      );
    }

    const rowId = Number(id);

    if (typeof rowId !== "number") {
      return NextResponse.json(
        {
          success: false,
          error: "Fixed deposit ID should be a row number",
        },
        { status: 400 },
      );
    }

    // Call service to delete the fixed deposit
    // id is a string when we recieve it from param, so convert to number
    await deleteFixedDeposit(rowId);

    // Return success regardless of whether the record existed
    return NextResponse.json({
      success: true,
      message: "Fixed deposit deleted successfully",
    });
  } catch (error) {
    return getServerError(error);
  }
}
