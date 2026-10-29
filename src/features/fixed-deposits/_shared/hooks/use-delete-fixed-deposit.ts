import { fixedDepositsQueryKey } from "@bhaisaab/features/fixed-deposits/_shared/constants/query-keys";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Deletes a deposit by its `originalRowIndex`, then refetches the
 * deposit list.
 */
export function useDeleteFixedDeposit() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { success: boolean; message: string },
    Error,
    number
  >({
    mutationFn: async (depositId: number) => {
      const { data } = await httpClient.delete<{
        success: boolean;
        message: string;
      }>(`/spreadsheet/fixed-deposits/${depositId}`);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fixedDepositsQueryKey });
    },
    meta: {
      toast: true,
    },
  });

  return {
    deleteFixedDeposit: mutation.mutate,
    isDeleting: mutation.isPending,
    isDeleteError: mutation.isError,
    deleteError: mutation.error,
  };
}
