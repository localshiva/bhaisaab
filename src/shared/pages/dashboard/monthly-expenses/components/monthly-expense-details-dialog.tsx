// @bhaisaab/pages/monthly-expense/components/monthly-expense-details-dialog.tsx
import { Button } from "@bhaisaab/shared/components/core/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@bhaisaab/shared/components/core/dialog";
import { Skeleton } from "@bhaisaab/shared/components/core/skeleton";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { useMonthlyExpense } from "@bhaisaab/shared/hooks/services/monthly-expenses";
import { formatCurrency } from "@bhaisaab/shared/utils/currency";
import { FC, useCallback } from "react";

interface MonthlyExpenseDetailsDialogProps {
  rowIndex: number;
  date: string;
  isOpen: boolean;
  toggleOpen: (open: boolean) => void;
}

export const MonthlyExpenseDetailsDialog: FC<
  MonthlyExpenseDetailsDialogProps
> = ({ rowIndex, date, isOpen, toggleOpen }) => {
  const { data: expenses, isLoading } = useMonthlyExpense(rowIndex);

  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }
    if (expenses && expenses.length > 0) {
      return (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {expenses.map((expense, index) => (
            <div
              key={`expense-${index}`}
              className="border rounded-lg p-3 bg-muted/10"
            >
              <div className="flex justify-between items-center mb-1">
                <Typography variant="body" weight="semibold">
                  {formatCurrency(expense.amount)}
                </Typography>
                <Typography variant="small" textColor="muted">
                  Item #{index + 1}
                </Typography>
              </div>
              {expense.comment && (
                <Typography variant="small" textColor="muted">
                  {expense.comment}
                </Typography>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        <Typography variant="body" textColor="muted">
          No expenses recorded for this month.
        </Typography>
      </div>
    );
  }, [isLoading, expenses]);

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Expenses for {date}</DialogTitle>
          <DialogDescription>
            View all expenses recorded for this month.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">{renderContent()}</div>

        <DialogFooter>
          <Button onClick={() => toggleOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
