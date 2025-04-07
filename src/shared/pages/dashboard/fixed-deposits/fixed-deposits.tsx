"use client";
// @bhaisaab/shared/pages/dashboard/fixed-deposits/fixed-deposits.tsx
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { useFixedDeposits } from "@bhaisaab/shared/hooks/services/fixed-deposits";
import { Banknote, Loader2 } from "lucide-react";

import { FDCreateForm } from "./components/fd-create-form";
import { FDEmptyList } from "./components/fd-empty-list";
import { FDList } from "./components/fd-list";
import { FDSummaryCard } from "./components/fd-summary-card";

export default function FixedDeposits() {
  const { isLoading, data } = useFixedDeposits();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-primary mb-2" />
        <Typography variant="body">Loading fixed deposits...</Typography>
      </div>
    );
  }

  const { rows = [] } = data ?? {};

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto p-4">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center">
          <Banknote className="size-6 mr-2 text-primary" />
          <Typography variant="h4" weight="semibold">
            Fixed Deposits
          </Typography>
        </div>

        <FDCreateForm />
      </div>

      <FDSummaryCard rows={rows} />

      {rows.length === 0 ? <FDEmptyList /> : <FDList rows={rows} />}
    </div>
  );
}
