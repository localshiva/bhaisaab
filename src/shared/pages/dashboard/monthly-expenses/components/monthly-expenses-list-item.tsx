// @bhaisaab/pages/monthly-expense/components/monthly-expense-list-item.tsx
import { Badge } from "@bhaisaab/shared/components/core/badge";
import { Button } from "@bhaisaab/shared/components/core/button";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { formatCurrency } from "@bhaisaab/shared/utils/currency";
import { cn } from "@bhaisaab/shared/utils/shadcn";
import { format } from "date-fns";
import { CalendarDays, DollarSign, Plus, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, memo, useCallback } from "react";
import { useToggle } from "react-use";

import { AdditionalPaymentForm } from "./additional-payment-form";
import { MonthlyExpenseForm } from "./monthly-expense-form";

interface MonthlyExpenseListItemProps {
  originalRowIndex: number;
  date: string;
  inHand: string;
  additionalPayment: string;
  totalExpense: string;
  remainder: string;
}

function parseMonthYear(dateStr: string): Date {
  const [month, yearStr] = dateStr.split(",").map(part => part.trim());
  const year = Number.parseInt(yearStr, 10);

  // Create a date string in a format widely supported
  const formattedDate = `${month} 1, ${year}`;
  return new Date(formattedDate);
}

export const MonthlyExpenseListItem: FC<MonthlyExpenseListItemProps> = memo(
  ({
    originalRowIndex,
    date,
    inHand,
    totalExpense,
    additionalPayment,
    remainder,
  }) => {
    const router = useRouter();
    const [isAddExpenseOpen, toggleAddExpenseOpen] = useToggle(false);
    const [isAddPaymentOpen, toggleAddPaymentOpen] = useToggle(false);

    // Convert string values to numbers
    const numInHand = Number(inHand) || 0;
    const numAdditionalPayment = Number(additionalPayment) || 0;
    const numTotalExpense = Number(totalExpense) || 0;
    const numRemainder = Number(remainder) || 0;

    // Parse date and determine if it's current or previous month
    const expenseDate = new Date(parseMonthYear(date));
    const currentMonth = new Date();

    const isCurrentMonth =
      format(expenseDate, "MMMM, yyyy") === format(currentMonth, "MMMM, yyyy");

    // Calculate expense percentage
    const expensePercentage =
      numInHand > 0
        ? Math.min(100, Math.round((numTotalExpense / numInHand) * 100))
        : 0;

    const handleCardClick = useCallback(() => {
      const queryString = `?rowIndex=${originalRowIndex}&date=${encodeURIComponent(date)}&canAddExpenses=${isCurrentMonth}`;
      router.push(`/monthly-expenses/monthly-expense-details${queryString}`);
    }, [date, isCurrentMonth, router, originalRowIndex]);

    const onAddExpense = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        toggleAddExpenseOpen(true);
      },
      [toggleAddExpenseOpen],
    );

    const onAddPayment = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        toggleAddPaymentOpen(true);
      },
      [toggleAddPaymentOpen],
    );

    return (
      <>
        <div
          className="border rounded-lg overflow-hidden shadow-sm bg-card hover:shadow-md transition-shadow flex flex-col cursor-pointer"
          onClick={handleCardClick}
          role="button"
        >
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
                  Additional Payment
                </Typography>
                <Typography
                  variant="body"
                  weight="semibold"
                  className="text-green-600"
                >
                  {formatCurrency(numAdditionalPayment)}
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
                  className={cn({
                    "text-red-600": numRemainder < 0,
                    "text-green-600": numRemainder > 0,
                  })}
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
                {isCurrentMonth
                  ? "You can add expenses for this month."
                  : "This is a past month, expenses are locked."}
              </Typography>
            </div>

            {/* Show action buttons directly if expenses can be added */}
            <div className="flex gap-2 pt-4" onClick={e => e.stopPropagation()}>
              <Button
                variant="outline"
                size="default"
                className="flex-1"
                onClick={onAddPayment}
                disabled={!isCurrentMonth}
              >
                <Plus className="mr-1 size-4" />
                Payment
              </Button>
              <Button
                variant="outline"
                size="default"
                className="flex-1"
                onClick={onAddExpense}
                disabled={!isCurrentMonth}
              >
                <DollarSign className="mr-1 size-4" />
                Expense
              </Button>
            </div>
          </div>
        </div>

        <MonthlyExpenseForm
          rowIndex={originalRowIndex}
          date={date}
          isOpen={isAddExpenseOpen}
          toggleOpen={toggleAddExpenseOpen}
        />

        <AdditionalPaymentForm
          rowIndex={originalRowIndex}
          date={date}
          isOpen={isAddPaymentOpen}
          toggleOpen={toggleAddPaymentOpen}
        />
      </>
    );
  },
);

MonthlyExpenseListItem.displayName = "MonthlyExpenseListItem";
