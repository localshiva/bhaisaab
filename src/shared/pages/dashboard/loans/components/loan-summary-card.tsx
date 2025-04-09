// @bhaisaab/pages/spreadsheet/loan-report/components/loan-summary-card.tsx
import { AmountSummaryCard } from "@bhaisaab/shared/components/app/amount-summary-card/amount-summary-card";
import { ILoanRow } from "@bhaisaab/shared/hooks/services/loan";
import { FC, useMemo } from "react";

interface LoanSummaryCardProps {
  rows: ILoanRow[];
}

export const LoanSummaryCard: FC<LoanSummaryCardProps> = ({ rows }) => {
  const summaryData = useMemo(() => {
    // Calculate total loan amount
    let totalLoanAmount = 0;
    // Calculate total paid amount
    let totalPaidAmount = 0;
    // Calculate total pending amount
    let totalPendingAmount = 0;

    // Count of active loans (those with pending amount > 0)
    let activeLoansCount = 0;
    // Count of completed loans
    let completedLoansCount = 0;

    for (const row of rows) {
      // Assuming data structure:
      // [0] = provider
      // [1] = loan amount
      // [2] = paid amount
      // [3] = pending amount
      const loanAmount = Number(row[1]) || 0;
      const paidAmount = Number(row[2]) || 0;
      const pendingAmount = Number(row[3]) || 0;

      totalLoanAmount += loanAmount;
      totalPaidAmount += paidAmount;
      totalPendingAmount += pendingAmount;

      // Determine if this loan is active or completed
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

  return <AmountSummaryCard title="Loan Summary" rows={summaryData} />;
};
