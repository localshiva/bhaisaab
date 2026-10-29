import { AddAdditionalPaymentSchema } from "@bhaisaab/features/monthly-expenses/_shared/schemas/monthly-expenses";
import {
  getLockedMonthResponse,
  isRowCurrentMonth,
} from "@bhaisaab/features/monthly-expenses/_shared/server/current-month-lock";
import { updateAdditionalPayment } from "@bhaisaab/features/monthly-expenses/_shared/server/update-additional-payment";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";

/**
 * Writes the additional payment for a month into column C of its row,
 * replacing any value already there.
 *
 * Only the current month accepts it. Any other month gets a 403.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;

    const result = AddAdditionalPaymentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "The payment data you provided is invalid",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    if (!(await isRowCurrentMonth(result.data.rowIndex))) {
      return getLockedMonthResponse();
    }

    const success = await updateAdditionalPayment(result.data);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to set additional payment",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Additional payment saved successfully",
    });
  } catch (error) {
    return getServerError(error);
  }
}
