// @bhaisaab/shared/hooks/services/loans.ts
import { AddLoanRequest } from "@bhaisaab/shared/constants/validation/loans";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type ILoanRow = string[];

interface ILoansResponse {
  success: boolean;
  data: {
    headers: string[];
    rows: ILoanRow[];
  };
  error?: string;
}

// Response type for add loan mutation
interface IAddLoanResponse {
  success: boolean;
  message: string;
  error?: string;
  details?: Record<string, unknown>;
}

// Query key for loans
export const loansQueryKey = ["loans"];

/**
 * Hook for fetching all loans
 */
export function useLoans() {
  return useQuery({
    queryKey: loansQueryKey,
    queryFn: async () => {
      const { data } =
        await httpClient.get<ILoansResponse>("/spreadsheet/loans");
      return data.data;
    },
    meta: {
      toast: true,
    },
  });
}

/**
 * Hook for adding a new loan
 */
export function useAddLoan() {
  const queryClient = useQueryClient();

  const mutation = useMutation<IAddLoanResponse, Error, AddLoanRequest>({
    mutationFn: async (loanData: AddLoanRequest) => {
      const { data } = await httpClient.post<IAddLoanResponse>(
        "/spreadsheet/loans",
        loanData,
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch loans query after successful mutation
      void queryClient.invalidateQueries({ queryKey: loansQueryKey });
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
