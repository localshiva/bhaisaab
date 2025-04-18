// @bhaisaab/pages/monthly-expenses/components/monthly-expenses-list.tsx
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { IMonthlyExpenseRow } from "@bhaisaab/shared/hooks/services/monthly-expenses";
import { FC } from "react";

import { MonthlyExpenseEmptyList } from "./monthly-expenses-empty-list";
import { MonthlyExpenseListItem } from "./monthly-expenses-list-item";

interface MonthlyExpensesListProps {
  rows: IMonthlyExpenseRow[];
}

export const MonthlyExpensesList: FC<MonthlyExpensesListProps> = ({ rows }) => {
  if (rows.length === 0) {
    return <MonthlyExpenseEmptyList />;
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6">
      <Typography variant="h5" weight="semibold" className="mb-4">
        Your Monthly Expenses
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((row, index) => (
          <MonthlyExpenseListItem
            key={`monthly-expense-${index}`}
            id={index}
            date={row[0]}
            inHand={row[1]}
            additionalPayment={row[2]}
            totalExpense={row[3]}
            remainder={row[4]}
          />
        ))}
      </div>
    </div>
  );
};
