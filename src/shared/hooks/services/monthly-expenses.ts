import { AddMonthlyExpenseRequest } from "@bhaisaab/shared/constants/validation/monthly-expenses";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type IMonthlyExpenseRow = string[];

const monthlyExpensesQueryKey = ["monthlyExpenses"];

/**
 * Hook for fetching all loans
 */
export function useMonthlyExpenses() {
  return useQuery({
    queryKey: monthlyExpensesQueryKey,
    queryFn: async () => {
      const { data } = await httpClient.get<
        IResponse<{
          headers: string[];
          rows: IMonthlyExpenseRow[];
        }>
      >("/spreadsheet/monthly-expenses");
      return data.data;
    },
    meta: {
      toast: true,
    },
  });
}

/**
 * Response type for monthly expenses query
 */
interface IMonthlyExpense {
  amount: number;
  comment?: string;
}

// Query key generator for monthly expense
export const monthlyExpenseQueryKey = (rowIndex: number) => [
  "monthlyExpense",
  rowIndex,
];

/**
 * Hook for fetching monthly expenses
 */
export function useMonthlyExpense(rowIndex: number, enabled = true) {
  return useQuery({
    queryKey: monthlyExpenseQueryKey(rowIndex),
    queryFn: async () => {
      const { data } = await httpClient.get<IResponse<IMonthlyExpense[]>>(
        `/spreadsheet/monthly-expenses/expense?rowIndex=${rowIndex}`,
      );
      return data.data;
    },
    // Don't fetch if rowIndex is invalid
    enabled: rowIndex > 0 && enabled,
    meta: {
      toast: true,
    },
  });
}

export function useAddMonthlyExpense() {
  const queryClient = useQueryClient();

  const mutation = useMutation<IResponse, Error, AddMonthlyExpenseRequest>({
    mutationFn: async (paymentData: AddMonthlyExpenseRequest) => {
      const { data } = await httpClient.post<IResponse>(
        "/spreadsheet/monthly-expenses/expense",
        paymentData,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch loans query after successful mutation
      void queryClient.invalidateQueries({ queryKey: monthlyExpensesQueryKey });
      // Also invalidate the specific loan's payments query
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
