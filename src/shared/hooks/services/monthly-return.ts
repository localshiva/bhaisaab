import {
  AddSourceRequest,
  DeleteSourceRequest,
} from "@bhaisaab/shared/constants/validation/monthly-returns";
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

// Query key for fetching monthly returns data
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

// Response type for add source mutation
interface IAddSourceResponse {
  success: boolean;
  message: string;
  error?: string;
  details?: Record<string, unknown>;
}

// Hook for adding a new source to monthly returns
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

// Response type for delete source mutation
interface IDeleteSourceResponse {
  success: boolean;
  message: string;
  error?: string;
}

export function useDeleteMonthlySource() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    IDeleteSourceResponse,
    Error,
    DeleteSourceRequest
  >({
    mutationFn: async ({ id, source }: DeleteSourceRequest) => {
      const { data } = await httpClient.delete<IDeleteSourceResponse>(
        "/spreadsheet/monthly-returns",
        { data: { id, source } },
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch monthly returns query after successful deletion
      void queryClient.invalidateQueries({ queryKey: monthlyReturnsQueryKey });
    },
    meta: {
      toast: true,
    },
  });

  return {
    deleteSource: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
