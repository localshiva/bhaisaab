"use client";
import { MonthlyExpenseList } from "@bhaisaab/features/monthly-expenses/monthly-expense-details/_shared/components/monthly-expense-list";
import { useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";

/**
 * Expenses of the month named by the `rowIndex` and `date` query params.
 * Edit and delete controls show only when `canAddExpenses` is "true".
 */
const MonthlyExpenseDetails: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rowIndex = searchParams.get("rowIndex");
  const date = searchParams.get("date");
  const canAddExpenses = searchParams.get("canAddExpenses");

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
      canAddExpenses={canAddExpenses === "true"}
      onBack={handleBack}
    />
  );
};

export default MonthlyExpenseDetails;
