import { monthlyExpenseQueryKey } from "@bhaisaab/features/monthly-expenses/_shared/constants/query-keys";
import { IMonthlyExpense } from "@bhaisaab/features/monthly-expenses/_shared/types/monthly-expenses";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook for fetching monthly expenses
 */
export function useMonthlyExpense(rowIndex: number, enabled = true) {
  return useQuery({
    queryKey: monthlyExpenseQueryKey(rowIndex),
    queryFn: async () => {
      const { data } = await httpClient.get<IResponse<IMonthlyExpense[]>>(
        `/spreadsheet/monthly-expenses/expense?rowIndex=${rowIndex}`,
      );
      return data.data;
    },
    // Don't fetch if rowIndex is invalid
    enabled: rowIndex > 0 && enabled,
    meta: {
      toast: true,
    },
  });
}
