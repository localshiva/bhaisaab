"use client";
import { MonthlyExpenseList } from "@bhaisaab/features/monthly-expenses/monthly-expense-details/_shared/components/monthly-expense-list";
import { Button } from "@bhaisaab/shared/components/core/button";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";

/**
 * Expenses of the month named by the `rowIndex` and `date` query params.
 * Whether the month accepts changes comes from the server, not the URL.
 */
const MonthlyExpenseDetails: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rowIndex = searchParams.get("rowIndex");
  const date = searchParams.get("date");

  if (!rowIndex || !date) {
    return (
      <div className="flex flex-col items-center gap-4 max-w-6xl mx-auto p-4 py-12 text-center">
        <Typography variant="h5">No month selected.</Typography>
        <Button asChild variant="outline">
          <Link href="/monthly-expenses">Back to monthly expenses</Link>
        </Button>
      </div>
    );
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <MonthlyExpenseList
      rowIndex={Number(rowIndex)}
      date={decodeURIComponent(date)}
      onBack={handleBack}
    />
  );
};

export default MonthlyExpenseDetails;
