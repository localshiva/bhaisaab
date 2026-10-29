import { fixedDepositsQueryKey } from "@bhaisaab/features/fixed-deposits/_shared/constants/query-keys";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for deleting a fixed deposit
 */
export function useDeleteFixedDeposit() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { success: boolean; message: string },
    Error,
    number // ID of the fixed deposit to delete
  >({
    mutationFn: async (depositId: number) => {
      const { data } = await httpClient.delete<{
        success: boolean;
        message: string;
      }>(`/spreadsheet/fixed-deposits/${depositId}`);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch fixed deposits query after successful deletion
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
