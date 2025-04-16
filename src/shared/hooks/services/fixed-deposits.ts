// @bhaisaab/shared/hooks/services/fixed-deposits.ts
import { CreateFixedDepositRequest } from "@bhaisaab/shared/constants/validation/fixed-deposits";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type IFixedDepositRow = string[];

// Query key for fixed deposits
export const fixedDepositsQueryKey = ["fixedDeposits"];

/**
 * Hook for fetching all fixed deposits
 */
export function useFixedDeposits() {
  return useQuery({
    queryKey: fixedDepositsQueryKey,
    queryFn: async () => {
      const { data } = await httpClient.get<
        IResponse<{
          headers: string[];
          rows: IFixedDepositRow[];
        }>
      >("/spreadsheet/fixed-deposits");
      return data.data;
    },
    meta: {
      toast: true,
    },
  });
}

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

/**
 * Calculates monthly interest for a fixed deposit
 */
export function calculateMonthlyInterest(
  amount: number,
  interestRate: number,
): number {
  return (amount * interestRate) / 1200; // 1200 = 12 months * 100 (to convert percentage)
}

/**
 * Calculates total expected interest for a fixed deposit
 */
export function calculateTotalInterest(
  amount: number,
  interestRate: number,
  depositDate: string,
  maturityDate: string,
): number {
  const startDate = new Date(depositDate);
  const endDate = new Date(maturityDate);

  // Calculate months between deposit and maturity (approximate)
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  const monthlyInterest = calculateMonthlyInterest(amount, interestRate);
  return monthlyInterest * months;
}

/**
 * Determines if a fixed deposit is matured based on maturity date
 */
export function isMatured(maturityDate: string): boolean {
  const today = new Date();
  const maturity = new Date(maturityDate);
  return maturity <= today;
}
