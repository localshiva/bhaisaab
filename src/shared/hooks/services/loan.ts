// @bhaisaab/shared/hooks/services/loans.ts
import { AddLoanRequest } from "@bhaisaab/shared/constants/validation/loans";
import { IAddLoanPaymentRequest } from "@bhaisaab/shared/services/spreadsheet/loan/add-loan-payment";
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

/**
 * Response type for add loan payment mutation
 */
interface IAddLoanPaymentResponse {
  success: boolean;
  message: string;
  error?: string;
  details?: Record<string, unknown>;
}

/**
 * Hook for adding a payment to an existing loan
 */
export function useAddLoanPayment() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    IAddLoanPaymentResponse,
    Error,
    IAddLoanPaymentRequest
  >({
    mutationFn: async (paymentData: IAddLoanPaymentRequest) => {
      const { data } = await httpClient.post<IAddLoanPaymentResponse>(
        "/spreadsheet/loans/payment",
        paymentData,
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
    addPayment: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
