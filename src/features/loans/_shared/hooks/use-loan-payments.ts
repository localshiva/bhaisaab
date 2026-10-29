import { loanPaymentsQueryKey } from "@bhaisaab/features/loans/_shared/constants/query-keys";
import { ILoanPayment } from "@bhaisaab/features/loans/_shared/types/loans";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useQuery } from "@tanstack/react-query";

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
