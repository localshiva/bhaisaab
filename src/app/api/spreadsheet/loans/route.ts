import { AddLoanSchema } from "@bhaisaab/shared/constants/validation/loans";
import { addLoan } from "@bhaisaab/shared/services/spreadsheet/loan/create-loan";
import { getAllLoans } from "@bhaisaab/shared/services/spreadsheet/loan/list-loan";
import { getServerError } from "@bhaisaab/shared/utils/error";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler for fetching loans data
 */
export async function GET() {
  try {
    // Get loans data using the service
    const values = await getAllLoans();

    if (values.length === 0) {
      return NextResponse.json({
        success: true,
        data: { rows: [], headers: [] },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        headers: values[0],
        rows: values.slice(1),
      },
    });
  } catch (error) {
    return getServerError(error);
  }
}

/**
 * POST handler for adding a new loan
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = (await request.json()) as unknown;

    // Validate against schema
    const result = AddLoanSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "The loan data you provided is invalid",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    // Call service to add the loan
    const success = await addLoan(result.data);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add loan",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success,
      message: "Loan added successfully",
    });
  } catch (error) {
    // Return appropriate error response
    return getServerError(error);
  }
}
