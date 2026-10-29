"use client";
import { MonthlyExpenseSummaryCard } from "@bhaisaab/features/monthly-expenses/_shared/components/monthly-expense-summary-card";
import { MonthlyExpensesList } from "@bhaisaab/features/monthly-expenses/_shared/components/monthly-expenses-list";
import { useMonthlyExpenses } from "@bhaisaab/features/monthly-expenses/_shared/hooks/monthly-expenses";
import { DataLoading } from "@bhaisaab/shared/components/app/data-loading";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { format } from "date-fns/format";

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

        {/* Show the current month and year e.g "January 2023" */}
        {/* Use date-fns to format the date */}
        <Typography variant={"body"}>
          {format(new Date(), "MMMM yyyy")}
        </Typography>
      </div>

      {/* Main summary card */}
      <MonthlyExpenseSummaryCard rows={data.rows} />

      {/* Display monthly expenses list */}
      <MonthlyExpensesList rows={data.rows} />
    </div>
  );
};
