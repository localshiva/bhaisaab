import {
  monthlyExpenseQueryKey,
  monthlyExpensesQueryKey,
} from "@bhaisaab/features/monthly-expenses/_shared/constants/query-keys";
import { AddMonthlyExpenseRequest } from "@bhaisaab/features/monthly-expenses/_shared/schemas/monthly-expenses";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Adds an expense, with an optional comment, to a month's row.
 *
 * On success it invalidates the month list and that month's expenses.
 */
export function useAddMonthlyExpense() {
  const queryClient = useQueryClient();

  const mutation = useMutation<IResponse, Error, AddMonthlyExpenseRequest>({
    mutationFn: async (paymentData: AddMonthlyExpenseRequest) => {
      const { data } = await httpClient.post<IResponse>(
        "/spreadsheet/monthly-expenses/expense",
        paymentData,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: monthlyExpensesQueryKey });
      void queryClient.invalidateQueries({
        queryKey: monthlyExpenseQueryKey(variables.rowIndex),
      });
    },
    meta: {
      toast: true,
    },
  });

  return {
    addPayment: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
