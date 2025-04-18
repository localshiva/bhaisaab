// @bhaisaab/pages/monthly-expense/monthly-expense-details/monthly-expense-details.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";

import { MonthlyExpenseList } from "./components/monthly-expense-list";

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
