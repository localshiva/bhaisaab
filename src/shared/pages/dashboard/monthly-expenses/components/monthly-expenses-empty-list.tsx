// @bhaisaab/pages/spreadsheet/loan-report/components/loan-empty-list.tsx
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { CreditCard } from "lucide-react";

export const MonthlyExpenseEmptyList = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-card border rounded-lg p-8 text-center">
      <CreditCard className="size-12 text-muted-foreground mb-4" />
      <Typography variant="h5" weight="semibold">
        No monthly expenses added yet
      </Typography>
    </div>
  );
};
