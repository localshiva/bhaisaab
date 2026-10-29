import {
  isCurrentIndiaMonth,
  parseMonthYear,
} from "@bhaisaab/features/monthly-expenses/_shared/utils/current-month";
import { Badge } from "@bhaisaab/shared/components/core/badge";
import { Button } from "@bhaisaab/shared/components/core/button";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { formatCurrency } from "@bhaisaab/shared/utils/currency";
import { cn } from "@bhaisaab/shared/utils/shadcn";
import { format } from "date-fns";
import { CalendarDays, Pencil, Plus, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, memo, useCallback } from "react";
import { useToggle } from "react-use";
import { toast } from "sonner";

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

/**
 * Looks disabled but stays clickable,
 * so pressing it can explain why it is locked.
 */
const lockedButtonClass =
  "opacity-50 cursor-not-allowed hover:bg-background dark:hover:bg-input/30";

/**
 * Card for one month. Clicking it opens the month's expense details.
 *
 * Only the current month accepts new expenses and payments.
 * For past months the buttons stay clickable and explain the lock in a toast.
 */
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

    const numInHand = Number(inHand) || 0;
    const numAdditionalPayment = Number(additionalPayment) || 0;
    const numTotalExpense = Number(totalExpense) || 0;
    const numRemainder = Number(remainder) || 0;

    const expenseDate = parseMonthYear(date);
    const monthLabel = format(expenseDate, "MMM, yyyy");

    const isCurrentMonth = isCurrentIndiaMonth(date);

    const expensePercentage =
      numInHand > 0
        ? Math.min(100, Math.round((numTotalExpense / numInHand) * 100))
        : 0;

    const handleCardClick = useCallback(() => {
      const queryString = `?rowIndex=${originalRowIndex}&date=${encodeURIComponent(date)}&canAddExpenses=${isCurrentMonth}`;
      router.push(`/monthly-expenses/monthly-expense-details${queryString}`);
    }, [date, isCurrentMonth, router, originalRowIndex]);

    const showLockedToast = useCallback(() => {
      toast.info(
        `${monthLabel} is a past month. You can only add payments and expenses for the current month.`,
      );
    }, [monthLabel]);

    const onAddExpense = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (!isCurrentMonth) {
          showLockedToast();
          return;
        }

        toggleAddExpenseOpen(true);
      },
      [isCurrentMonth, showLockedToast, toggleAddExpenseOpen],
    );

    const onAddPayment = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (!isCurrentMonth) {
          showLockedToast();
          return;
        }

        toggleAddPaymentOpen(true);
      },
      [isCurrentMonth, showLockedToast, toggleAddPaymentOpen],
    );

    return (
      <>
        <div
          className="border rounded-lg overflow-hidden shadow-sm bg-card hover:shadow-md transition-shadow flex flex-col cursor-pointer"
          onClick={handleCardClick}
          role="button"
        >
          <div className="h-1 w-full bg-primary" />

          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-5 text-muted-foreground" />
                <Typography variant="h5" weight="semibold">
                  {monthLabel}
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

            <div className="mt-4 p-3 rounded-lg flex items-center gap-2 bg-blue-50 dark:bg-blue-950/20">
              <Receipt className="size-5 text-blue-600 shrink-0" />
              <Typography variant="small">
                {isCurrentMonth
                  ? "You can add expenses for this month."
                  : "This is a past month, expenses are locked."}
              </Typography>
            </div>

            <div
              className="flex flex-wrap gap-2 pt-4"
              onClick={e => e.stopPropagation()}
            >
              <Button
                variant="outline"
                size="default"
                className={cn("flex-1", !isCurrentMonth && lockedButtonClass)}
                onClick={onAddPayment}
                aria-disabled={!isCurrentMonth}
              >
                <Pencil className="size-4" />
                Addn. Payment
              </Button>
              <Button
                variant="outline"
                size="default"
                className={cn("flex-1", !isCurrentMonth && lockedButtonClass)}
                onClick={onAddExpense}
                aria-disabled={!isCurrentMonth}
              >
                <Plus className="size-4" />
                Expenses
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
