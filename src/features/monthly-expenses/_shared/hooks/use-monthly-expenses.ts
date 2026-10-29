import { monthlyExpensesQueryKey } from "@bhaisaab/features/monthly-expenses/_shared/constants/query-keys";
import { IMonthlyExpenseRow } from "@bhaisaab/features/monthly-expenses/_shared/types/monthly-expenses";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for fetching all loans
 */
export function useMonthlyExpenses() {
  return useQuery({
    queryKey: monthlyExpensesQueryKey,
    queryFn: async () => {
      const { data } = await httpClient.get<
        IResponse<{
          headers: string[];
          rows: IMonthlyExpenseRow[];
        }>
      >("/spreadsheet/monthly-expenses");
      return data.data;
    },
    meta: {
      toast: true,
    },
  });
}
