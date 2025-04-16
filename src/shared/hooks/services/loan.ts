// @bhaisaab/shared/hooks/services/loans.ts
import { AddLoanRequest } from "@bhaisaab/shared/constants/validation/loans";
import { IAddLoanPaymentRequest } from "@bhaisaab/shared/services/spreadsheet/loan/add-loan-payment";
import { IDeleteLoanRequest } from "@bhaisaab/shared/services/spreadsheet/loan/delete-loan";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type ILoanRow = string[];

// Query key for loans
export const loansQueryKey = ["loans"];

/**
 * Hook for fetching all loans
 */
export function useLoans() {
  return useQuery({
    queryKey: loansQueryKey,
    queryFn: async () => {
      const { data } = await httpClient.get<
        IResponse<{
          headers: string[];
          rows: ILoanRow[];
        }>
      >("/spreadsheet/loans");
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

  const mutation = useMutation<IResponse, Error, AddLoanRequest>({
    mutationFn: async (loanData: AddLoanRequest) => {
      const { data } = await httpClient.post<IResponse>(
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
 * Hook for deleting a loan
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
      // Invalidate and refetch loans query after successful deletion
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

// Add this to @bhaisaab/shared/hooks/services/loan.ts

/**
 * Interface for loan payment details
 */
export interface ILoanPayment {
  amount: number;
  columnIndex: number;
}

// Query key generator for loan payments
export const loanPaymentsQueryKey = (rowIndex: number) => [
  "loanPayments",
  rowIndex,
];

/**
 * Hook for fetching payments for a specific loan
 */
export function useLoanPayments(rowIndex: number) {
  return useQuery({
    queryKey: loanPaymentsQueryKey(rowIndex),
    queryFn: async () => {
      const { data } = await httpClient.get<IResponse<ILoanPayment[]>>(
        `/spreadsheet/loans/payments?rowIndex=${rowIndex}`,
      );
      return data.data;
    },
    // Don't fetch if rowIndex is invalid
    enabled: rowIndex > 0,
    meta: {
      toast: true,
    },
  });
}

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
