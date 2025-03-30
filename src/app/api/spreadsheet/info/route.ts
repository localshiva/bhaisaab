import { getSpreadsheetInfo } from "@bhaisaab/shared/services/spreadsheet/spreadsheet-info";
import { NextResponse } from "next/server";

/**
 * GET handler for fetching spreadsheet data
 */
export async function GET() {
  try {
    const spreadsheetInfo = await getSpreadsheetInfo();
    return NextResponse.json({
      success: true,
      data: {
        spreadsheetTitle: spreadsheetInfo.properties?.title,
        sheets: spreadsheetInfo.sheets?.map(sheet => ({
          sheetId: sheet.properties?.sheetId,
          title: sheet.properties?.title,
        })),
      },
    });
  } catch (error) {
    console.error("API error:", error);

    // Return appropriate error response
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: (error as { status: number })?.status ?? 500 },
    );
  }
}
