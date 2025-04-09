// @bhaisaab/pages/spreadsheet/loan-report/components/loan-empty-list.tsx
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { CreditCard } from "lucide-react";

import { AddLoanForm } from "./add-loan-form";

export const LoanEmptyList = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-card border rounded-lg p-8 text-center">
      <CreditCard className="size-12 text-muted-foreground mb-4" />
      <Typography variant="h5" weight="semibold">
        No loans added yet
      </Typography>
      <Typography variant="body" textColor="muted" className="mt-1 mb-4">
        Add your first loan to track payments and pending amounts.
      </Typography>

      <AddLoanForm />
    </div>
  );
};
