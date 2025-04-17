// @bhaisaab/pages/monthly-expense/components/monthly-expense-details-dialog.tsx
import { ConfirmAlertDialog } from "@bhaisaab/shared/components/app/confirm-alert-dialog";
import { Button } from "@bhaisaab/shared/components/core/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@bhaisaab/shared/components/core/dialog";
import { Input } from "@bhaisaab/shared/components/core/input";
import { Label } from "@bhaisaab/shared/components/core/label";
import { Skeleton } from "@bhaisaab/shared/components/core/skeleton";
import { Textarea } from "@bhaisaab/shared/components/core/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@bhaisaab/shared/components/core/tooltip";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import {
  useExpenseDelete,
  useExpenseEdit,
  useMonthlyExpense,
} from "@bhaisaab/shared/hooks/services/monthly-expenses";
import { IMonthlyExpense } from "@bhaisaab/shared/services/spreadsheet/monthly-expenses/get-expenses";
import { formatCurrency } from "@bhaisaab/shared/utils/currency";
import { Check, Edit2, Trash2, X } from "lucide-react";
import { FC, useCallback, useState } from "react";
import { toast } from "sonner";

interface MonthlyExpenseDetailsDialogProps {
  rowIndex: number;
  date: string;
  isOpen: boolean;
  canAddExpenses: boolean;
  toggleOpen: (open: boolean) => void;
}

interface IEditableExpense {
  amount: number;
  comment?: string;
  columnIndex: number;
}

export const MonthlyExpenseDetailsDialog: FC<
  MonthlyExpenseDetailsDialogProps
> = ({ rowIndex, date, isOpen, toggleOpen, canAddExpenses }) => {
  const { data: expenses, isLoading } = useMonthlyExpense(rowIndex, isOpen);
  const { updateExpense, isLoading: isUpdating } = useExpenseEdit();
  const { deleteExpense, isLoading: isDeleting } = useExpenseDelete();

  const [editingExpense, setEditingExpense] = useState<IEditableExpense | null>(
    null,
  );
  const [editAmount, setEditAmount] = useState<string>("");
  const [editComment, setEditComment] = useState<string>("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] =
    useState<IEditableExpense | null>(null);

  const handleEditClick = (expense: IEditableExpense) => {
    setEditingExpense(expense);
    setEditAmount(expense.amount.toString());
    setEditComment(expense.comment ?? "");
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleSaveEdit = useCallback(() => {
    if (!editingExpense) return;

    const amount = Number.parseFloat(editAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    updateExpense(
      {
        rowIndex,
        columnIndex: editingExpense.columnIndex,
        amount,
        comment: editComment.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Expense updated successfully");
          setEditingExpense(null);
        },
      },
    );
  }, [editAmount, editComment, editingExpense, rowIndex, updateExpense]);

  const handleDeleteClick = (expense: IEditableExpense) => {
    setExpenseToDelete(expense);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!expenseToDelete) return;

    deleteExpense(
      {
        rowIndex,
        columnIndex: expenseToDelete.columnIndex,
      },
      {
        onSuccess: () => {
          toast.success("Expense deleted successfully");
          setDeleteConfirmOpen(false);
          setExpenseToDelete(null);
        },
      },
    );
  };

  const renderActionables = useCallback(
    (expense: IMonthlyExpense, index: number) => {
      if (editingExpense?.columnIndex === expense.columnIndex) {
        return (
          // Edit mode
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor={`amount-${index}`}>Amount</Label>
              <Input
                id={`amount-${index}`}
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
                type="number"
                min="1"
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`comment-${index}`}>Comment (Optional)</Label>
              <Textarea
                id={`comment-${index}`}
                value={editComment}
                onChange={e => setEditComment(e.target.value)}
                placeholder="Add a comment"
                disabled={isUpdating}
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isUpdating}
              >
                <X className="size-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEdit} disabled={isUpdating}>
                {isUpdating ? (
                  "Saving..."
                ) : (
                  <>
                    <Check className="size-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        );
      }

      // View mode
      return (
        // View mode
        <>
          <div className="flex justify-between items-center mb-1">
            <Typography variant="body" weight="semibold">
              {formatCurrency(expense.amount)}
            </Typography>
            <div className="flex items-center gap-1">
              <Typography variant="small" textColor="muted" className="mr-2">
                Item #{index + 1}
              </Typography>

              {canAddExpenses ? (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEditClick(expense)}
                        >
                          <Edit2 className="size-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit expense</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(expense)}
                        >
                          <Trash2 className="size-3.5" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete expense</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              ) : null}
            </div>
          </div>
          {expense.comment && (
            <Typography variant="small" textColor="muted">
              {expense.comment}
            </Typography>
          )}
        </>
      );
    },
    [
      canAddExpenses,
      editAmount,
      editComment,
      editingExpense?.columnIndex,
      handleSaveEdit,
      isUpdating,
    ],
  );

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
              {renderActionables(expense, index)}
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
  }, [isLoading, expenses, renderActionables]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={toggleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Expenses for {date}</DialogTitle>
            <DialogDescription>
              View, edit or delete expenses for this month.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">{renderContent()}</div>

          <DialogFooter>
            <Button onClick={() => toggleOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmAlertDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        message="Are you sure you want to delete this expense? This action cannot be undone."
        actionLabel={isDeleting ? "Deleting..." : "Delete"}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
