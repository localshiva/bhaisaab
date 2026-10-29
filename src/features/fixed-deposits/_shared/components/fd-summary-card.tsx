import { IFixedDepositRow } from "@bhaisaab/features/fixed-deposits/_shared/types/fixed-deposits";
import {
  calculateTotalInterest,
  isMatured,
} from "@bhaisaab/features/fixed-deposits/_shared/utils/fd-calculations";
import { AmountSummaryCard } from "@bhaisaab/shared/components/app/amount-summary-card/amount-summary-card";
import { FC, useMemo } from "react";

interface FDSummaryCardProps {
  rows: IFixedDepositRow[];
}

export const FDSummaryCard: FC<FDSummaryCardProps> = ({ rows }) => {
  const summaryData = useMemo(() => {
    let activeAmount = 0;
    let totalInterest = 0;
    let maturedCount = 0;
    let activeCount = 0;

    for (const row of rows) {
      const amount = Math.round(Number(row.data[0]));
      const interestRate = Number(row.data[1]);
      const depositDate = row.data[2];
      const maturityDate = row.data[3];

      if (isMatured(maturityDate)) {
        maturedCount += 1;
      } else {
        activeCount += 1;
        activeAmount += amount;

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
