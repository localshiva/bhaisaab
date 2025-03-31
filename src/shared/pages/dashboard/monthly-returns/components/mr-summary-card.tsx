import { Typography } from "@bhaisaab/shared/components/core/typography";
import { IMonthlyReturnsRow } from "@bhaisaab/shared/hooks/services/monthly-return";
import { FC, useMemo } from "react";

import { MRSummaryItem } from "./mr-summary-item";

interface Props {
  rows: IMonthlyReturnsRow[];
}

export const MRSummaryCard: FC<Props> = ({ rows }) => {
  const totalIncome = useMemo(() => {
    let sum = 0;

    for (const row of rows) {
      sum += Number(row[2]);
    }

    return {
      sum,
      sources: rows.length,
    };
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

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <Typography variant="h5" weight={"semibold"} textColor={"default"}>
        Income Summary
      </Typography>

      <div className="flex flex-wrap justify-between gap-x-4 gap-y-8 items-center p-3 bg-card/50 rounded-md border mt-4">
        {/* Total Income */}
        <MRSummaryItem
          sum={totalIncome.sum}
          sources={totalIncome.sources}
          title="Total Income"
        />

        {/* Total Salary */}
        <MRSummaryItem
          sum={totalSalary.sum}
          sources={totalSalary.sources}
          title="Total Salary"
        />

        {/* Total Rent */}
        <MRSummaryItem
          sum={totalRent.sum}
          sources={totalRent.sources}
          title="Total Rent"
        />
      </div>
    </div>
  );
};
