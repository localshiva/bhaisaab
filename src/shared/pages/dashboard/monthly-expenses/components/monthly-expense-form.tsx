// @bhaisaab/pages/monthly-expense/components/monthly-expense-form.tsx
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
import { Textarea } from "@bhaisaab/shared/components/core/textarea";
import { AddMonthlyExpenseSchema } from "@bhaisaab/shared/constants/validation/monthly-expenses";
import { useAddMonthlyExpense } from "@bhaisaab/shared/hooks/services/monthly-expenses";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface MonthlyExpenseFormProps {
  rowIndex: number;
  date: string;
  isOpen: boolean;
  toggleOpen: (open: boolean) => void;
}

type ExpenseFormData = z.infer<typeof AddMonthlyExpenseSchema>;

export const MonthlyExpenseForm: FC<MonthlyExpenseFormProps> = ({
  rowIndex,
  date,
  isOpen,
  toggleOpen,
}) => {
  const { addPayment, isLoading } = useAddMonthlyExpense();

  const { control, handleSubmit, reset } = useForm<ExpenseFormData>({
    resolver: zodResolver(AddMonthlyExpenseSchema),
    defaultValues: {
      rowIndex,
      amount: 0,
      comment: "",
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    addPayment(
      { rowIndex: data.rowIndex, amount: data.amount, comment: data.comment },
      {
        onSuccess: () => {
          // Close dialog and reset form on success
          toggleOpen(false);
          reset({ rowIndex, amount: 0, comment: "" });
        },
        onError: (err: Error) => {
          console.error("Failed to add expense:", err);
          // Error handling will be done by the hook and toast notifications
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogContent className="sm:max-w-md">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Add Expense for {date}</DialogTitle>
          <DialogDescription>
            Record an expense for this month with optional details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form */}
          <div className="grid gap-4 py-4">
            {/* Expense Amount */}
            <div className="grid gap-2">
              <Controller
                name="amount"
                control={control}
                render={({
                  field: { onChange, value, ...field },
                  formState: { errors },
                }) => (
                  <>
                    <Label
                      htmlFor="amount"
                      className={errors.amount ? "text-destructive" : ""}
                    >
                      Expense Amount
                    </Label>

                    <Input
                      id="amount"
                      type="number"
                      min={1}
                      placeholder="Enter expense amount"
                      className={
                        errors.amount
                          ? "border-destructive ring-destructive/20"
                          : ""
                      }
                      onChange={e => {
                        // Ensure we always have a positive number
                        const inputValue = e.target.value;
                        const numValue =
                          inputValue === ""
                            ? 0
                            : Math.max(1, Number(inputValue));
                        onChange(numValue);
                      }}
                      value={value || ""}
                      {...field}
                    />

                    {errors.amount && (
                      <p className="text-destructive text-sm">
                        {errors.amount.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Comment */}
            <div className="grid gap-2">
              <Controller
                name="comment"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <>
                    <Label
                      htmlFor="comment"
                      className={errors.comment ? "text-destructive" : ""}
                    >
                      Comment (Optional)
                    </Label>

                    <Textarea
                      id="comment"
                      placeholder="E.g., Car maintenance at Lakozy"
                      className={
                        errors.comment
                          ? "border-destructive ring-destructive/20"
                          : ""
                      }
                      {...field}
                    />

                    {errors.comment && (
                      <p className="text-destructive text-sm">
                        {errors.comment.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => toggleOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
