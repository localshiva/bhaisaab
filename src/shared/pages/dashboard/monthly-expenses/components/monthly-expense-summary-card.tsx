// @bhaisaab/pages/monthly-expense/components/monthly-expense-summary-card.tsx
import { AmountSummaryCard } from "@bhaisaab/shared/components/app/amount-summary-card/amount-summary-card";
import { IMonthlyExpenseRow } from "@bhaisaab/shared/hooks/services/monthly-expenses";
import { format } from "date-fns";
import { FC, useMemo } from "react";

interface MonthlyExpenseSummaryCardProps {
  rows: IMonthlyExpenseRow[];
}

export const MonthlyExpenseSummaryCard: FC<MonthlyExpenseSummaryCardProps> = ({
  rows,
}) => {
  const summaryData = useMemo(() => {
    // Current month data (most recent row)
    const currentMonthRow = rows.length > 0 ? rows.at(-1) : null;

    // Previous month data (second most recent row)
    const previousMonthRow = rows.length > 1 ? rows.at(-2) : null;

    // Current month values
    const currentMonthInHand = currentMonthRow
      ? Number(currentMonthRow[1]) || 0
      : 0;
    const currentMonthExpense = currentMonthRow
      ? Number(currentMonthRow[2]) || 0
      : 0;
    const currentMonthRemainder = currentMonthRow
      ? Number(currentMonthRow[3]) || 0
      : 0;

    // Calculate expense change percentage compared to previous month
    let expenseChangePercent = 0;
    if (previousMonthRow) {
      const previousMonthExpense = Number(previousMonthRow[2]) || 0;
      if (previousMonthExpense > 0) {
        expenseChangePercent = Math.round(
          ((currentMonthExpense - previousMonthExpense) /
            previousMonthExpense) *
            100,
        );
      }
    }

    // Current month label
    const currentMonthLabel = currentMonthRow
      ? currentMonthRow[0]
      : format(new Date(), "MMMM, yyyy");

    return [
      {
        amount: Math.round(currentMonthInHand),
        subtitle: `${currentMonthLabel}`,
        title: "Current Month In Hand",
      },
      {
        amount: Math.round(currentMonthExpense),
        subtitle:
          expenseChangePercent === 0
            ? "No change from last month"
            : `${expenseChangePercent > 0 ? "+" : ""}${expenseChangePercent}% vs last month`,
        title: "Current Month Expenses",
      },
      {
        amount: Math.round(currentMonthRemainder),
        subtitle: `${rows.length} months tracked`,
        title: "Current Month Remainder",
      },
    ];
  }, [rows]);

  return <AmountSummaryCard title="Expense Summary" rows={summaryData} />;
};
