import { AddAdditionalPaymentSchema } from "@bhaisaab/shared/constants/validation/monthly-expenses";
import { updateAdditionalPayment } from "@bhaisaab/shared/services/spreadsheet/monthly-expenses/update-additional-payment";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler for adding an additional payment to a monthly record
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = (await request.json()) as unknown;

    // Validate against schema
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

    // Call service to add the additional payment
    const success = await updateAdditionalPayment(result.data);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add additional payment",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Additional payment added successfully",
    });
  } catch (error) {
    // Return appropriate error response
    return getServerError(error);
  }
}
