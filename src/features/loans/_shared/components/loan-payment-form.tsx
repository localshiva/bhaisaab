import { useAddLoanPayment } from "@bhaisaab/features/loans/_shared/hooks/use-add-loan-payment";
import { AddLoanPaymentSchema } from "@bhaisaab/features/loans/_shared/schemas/loans";
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

/**
 * The form collects only the amount. The row index comes from the loan
 * the dialog was opened for.
 */
const PaymentAmountSchema = AddLoanPaymentSchema.pick({ amount: true });

type PaymentAmountValues = z.infer<typeof PaymentAmountSchema>;

export const LoanPaymentForm: FC<LoanPaymentFormProps> = ({
  rowIndex,
  provider,
  pendingAmount,
  isOpen,
  toggleOpen,
}) => {
  const { addPayment, isLoading } = useAddLoanPayment();

  const { control, handleSubmit, reset } = useForm<PaymentAmountValues>({
    resolver: zodResolver(PaymentAmountSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = (data: PaymentAmountValues) => {
    addPayment(
      { rowIndex, amount: data.amount },
      {
        onSuccess: () => {
          toggleOpen(false);
          reset();
        },
        onError: (err: Error) => {
          console.error("Failed to add payment:", err);
          // The mutation's toast meta shows the error to the user.
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment for {provider}</DialogTitle>
          <DialogDescription>
            Record a payment towards this loan. Pending amount:{" "}
            {formatCurrency(pendingAmount)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
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
                      min={1}
                      max={pendingAmount}
                      step={1}
                      placeholder="Enter payment amount"
                      className={
                        errors.amount
                          ? "border-destructive ring-destructive/20"
                          : ""
                      }
                      onChange={e => {
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
