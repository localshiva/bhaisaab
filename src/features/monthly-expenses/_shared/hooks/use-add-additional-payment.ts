import {
  monthlyExpenseQueryKey,
  monthlyExpensesQueryKey,
} from "@bhaisaab/features/monthly-expenses/_shared/constants/query-keys";
import { AddAdditionalPaymentRequest } from "@bhaisaab/features/monthly-expenses/_shared/schemas/monthly-expenses";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Sets a month's additional payment, replacing the existing value.
 *
 * On success it invalidates the month list and that month's expenses.
 */
export function useAddAdditionalPayment() {
  const queryClient = useQueryClient();

  const mutation = useMutation<IResponse, Error, AddAdditionalPaymentRequest>({
    mutationFn: async (paymentData: AddAdditionalPaymentRequest) => {
      const { data } = await httpClient.post<IResponse>(
        "/spreadsheet/monthly-expenses/additional-payment",
        paymentData,
      );
      return data;
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
    addPayment: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
