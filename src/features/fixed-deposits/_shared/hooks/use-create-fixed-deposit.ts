import { fixedDepositsQueryKey } from "@bhaisaab/features/fixed-deposits/_shared/constants/query-keys";
import { CreateFixedDepositRequest } from "@bhaisaab/features/fixed-deposits/_shared/schemas/fixed-deposits";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for creating a new fixed deposit
 */
export function useCreateFixedDeposit() {
  const queryClient = useQueryClient();

  const mutation = useMutation<IResponse, Error, CreateFixedDepositRequest>({
    mutationFn: async (depositData: CreateFixedDepositRequest) => {
      const { data } = await httpClient.post<IResponse>(
        "/spreadsheet/fixed-deposits",
        depositData,
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch fixed deposits query after successful mutation
      void queryClient.invalidateQueries({ queryKey: fixedDepositsQueryKey });
    },
    meta: {
      toast: true,
    },
  });

  return {
    createFixedDeposit: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
