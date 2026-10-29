import { ILoanRow } from "@bhaisaab/features/loans/_shared/types/loans";
import { AmountSummaryCard } from "@bhaisaab/shared/components/app/amount-summary-card/amount-summary-card";
import { FC, useMemo } from "react";

interface LoanSummaryCardProps {
  rows: ILoanRow[];
}

export const LoanSummaryCard: FC<LoanSummaryCardProps> = ({ rows }) => {
  const summaryData = useMemo(() => {
    let totalLoanAmount = 0;
    let totalPaidAmount = 0;
    let totalPendingAmount = 0;

    let activeLoansCount = 0;
    let completedLoansCount = 0;

    for (const row of rows) {
      const loanAmount = Number(row[1]) || 0;
      const paidAmount = Number(row[2]) || 0;
      const pendingAmount = Number(row[3]) || 0;

      totalLoanAmount += loanAmount;
      totalPaidAmount += paidAmount;
      totalPendingAmount += pendingAmount;

      if (pendingAmount > 0) {
        activeLoansCount += 1;
      } else {
        completedLoansCount += 1;
      }
    }

    return [
      {
        amount: Math.round(totalLoanAmount),
        subtitle: `${rows.length} total loans`,
        title: "Total Loan Amount",
      },
      {
        amount: Math.round(totalPaidAmount),
        subtitle: `${completedLoansCount} loans completed`,
        title: "Total Paid Amount",
      },
      {
        amount: Math.round(totalPendingAmount),
        subtitle: `${activeLoansCount} active loans`,
        title: "Total Pending Amount",
      },
    ];
  }, [rows]);

  return (
    <AmountSummaryCard
      title="Loan Summary"
      rows={summaryData}
      collapsedStateId="loan-summary-card"
    />
  );
};
