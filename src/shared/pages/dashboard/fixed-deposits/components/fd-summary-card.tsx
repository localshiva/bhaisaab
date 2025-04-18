import { AmountSummaryCard } from "@bhaisaab/shared/components/app/amount-summary-card/amount-summary-card";
import {
  calculateTotalInterest,
  IFixedDepositRow,
  isMatured,
} from "@bhaisaab/shared/hooks/services/fixed-deposits";
import { FC, useMemo } from "react";

interface FDSummaryCardProps {
  rows: IFixedDepositRow[];
}

export const FDSummaryCard: FC<FDSummaryCardProps> = ({ rows }) => {
  const summaryData = useMemo(() => {
    // Total active investment amount
    let activeAmount = 0;
    // Total expected interest (from active deposits)
    let totalInterest = 0;
    // Count of matured FDs
    let maturedCount = 0;
    // Count of active FDs
    let activeCount = 0;

    for (const row of rows) {
      const amount = Math.round(Number(row[0]));
      const interestRate = Number(row[1]);
      const depositDate = row[2];
      const maturityDate = row[3];

      // Check if matured
      if (isMatured(maturityDate)) {
        maturedCount += 1;
      } else {
        activeCount += 1;
        activeAmount += amount;

        // Calculate interest only for active FDs
        const interest = calculateTotalInterest(
          amount,
          interestRate,
          depositDate,
          maturityDate,
        );

        totalInterest += Math.round(interest);
      }
    }

    return [
      {
        amount: Math.round(activeAmount),
        subtitle: `${activeCount} active deposits`,
        title: "Active Investment",
      },
      {
        amount: Math.round(totalInterest),
        subtitle: `From active deposits`,
        title: "Expected Interest",
      },
      {
        amount: Math.round(activeAmount + totalInterest),
        subtitle: `${activeCount} active, ${maturedCount} matured`,
        title: "Projected Value",
      },
    ];
  }, [rows]);

  return (
    <AmountSummaryCard
      collapsedStateId="fd-summary-card"
      title="Fixed Deposit Summary"
      rows={summaryData}
    />
  );
};
