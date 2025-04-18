// @bhaisaab/pages/monthly-expense/components/additional-payment-form.tsx
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
import { AddAdditionalPaymentSchema } from "@bhaisaab/shared/constants/validation/monthly-expenses";
import { useAddAdditionalPayment } from "@bhaisaab/shared/hooks/services/monthly-expenses";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface IAdditionalPaymentFormProps {
  rowIndex: number;
  date: string;
  isOpen: boolean;
  toggleOpen: (open: boolean) => void;
}

type PaymentFormData = z.infer<typeof AddAdditionalPaymentSchema>;

export const AdditionalPaymentForm: FC<IAdditionalPaymentFormProps> = ({
  rowIndex,
  date,
  isOpen,
  toggleOpen,
}) => {
  const { addPayment, isLoading } = useAddAdditionalPayment();

  const { control, handleSubmit, reset } = useForm<PaymentFormData>({
    resolver: zodResolver(AddAdditionalPaymentSchema),
    defaultValues: {
      rowIndex,
      amount: 0,
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    addPayment(
      { rowIndex: data.rowIndex, amount: data.amount },
      {
        onSuccess: () => {
          // Close dialog and reset form on success
          toggleOpen(false);
          reset({ rowIndex, amount: 0 });
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
          <DialogTitle>Add Additional Payment for {date}</DialogTitle>
          <DialogDescription>
            Record an additional payment for this month.
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
                      min={1}
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
