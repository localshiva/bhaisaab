// @bhaisaab/pages/monthly-expense/components/monthly-expense-list-item.tsx
import { Badge } from "@bhaisaab/shared/components/core/badge";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { formatCurrency } from "@bhaisaab/shared/utils/currency";
import { cn } from "@bhaisaab/shared/utils/shadcn";
import { format, subMonths } from "date-fns";
import { CalendarDays, Receipt } from "lucide-react";
import { FC, memo } from "react";

import { MonthlyExpenseActions } from "./monthly-expense-actions";

interface MonthlyExpenseListItemProps {
  id: number;
  date: string;
  inHand: string;
  totalExpense: string;
  remainder: string;
}

export const MonthlyExpenseListItem: FC<MonthlyExpenseListItemProps> = memo(
  ({ id, date, inHand, totalExpense, remainder }) => {
    // Convert string values to numbers
    const numInHand = Number(inHand) || 0;
    const numTotalExpense = Number(totalExpense) || 0;
    const numRemainder = Number(remainder) || 0;

    // Parse date and determine if it's current or previous month
    const expenseDate = new Date(date);
    const currentMonth = new Date();
    const previousMonth = subMonths(currentMonth, 1);

    const isCurrentMonth =
      format(expenseDate, "MMMM, yyyy") === format(currentMonth, "MMMM, yyyy");
    const isPreviousMonth =
      format(expenseDate, "MMMM, yyyy") === format(previousMonth, "MMMM, yyyy");

    // Calculate expense percentage
    const expensePercentage =
      numInHand > 0
        ? Math.min(100, Math.round((numTotalExpense / numInHand) * 100))
        : 0;

    // Determine if user can add expenses (only current and previous month)
    const canAddExpenses = isCurrentMonth || isPreviousMonth;

    return (
      <div className="border rounded-lg overflow-hidden shadow-sm bg-card hover:shadow-md transition-shadow flex flex-col">
        {/* Top colored strip */}
        <div className="h-1 w-full bg-primary" />

        <div className="p-4">
          {/* Header with month and status */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-5 text-muted-foreground" />
              <Typography variant="h5" weight="semibold">
                {format(expenseDate, "MMM, yyyy")}
              </Typography>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={"outline"}
                className={cn(
                  "rounded-full px-3 py-1",
                  isCurrentMonth
                    ? "bg-blue-500/15 text-blue-700 hover:bg-blue-500/20 border-blue-200"
                    : "bg-gray-500/15 text-gray-700 hover:bg-gray-500/20 border-gray-200",
                )}
              >
                {isCurrentMonth ? "Current" : "Past"}
              </Badge>

              <MonthlyExpenseActions
                id={id}
                date={date}
                canAddExpenses={canAddExpenses}
              />
            </div>
          </div>

          {/* Expense details */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <Typography variant="body" textColor="muted">
                In Hand
              </Typography>
              <Typography variant="body" weight="semibold">
                {formatCurrency(numInHand)}
              </Typography>
            </div>

            <div className="flex justify-between">
              <Typography variant="body" textColor="muted">
                Total Expense
              </Typography>
              <Typography
                variant="body"
                weight="semibold"
                className="text-red-600"
              >
                {formatCurrency(numTotalExpense)}
              </Typography>
            </div>

            <div className="flex justify-between">
              <Typography variant="body" textColor="muted">
                Remainder
              </Typography>
              <Typography
                variant="body"
                weight="semibold"
                className="text-green-600"
              >
                {formatCurrency(numRemainder)}
              </Typography>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Typography variant="small" textColor="muted">
                Expense Utilization
              </Typography>
              <Typography variant="small" weight="medium">
                {expensePercentage}%
              </Typography>
            </div>

            <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full", {
                  "bg-red-500": expensePercentage > 80,
                  "bg-amber-500":
                    expensePercentage > 60 && expensePercentage <= 80,
                  "bg-green-500": expensePercentage <= 60,
                })}
                style={{ width: `${expensePercentage}%` }}
              />
            </div>
          </div>

          {/* Status message */}
          <div className="mt-4 p-3 rounded-lg flex items-center gap-2 bg-blue-50 dark:bg-blue-950/20">
            <Receipt className="size-5 text-blue-600 shrink-0" />
            <Typography variant="small">
              {canAddExpenses
                ? "You can add expenses for this month."
                : "This is a past month, expenses are locked."}
            </Typography>
          </div>
        </div>
      </div>
    );
  },
);

MonthlyExpenseListItem.displayName = "MonthlyExpenseListItem";
