import { deleteFixedDeposit } from "@bhaisaab/features/fixed-deposits/_shared/server/delete-fixed-deposit";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";

/**
 * Deletes the FD Report row at the 0-based sheet row given as `id`.
 *
 * The id is a row position, not a stable key. So, it must come from
 * a list fetched after the last delete.
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

    if (!Number.isInteger(rowId) || rowId < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Fixed deposit ID should be a row number",
        },
        { status: 400 },
      );
    }

    await deleteFixedDeposit(rowId);

    return NextResponse.json({
      success: true,
      message: "Fixed deposit deleted successfully",
    });
  } catch (error) {
    return getServerError(error);
  }
}
