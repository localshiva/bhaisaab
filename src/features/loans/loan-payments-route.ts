import {
  AddLoanPaymentSchema,
  LoanPaymentsSchema,
} from "@bhaisaab/features/loans/_shared/schemas/loans";
import { addLoanPayment } from "@bhaisaab/features/loans/_shared/server/add-loan-payment";
import { getLoanPayments } from "@bhaisaab/features/loans/_shared/server/view-loan-payments";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";

/**
 * Writes a payment into the next empty payment cell of a loan row.
 *
 * Rejects a payment above the loan's pending amount. The form caps it
 * too, but a direct request can bypass the form.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;

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

    const success = await addLoanPayment(result.data);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment is more than the pending amount.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment added successfully",
    });
  } catch (error) {
    return getServerError(error);
  }
}

/**
 * Lists the payments of the loan at the 1-based `rowIndex` query param.
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

    const payments = await getLoanPayments(result.data);

    return NextResponse.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    return getServerError(error);
  }
}
