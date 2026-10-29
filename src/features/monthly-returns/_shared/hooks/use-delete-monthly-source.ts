import { monthlyReturnsQueryKey } from "@bhaisaab/features/monthly-returns/_shared/constants/query-keys";
import { DeleteSourceRequest } from "@bhaisaab/features/monthly-returns/_shared/schemas/monthly-returns";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteMonthlySource() {
  const queryClient = useQueryClient();

  const mutation = useMutation<IResponse, Error, DeleteSourceRequest>({
    mutationFn: async ({ id, source }: DeleteSourceRequest) => {
      const { data } = await httpClient.delete<IResponse>(
        "/spreadsheet/monthly-returns",
        { data: { id, source } },
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch monthly returns query after successful deletion
      void queryClient.invalidateQueries({ queryKey: monthlyReturnsQueryKey });
    },
    meta: {
      toast: true,
    },
  });

  return {
    deleteSource: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
