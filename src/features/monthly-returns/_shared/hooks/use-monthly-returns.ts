import { monthlyReturnsQueryKey } from "@bhaisaab/features/monthly-returns/_shared/constants/query-keys";
import { IMonthlyReturnsRow } from "@bhaisaab/features/monthly-returns/_shared/types/monthly-returns";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches the Monthly Returns sheet.
 * Each row is [type, source, amount], in sheet order.
 */
export function useMonthlyReturns() {
  return useQuery({
    queryKey: monthlyReturnsQueryKey,
    queryFn: async () => {
      const { data } = await httpClient.get<
        IResponse<{
          headers: string[];
          rows: IMonthlyReturnsRow[];
        }>
      >("/spreadsheet/monthly-returns");
      return data.data;
    },
    meta: {
      toast: true,
    },
  });
}
