import { loanPaymentsQueryKey } from "@bhaisaab/features/loans/_shared/constants/query-keys";
import { ILoanPayment } from "@bhaisaab/features/loans/_shared/types/loans";
import { IResponse } from "@bhaisaab/shared/types/http-client";
import httpClient from "@bhaisaab/shared/utils/http-client";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches the payments of the loan at the 1-based sheet row `rowIndex`.
 *
 * Runs only while `isEnabled` is true and `rowIndex` is positive.
 * Every loan card mounts its own payments dialog. So, the dialog
 * passes its open state, and only an open dialog sends a request.
 */
export function useLoanPayments(rowIndex: number, isEnabled: boolean) {
  return useQuery({
    queryKey: loanPaymentsQueryKey(rowIndex),
    queryFn: async () => {
      const { data } = await httpClient.get<IResponse<ILoanPayment[]>>(
        `/spreadsheet/loans/payments?rowIndex=${rowIndex}`,
      );
      return data.data;
    },
    enabled: isEnabled && rowIndex > 0,
    meta: {
      toast: true,
    },
  });
}
