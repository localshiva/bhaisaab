import { getSpreadsheetInfo } from "@bhaisaab/shared/services/spreadsheet/spreadsheet-info";
import { getServerError } from "@bhaisaab/shared/utils/error";
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
    return getServerError(error);
  }
}
