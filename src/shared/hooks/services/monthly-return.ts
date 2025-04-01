import { AddSourceRequest } from "@bhaisaab/shared/constants/validation/monthly-returns";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type IMonthlyReturnsRow = Record<string, string>;

interface IMonthlyReturnsResponse {
  success: boolean;
  data: {
    headers: string[];
    rows: IMonthlyReturnsRow[];
  };
  error?: string;
}

export const monthlyReturnsQueryKey = ["monthlyReturns"];

export function useMonthlyReturns() {
  return useQuery({
    queryKey: monthlyReturnsQueryKey,
    queryFn: async () => {
      const { data } = await httpClient.get<IMonthlyReturnsResponse>(
        "/spreadsheet/monthly-returns",
      );
      return data.data;
    },
    meta: {
      toast: true,
    },
  });
}

interface IAddSourceResponse {
  success: boolean;
  message: string;
  error?: string;
  details?: Record<string, unknown>;
}

export function useAddMonthlyIncomeSource() {
  const queryClient = useQueryClient();

  const mutation = useMutation<IAddSourceResponse, Error, AddSourceRequest>({
    mutationFn: async (sourceData: AddSourceRequest) => {
      const { data } = await httpClient.post<IAddSourceResponse>(
        "/spreadsheet/monthly-returns",
        sourceData,
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch monthly returns query after successful mutation
      void queryClient.invalidateQueries({ queryKey: monthlyReturnsQueryKey });
    },
    meta: {
      toast: true,
    },
  });

  return {
    addIncomeSource: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
