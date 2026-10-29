import {
  loanPaymentsQueryKey,
  loansQueryKey,
} from "@bhaisaab/features/loans/_shared/constants/query-keys";
import { IAddLoanPaymentRequest } from "@bhaisaab/features/loans/_shared/types/loans";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Records a payment on a loan, then refetches the loan list and that
 * loan's payments.
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
      void queryClient.invalidateQueries({ queryKey: loansQueryKey });
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
