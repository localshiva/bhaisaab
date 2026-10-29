import { loansQueryKey } from "@bhaisaab/features/loans/_shared/constants/query-keys";
import { IDeleteLoanRequest } from "@bhaisaab/features/loans/_shared/types/loans";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Deletes a loan row, then refetches the loan list.
 */
export function useDeleteLoan() {
  const queryClient = useQueryClient();

  const mutation = useMutation<IResponse, Error, IDeleteLoanRequest>({
    mutationFn: async (deleteData: IDeleteLoanRequest) => {
      const { data } = await httpClient.delete<IResponse>(
        "/spreadsheet/loans",
        { data: deleteData },
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: loansQueryKey });
    },
    meta: {
      toast: true,
    },
  });

  return {
    deleteLoan: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
