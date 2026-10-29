import { fixedDepositsQueryKey } from "@bhaisaab/features/fixed-deposits/_shared/constants/query-keys";
import { IFixedDepositRow } from "@bhaisaab/features/fixed-deposits/_shared/types/fixed-deposits";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useQuery } from "@tanstack/react-query";

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
