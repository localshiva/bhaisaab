import { sheets_v4 } from "googleapis";

export const deleteSingleRow = async (
  sheetsClient: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetId: number,
  rowId: number,
) =>
  sheetsClient.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowId,
              endIndex: rowId + 1,
            },
          },
        },
      ],
    },
  });
