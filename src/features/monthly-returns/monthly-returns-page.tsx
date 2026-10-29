"use client";
import { MRAddSource } from "@bhaisaab/features/monthly-returns/_shared/components/mr-add-source";
import { MRSourceList } from "@bhaisaab/features/monthly-returns/_shared/components/mr-source-list";
import { MRSummaryCard } from "@bhaisaab/features/monthly-returns/_shared/components/mr-summary-card";
import { useMonthlyReturns } from "@bhaisaab/features/monthly-returns/_shared/hooks/use-monthly-returns";
import { getIncomeSources } from "@bhaisaab/features/monthly-returns/_shared/utils/income";
import { DataLoading } from "@bhaisaab/shared/components/app/data-loading";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { useMemo } from "react";

/** Monthly returns page: income totals by type and the list of sources. */
export default function MonthlyReturns() {
  const { isLoading, data } = useMonthlyReturns();

  const sources = useMemo(() => {
    return getIncomeSources(data?.rows ?? []);
  }, [data?.rows]);

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

      <MRSummaryCard sources={sources} />

      <MRSourceList sources={sources} />
    </div>
  );
}
