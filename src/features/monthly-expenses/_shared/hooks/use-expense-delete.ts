import {
  monthlyExpenseQueryKey,
  monthlyExpensesQueryKey,
} from "@bhaisaab/features/monthly-expenses/_shared/constants/query-keys";
import { IDeleteExpenseRequest } from "@bhaisaab/features/monthly-expenses/_shared/types/monthly-expenses";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useExpenseDelete() {
  const queryClient = useQueryClient();

  const mutation = useMutation<IResponse, Error, IDeleteExpenseRequest>({
    mutationFn: async (data: IDeleteExpenseRequest) => {
      const { data: responseData } = await httpClient.delete<IResponse>(
        `/spreadsheet/monthly-expenses/expense?rowIndex=${data.rowIndex}&columnIndex=${data.columnIndex}`,
      );
      return responseData;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch monthly expenses queries
      void queryClient.invalidateQueries({ queryKey: monthlyExpensesQueryKey });
      // Also invalidate the specific month's expenses query
      void queryClient.invalidateQueries({
        queryKey: monthlyExpenseQueryKey(variables.rowIndex),
      });
    },
    meta: {
      toast: true,
    },
  });

  return {
    deleteExpense: mutation.mutate,
    deleteExpenseAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
