"use client";
import { Button } from "@bhaisaab/shared/components/core/button";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { useMonthlyReturns } from "@bhaisaab/shared/hooks/services/monthly-return";
import { Plus } from "lucide-react";

import { MRSourceList } from "./components/mr-source-list";
import { MRSummaryCard } from "./components/mr-summary-card";

export default function MonthlyReturns() {
  const { isLoading, data } = useMonthlyReturns();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.rows) {
    return <div>No data found</div>;
  }

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto p-4">
      <div className="w-full flex justify-between items-center">
        <Typography variant={"h4"} weight={"semibold"}>
          Monthly Returns
        </Typography>

        <Button variant="outline">
          <Plus />
          <span>Add new</span>
        </Button>
      </div>

      {/* Main summary card */}
      <MRSummaryCard rows={data.rows} />

      {/* List of sources */}
      <MRSourceList rows={data.rows} />
    </div>
  );
}
