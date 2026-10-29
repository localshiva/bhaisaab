import {
  monthlyExpenseQueryKey,
  monthlyExpensesQueryKey,
} from "@bhaisaab/features/monthly-expenses/_shared/constants/query-keys";
import { IUpdateExpenseRequest } from "@bhaisaab/features/monthly-expenses/_shared/types/monthly-expenses";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Overwrites one expense's amount and note.
 *
 * On success it invalidates the month list and that month's expenses.
 */
export function useExpenseEdit() {
  const queryClient = useQueryClient();

  const mutation = useMutation<IResponse, Error, IUpdateExpenseRequest>({
    mutationFn: async (data: IUpdateExpenseRequest) => {
      const { data: responseData } = await httpClient.put<IResponse>(
        "/spreadsheet/monthly-expenses/expense",
        data,
      );
      return responseData;
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
    updateExpense: mutation.mutate,
    updateExpenseAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
