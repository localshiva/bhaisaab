// @bhaisaab/shared/hooks/services/loans.ts
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useQuery } from "@tanstack/react-query";

export type ILoanRow = string[];

interface ILoansResponse {
  success: boolean;
  data: {
    headers: string[];
    rows: ILoanRow[];
  };
  error?: string;
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
