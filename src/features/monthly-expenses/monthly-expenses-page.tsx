"use client";
import { MonthlyExpenseSummaryCard } from "@bhaisaab/features/monthly-expenses/_shared/components/monthly-expense-summary-card";
import { MonthlyExpensesList } from "@bhaisaab/features/monthly-expenses/_shared/components/monthly-expenses-list";
import { useMonthlyExpenses } from "@bhaisaab/features/monthly-expenses/_shared/hooks/use-monthly-expenses";
import { DataLoading } from "@bhaisaab/shared/components/app/data-loading";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { format } from "date-fns/format";

/**
 * Monthly expenses page: a summary of the latest month
 * and a card per month, newest first.
 */
export const MonthlyExpense = () => {
  const { isLoading, data } = useMonthlyExpenses();

  if (isLoading) {
    return <DataLoading />;
  }

  if (!data?.rows) {
    return (
      <div className="flex flex-col gap-4 max-w-6xl mx-auto p-4">
        No data found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto p-4">
      <div className="w-full flex justify-between items-center">
        <Typography variant={"h4"} weight={"semibold"}>
          Monthly Expenses
        </Typography>

        <Typography variant={"body"}>
          {format(new Date(), "MMMM yyyy")}
        </Typography>
      </div>

      <MonthlyExpenseSummaryCard rows={data.rows} />

      <MonthlyExpensesList rows={data.rows} />
    </div>
  );
};
