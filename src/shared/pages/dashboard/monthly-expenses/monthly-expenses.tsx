"use client";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { useMonthlyExpenses } from "@bhaisaab/shared/hooks/services/monthly-expenses";
import { format } from "date-fns/format";

import { MonthlyExpensesList } from "./components/monthly-expenses-list";

export const MonthlyExpense = () => {
  const { isLoading, data } = useMonthlyExpenses();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.rows) {
    return <div>No data found</div>;
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

      {/* TODO: Main summary card */}

      {/* Display monthly expenses list */}
      <MonthlyExpensesList rows={data.rows} />
    </div>
  );
};
