import {
  loanPaymentsQueryKey,
  loansQueryKey,
} from "@bhaisaab/features/loans/_shared/constants/query-keys";
import { IAddLoanPaymentRequest } from "@bhaisaab/features/loans/_shared/types/loans";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for adding a payment to an existing loan
 */
export function useAddLoanPayment() {
  const queryClient = useQueryClient();

  const mutation = useMutation<IResponse, Error, IAddLoanPaymentRequest>({
    mutationFn: async (paymentData: IAddLoanPaymentRequest) => {
      const { data } = await httpClient.post<IResponse>(
        "/spreadsheet/loans/payments",
        paymentData,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch loans query after successful mutation
      void queryClient.invalidateQueries({ queryKey: loansQueryKey });
      // Also invalidate the specific loan's payments query
      void queryClient.invalidateQueries({
        queryKey: loanPaymentsQueryKey(variables.rowIndex),
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
