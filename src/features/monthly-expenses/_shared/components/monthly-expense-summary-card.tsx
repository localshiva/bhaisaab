import { IMonthlyExpenseRow } from "@bhaisaab/features/monthly-expenses/_shared/types/monthly-expenses";
import { getIndiaMonthStart } from "@bhaisaab/features/monthly-expenses/_shared/utils/current-month";
import { AmountSummaryCard } from "@bhaisaab/shared/components/app/amount-summary-card/amount-summary-card";
import { format } from "date-fns";
import { FC, useMemo } from "react";

interface MonthlyExpenseSummaryCardProps {
  rows: IMonthlyExpenseRow[];
}

/**
 * Compares the latest month with the one before it.
 * Expects rows newest first, as the monthly expenses route returns them.
 */
export const MonthlyExpenseSummaryCard: FC<MonthlyExpenseSummaryCardProps> = ({
  rows,
}) => {
  const summaryData = useMemo(() => {
    const currentMonthRow = rows.length > 0 ? rows.at(0) : null;

    const previousMonthRow = rows.length > 1 ? rows.at(1) : null;

    const currentMonthInHand = currentMonthRow
      ? Number(currentMonthRow.data[1]) || 0
      : 0;
    const currentMonthExpense = currentMonthRow
      ? Number(currentMonthRow.data[3]) || 0
      : 0;
    const currentMonthRemainder = currentMonthRow
      ? Number(currentMonthRow.data[4]) || 0
      : 0;

    const previousMonthRemainder = previousMonthRow
      ? Number(previousMonthRow.data[4]) || 0
      : 0;

    const previousMonthExpense = previousMonthRow
      ? Number(previousMonthRow.data[3]) || 0
      : 0;

    // Null when there is no earlier total to compare against, which hides the line
    const expenseChangePercent =
      previousMonthExpense > 0
        ? Math.round(
            ((currentMonthExpense - previousMonthExpense) /
              previousMonthExpense) *
              100,
          )
        : null;

    let expenseChangeSubtitle: string | undefined;
    if (expenseChangePercent === 0) {
      expenseChangeSubtitle = "No change from last month";
    } else if (expenseChangePercent !== null) {
      expenseChangeSubtitle = `${expenseChangePercent > 0 ? "+" : ""}${expenseChangePercent}% vs last month`;
    }

    const currentMonthLabel = currentMonthRow
      ? (currentMonthRow.data[0] ?? "")
      : format(getIndiaMonthStart(), "MMMM, yyyy");

    return [
      {
        amount: Math.round(currentMonthInHand),
        subtitle: `${currentMonthLabel}`,
        title: "Current Month In Hand",
      },
      {
        amount: Math.round(currentMonthExpense),
        subtitle: expenseChangeSubtitle,
        title: "Current Month Expenses",
      },
      {
        amount: Math.round(currentMonthRemainder),
        subtitle: (() => {
          if (!previousMonthRow) {
            return "No previous data";
          }

          if (previousMonthRemainder === currentMonthRemainder) {
            return "No change";
          }

          return previousMonthRemainder < currentMonthRemainder
            ? "Gain from last month"
            : "Loss from last month";
        })(),
        title: "Current Month Remainder",
      },
    ];
  }, [rows]);

  return (
    <AmountSummaryCard
      title="Expense Summary"
      rows={summaryData}
      collapsedStateId="monthly-expense-summary-card"
    />
  );
};
