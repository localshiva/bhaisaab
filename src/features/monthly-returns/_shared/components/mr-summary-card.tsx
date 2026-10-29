import { IMonthlyReturnsRow } from "@bhaisaab/features/monthly-returns/_shared/types/monthly-returns";
import { getTotalIncome } from "@bhaisaab/features/monthly-returns/_shared/utils/income";
import { AmountSummaryCard } from "@bhaisaab/shared/components/app/amount-summary-card/amount-summary-card";
import { FC, useMemo } from "react";

interface Props {
  rows: IMonthlyReturnsRow[];
}

/** Totals of all income, salary and rent, with a source count each. */
export const MRSummaryCard: FC<Props> = ({ rows }) => {
  const totalIncome = useMemo(() => {
    return getTotalIncome(rows);
  }, [rows]);

  const totalSalary = useMemo(() => {
    let sum = 0;

    const salariedRows = rows.filter(row => row[0] === "Salary");

    for (const row of salariedRows) {
      sum += Number(row[2]);
    }

    return {
      sum,
      sources: salariedRows.length,
    };
  }, [rows]);

  const totalRent = useMemo(() => {
    let sum = 0;

    const rentedRows = rows.filter(row => row[0] === "Rent");

    for (const row of rentedRows) {
      sum += Number(row[2]);
    }

    return {
      sum,
      sources: rentedRows.length,
    };
  }, [rows]);

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
