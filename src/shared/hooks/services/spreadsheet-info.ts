// @bhaisaab/shared/hooks/use-spreadsheet-info.ts
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

interface ISpreadsheetInfoResponse {
  success: boolean;
  data: ISpreadsheetInfo;
  error?: string;
}

export const spreadsheetInfoQueryKey = ["spreadsheetInfo"];

export function useSpreadsheetInfo() {
  return useQuery<ISpreadsheetInfoResponse>({
    queryKey: [spreadsheetInfoQueryKey],
    queryFn: async () => {
      const { data } =
        await httpClient.get<ISpreadsheetInfoResponse>("/spreadsheet/info");
      return data;
    },
    meta: {
      toast: true,
    },
  });
}
