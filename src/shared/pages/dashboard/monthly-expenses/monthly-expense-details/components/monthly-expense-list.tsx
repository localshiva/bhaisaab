// @bhaisaab/pages/monthly-expense/components/monthly-expense-details-page.tsx
import { ConfirmAlertDialog } from "@bhaisaab/shared/components/app/confirm-alert-dialog";
import { Button } from "@bhaisaab/shared/components/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bhaisaab/shared/components/core/card";
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
import { ArrowLeft, Check, Edit2, Plus, Trash2, X } from "lucide-react";
import { FC, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface IMonthlyExpenseListProps {
  rowIndex: number;
  date: string;
  canAddExpenses: boolean;
  onBack: () => void;
}

interface IEditableExpense {
  amount: number;
  comment?: string;
  columnIndex: number;
}

export const MonthlyExpenseList: FC<IMonthlyExpenseListProps> = ({
  rowIndex,
  date,
  canAddExpenses,
  onBack,
}) => {
  const { data: expenses, isLoading } = useMonthlyExpense(rowIndex, true);
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

  const totalAmount = useMemo(() => {
    if (!expenses) return 0;
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

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

  const renderExpenseCard = useCallback(
    (expense: IMonthlyExpense, index: number) => {
      const isEditing = editingExpense?.columnIndex === expense.columnIndex;

      if (isEditing) {
        return (
          <Card key={`expense-${index}`} className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Edit Expense #{index + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0">
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
            </CardFooter>
          </Card>
        );
      }

      return (
        <Card
          key={`expense-${index}`}
          className="hover:bg-muted/5 transition-colors"
        >
          <CardHeader className="pb-2 flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                {formatCurrency(expense.amount)}
              </CardTitle>
              <CardDescription>Item #{index + 1}</CardDescription>
            </div>
            {canAddExpenses && (
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditClick(expense)}
                      >
                        <Edit2 className="size-4" />
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
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(expense)}
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete expense</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </CardHeader>
          {expense.comment && (
            <CardContent className="pt-0 pb-3">
              <Typography variant="body" textColor="muted">
                {expense.comment}
              </Typography>
            </CardContent>
          )}
        </Card>
      );
    },
    [
      canAddExpenses,
      editAmount,
      editComment,
      editingExpense,
      handleSaveEdit,
      isUpdating,
    ],
  );

  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={`skeleton-${i}`}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (!expenses || expenses.length === 0) {
      return (
        <div className="text-center py-12 border rounded-lg bg-muted/5">
          <Typography variant="h3" textColor="muted">
            No expenses recorded
          </Typography>
          <Typography variant="body" textColor="muted" className="mt-2">
            {canAddExpenses
              ? "Add your first expense to get started."
              : "There are no expenses recorded for this month."}
          </Typography>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {expenses.map((expense, index) => renderExpenseCard(expense, index))}
      </div>
    );
  }, [isLoading, expenses, renderExpenseCard, canAddExpenses]);

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto p-4">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back</span>
            </Button>
            <div>
              <Typography variant="h5">Expenses for {date}</Typography>
              {expenses && expenses.length > 0 && (
                <Typography variant="body" textColor="muted">
                  {expenses.length}{" "}
                  {expenses.length === 1 ? "expense" : "expenses"} · Total:{" "}
                  {formatCurrency(totalAmount)}
                </Typography>
              )}
            </div>
          </div>

          {canAddExpenses && (
            <Button>
              <Plus className="size-4 mr-1" />
              Expense
            </Button>
          )}
        </div>

        {renderContent()}
      </div>

      <ConfirmAlertDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        message="Are you sure you want to delete this expense? This action cannot be undone."
        actionLabel={isDeleting ? "Deleting..." : "Delete"}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
