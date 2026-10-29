import { loansQueryKey } from "@bhaisaab/features/loans/_shared/constants/query-keys";
import { ILoanRow } from "@bhaisaab/features/loans/_shared/types/loans";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useQuery } from "@tanstack/react-query";

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
