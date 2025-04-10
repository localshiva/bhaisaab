// @bhaisaab/app/api/spreadsheet/loans/payment/route.ts
import {
  AddLoanPaymentSchema,
  LoanPaymentsSchema,
} from "@bhaisaab/shared/constants/validation/loans";
import { addLoanPayment } from "@bhaisaab/shared/services/spreadsheet/loan/add-loan-payment";
import { getLoanPayments } from "@bhaisaab/shared/services/spreadsheet/loan/view-loan-payments";
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

/**
 * GET handler for fetching loan payments
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
    const result = LoanPaymentsSchema.safeParse({
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

    // Fetch the payments data
    const payments = await getLoanPayments(result.data);

    return NextResponse.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    return getServerError(error);
  }
}
