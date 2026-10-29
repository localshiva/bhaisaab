import { monthlyReturnsQueryKey } from "@bhaisaab/features/monthly-returns/_shared/constants/query-keys";
import { AddSourceRequest } from "@bhaisaab/features/monthly-returns/_shared/schemas/monthly-returns";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Appends an income source row to the Monthly Returns sheet.
 *
 * On success it invalidates the monthly returns list.
 */
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
