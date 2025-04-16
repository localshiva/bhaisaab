// @bhaisaab/shared/hooks/use-spreadsheet-info.ts
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useQuery } from "@tanstack/react-query";

interface ISheet {
  sheetId: number | null;
  title: string | null;
}

interface ISpreadsheetInfo {
  spreadsheetTitle: string | null;
  sheets: ISheet[];
}

export const spreadsheetInfoQueryKey = ["spreadsheetInfo"];

export function useSpreadsheetInfo() {
  return useQuery<IResponse<ISpreadsheetInfo>>({
    queryKey: [spreadsheetInfoQueryKey],
    queryFn: async () => {
      const { data } =
        await httpClient.get<IResponse<ISpreadsheetInfo>>("/spreadsheet/info");
      return data;
    },
    meta: {
      toast: true,
    },
  });
}
