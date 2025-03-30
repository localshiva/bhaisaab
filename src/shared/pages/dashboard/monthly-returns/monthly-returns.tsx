"use client";
import { useMonthlyReturns } from "@bhaisaab/shared/hooks/services/monthly-return";

export default function MonthlyReturns() {
  const { isLoading } = useMonthlyReturns();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Monthly Returns</div>;
}
