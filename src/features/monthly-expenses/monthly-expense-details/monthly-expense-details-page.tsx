"use client";
import { MonthlyExpenseList } from "@bhaisaab/features/monthly-expenses/monthly-expense-details/_shared/components/monthly-expense-list";
import { useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";

const MonthlyExpenseDetails: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rowIndex = searchParams.get("rowIndex");
  const date = searchParams.get("date");
  const canAddExpenses = searchParams.get("canAddExpenses");

  // Handle loading state or invalid params
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
