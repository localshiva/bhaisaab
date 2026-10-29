import { monthlyReturnsQueryKey } from "@bhaisaab/features/monthly-returns/_shared/constants/query-keys";
import { AddSourceRequest } from "@bhaisaab/features/monthly-returns/_shared/schemas/monthly-returns";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Hook for adding a new source to monthly returns
export function useAddMonthlyIncomeSource() {
  const queryClient = useQueryClient();

  const mutation = useMutation<IResponse, Error, AddSourceRequest>({
    mutationFn: async (sourceData: AddSourceRequest) => {
      const { data } = await httpClient.post<IResponse>(
        "/spreadsheet/monthly-returns",
        sourceData,
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch monthly returns query after successful mutation
      void queryClient.invalidateQueries({ queryKey: monthlyReturnsQueryKey });
    },
    meta: {
      toast: true,
    },
  });

  return {
    addIncomeSource: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
