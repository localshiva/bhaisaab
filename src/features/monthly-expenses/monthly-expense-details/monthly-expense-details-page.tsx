"use client";
import { MonthlyExpenseList } from "@bhaisaab/features/monthly-expenses/monthly-expense-details/_shared/components/monthly-expense-list";
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
    return <div className="container py-12 text-center">Loading...</div>;
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
