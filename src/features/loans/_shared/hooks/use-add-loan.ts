import {
  allLoanPaymentsQueryKey,
  loansQueryKey,
} from "@bhaisaab/features/loans/_shared/constants/query-keys";
import { AddLoanRequest } from "@bhaisaab/features/loans/_shared/schemas/loans";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Appends a loan row, then refetches the loan list and drops every
 * cached payment history.
 */
export function useAddLoan() {
  const queryClient = useQueryClient();

  const mutation = useMutation<IResponse, Error, AddLoanRequest>({
    mutationFn: async (loanData: AddLoanRequest) => {
      const { data } = await httpClient.post<IResponse>(
        "/spreadsheet/loans",
        loanData,
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: loansQueryKey });

      /**
       * Payments are cached by sheet row, and this write can change
       * which loan sits in a row. Removing them, rather than marking
       * them stale, keeps a reopened dialog from showing another
       * loan's payments while it refetches.
       */
      queryClient.removeQueries({ queryKey: allLoanPaymentsQueryKey });
    },
    meta: {
      toast: true,
    },
  });

  return {
    addLoan: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
