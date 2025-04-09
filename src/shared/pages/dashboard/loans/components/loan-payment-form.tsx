// @bhaisaab/pages/spreadsheet/loan-report/components/loan-payment-form.tsx
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
import { useAddLoanPayment } from "@bhaisaab/shared/hooks/services/loan";
import { formatCurrency } from "@bhaisaab/shared/utils/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface LoanPaymentFormProps {
  rowIndex: number;
  provider: string;
  pendingAmount: number;
  isOpen: boolean;
  toggleOpen: (open: boolean) => void;
}

export const AddLoanPaymentSchema = z.object({
  amount: z
    .number()
    .positive("Payment amount must be positive")
    .min(100, "Payment amount must be at least 1"),
});

export type AddLoanPaymentRequest = z.infer<typeof AddLoanPaymentSchema>;

export const LoanPaymentForm: FC<LoanPaymentFormProps> = ({
  rowIndex,
  provider,
  pendingAmount,
  isOpen,
  toggleOpen,
}) => {
  const { addPayment, isLoading } = useAddLoanPayment();

  const { control, handleSubmit, reset } = useForm<AddLoanPaymentRequest>({
    resolver: zodResolver(AddLoanPaymentSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = (data: AddLoanPaymentRequest) => {
    addPayment(
      { rowIndex, amount: data.amount },
      {
        onSuccess: () => {
          // Close dialog and reset form on success
          toggleOpen(false);
          reset();
        },
        onError: (err: Error) => {
          console.error("Failed to add payment:", err);
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
          <DialogTitle>Add Payment for {provider}</DialogTitle>
          <DialogDescription>
            Record a payment towards this loan. Pending amount:{" "}
            {formatCurrency(pendingAmount)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form */}
          <div className="grid gap-4 py-4">
            {/* Payment Amount */}
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
                      Payment Amount
                    </Label>

                    <Input
                      id="amount"
                      type="number"
                      min={100}
                      max={pendingAmount}
                      placeholder="Enter payment amount"
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
                            : Math.min(
                                pendingAmount,
                                Math.max(1, Number(inputValue)),
                              );
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
              {isLoading ? "Processing..." : "Add Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
