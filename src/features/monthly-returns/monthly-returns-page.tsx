"use client";
import { MRAddSource } from "@bhaisaab/features/monthly-returns/_shared/components/mr-add-source";
import { MRSourceList } from "@bhaisaab/features/monthly-returns/_shared/components/mr-source-list";
import { MRSummaryCard } from "@bhaisaab/features/monthly-returns/_shared/components/mr-summary-card";
import { useMonthlyReturns } from "@bhaisaab/features/monthly-returns/_shared/hooks/use-monthly-returns";
import { DataLoading } from "@bhaisaab/shared/components/app/data-loading";
import { Typography } from "@bhaisaab/shared/components/core/typography";

export default function MonthlyReturns() {
  const { isLoading, data } = useMonthlyReturns();

  if (isLoading) {
    return <DataLoading />;
  }

  if (!data?.rows) {
    return (
      <div className="flex flex-col gap-4 max-w-6xl mx-auto p-4">
        No data found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto p-4">
      <div className="w-full flex justify-between items-center">
        <Typography variant={"h4"} weight={"semibold"}>
          Monthly Returns
        </Typography>

        <MRAddSource />
      </div>

      {/* Main summary card */}
      <MRSummaryCard rows={data.rows} />

      {/* List of sources */}
      <MRSourceList rows={data.rows} />
    </div>
  );
}
