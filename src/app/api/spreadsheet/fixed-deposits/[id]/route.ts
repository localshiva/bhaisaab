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
  context: { params: Promise<{ id: number }> },
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

    // Call service to delete the fixed deposit
    await deleteFixedDeposit(id);

    // Return success regardless of whether the record existed
    return NextResponse.json({
      success: true,
      message: "Fixed deposit deleted successfully",
    });
  } catch (error) {
    return getServerError(error);
  }
}
