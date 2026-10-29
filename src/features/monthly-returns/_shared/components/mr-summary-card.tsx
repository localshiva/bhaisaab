import { IIncomeSource } from "@bhaisaab/features/monthly-returns/_shared/types/monthly-returns";
import { getTotalIncome } from "@bhaisaab/features/monthly-returns/_shared/utils/income";
import { AmountSummaryCard } from "@bhaisaab/shared/components/app/amount-summary-card/amount-summary-card";
import { FC, useMemo } from "react";

interface Props {
  sources: IIncomeSource[];
}

/** Totals of all income, salary and rent, with a source count each. */
export const MRSummaryCard: FC<Props> = ({ sources }) => {
  const totalIncome = useMemo(() => {
    return getTotalIncome(sources);
  }, [sources]);

  const totalSalary = useMemo(() => {
    return getTotalIncome(sources.filter(({ type }) => type === "Salary"));
  }, [sources]);

  const totalRent = useMemo(() => {
    return getTotalIncome(sources.filter(({ type }) => type === "Rent"));
  }, [sources]);

  const data = useMemo(() => {
    return [
      {
        amount: totalIncome.sum,
        subtitle: `${totalIncome.sources} sources`,
        title: "Total Income",
      },
      {
        amount: totalSalary.sum,
        subtitle: `${totalSalary.sources} sources`,
        title: "Total Salary",
      },
      {
        amount: totalRent.sum,
        subtitle: `${totalRent.sources} sources`,
        title: "Total Rent",
      },
    ];
  }, [totalIncome, totalRent, totalSalary]);

  return (
    <AmountSummaryCard
      title="Income Summary"
      rows={data}
      collapsedStateId="mr-summary-card"
    />
  );
};
