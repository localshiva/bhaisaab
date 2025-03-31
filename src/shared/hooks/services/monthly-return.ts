import httpClient from "@bhaisaab/shared/utils/http-client";
import { useQuery } from "@tanstack/react-query";

export type IMonthlyReturnsRow = Record<string, string>;

interface IMonthlyReturnsResponse {
  success: boolean;
  data: {
    headers: string[];
    rows: IMonthlyReturnsRow[];
  };
  error?: string;
}

export const monthlyReturnsQueryKey = ["monthlyReturns"];

export function useMonthlyReturns() {
  return useQuery({
    queryKey: monthlyReturnsQueryKey,
    queryFn: async () => {
      const { data } = await httpClient.get<IMonthlyReturnsResponse>(
        "/spreadsheet/monthly-returns",
      );
      return data.data;
    },
    meta: {
      toast: true,
    },
  });
}
