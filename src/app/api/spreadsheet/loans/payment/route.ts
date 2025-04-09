// @bhaisaab/app/api/spreadsheet/loans/payment/route.ts
import { AddLoanPaymentSchema } from "@bhaisaab/shared/constants/validation/loans";
import { addLoanPayment } from "@bhaisaab/shared/services/spreadsheet/loan/add-loan-payment";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler for adding a payment to an existing loan
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = (await request.json()) as unknown;

    // Validate against schema
    const result = AddLoanPaymentSchema.safeParse(body);

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

    // Call service to add the payment
    const success = await addLoanPayment(result.data);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add payment",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment added successfully",
    });
  } catch (error) {
    // Return appropriate error response
    return getServerError(error);
  }
}
