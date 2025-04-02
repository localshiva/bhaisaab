"use client";
// app/spreadsheet/fixed-deposits/page.tsx
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { useFixedDeposits } from "@bhaisaab/shared/hooks/services/fixed-deposits";
import { Banknote, ListPlus, Loader2 } from "lucide-react";

import { FDCreateForm } from "./components/fd-create-term";
import { FDListItem } from "./components/fd-list-item";

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

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-card border rounded-lg p-8 text-center">
          <ListPlus className="size-12 text-muted-foreground mb-4" />
          <Typography variant="h5" weight="semibold">
            No fixed deposits yet
          </Typography>
          <Typography variant="body" textColor="muted" className="mt-1 mb-4">
            Create your first fixed deposit to track interest and maturity.
          </Typography>
          <FDCreateForm />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((row, index) => {
            // Map column indexes to named properties
            const amountIndex = 0;
            const interestRateIndex = 1;
            const depositDateIndex = 2;
            const maturityDateIndex = 3;

            return (
              <FDListItem
                id={index + 1}
                key={`fd-${index}`}
                amount={row[amountIndex]}
                interestRate={row[interestRateIndex]}
                depositDate={row[depositDateIndex]}
                maturityDate={row[maturityDateIndex]}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
