// @bhaisaab/pages/spreadsheet/fixed-deposits/components/fd-create-form.tsx
import { Button } from "@bhaisaab/shared/components/core/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@bhaisaab/shared/components/core/dialog";
import { Input } from "@bhaisaab/shared/components/core/input";
import { Label } from "@bhaisaab/shared/components/core/label";
import {
  CreateFixedDepositRequest,
  CreateFixedDepositSchema,
} from "@bhaisaab/shared/constants/validation/fixed-deposits";
import { useCreateFixedDeposit } from "@bhaisaab/shared/hooks/services/fixed-deposits";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useToggle } from "react-use";

export const FDCreateForm = () => {
  const [isOpen, toggleOpen] = useToggle(false);
  const { createFixedDeposit, isLoading } = useCreateFixedDeposit();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFixedDepositRequest>({
    resolver: zodResolver(CreateFixedDepositSchema),
    defaultValues: {
      amount: 0,
      interestRate: 0,
      depositDate: new Date().toISOString().split("T")[0], // Today in YYYY-MM-DD format
      maturityDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      )
        .toISOString()
        .split("T")[0], // One year from today
    },
  });

  const onSubmit = (data: CreateFixedDepositRequest) => {
    createFixedDeposit(data, {
      onSuccess: () => {
        // Close dialog and reset form on success
        toggleOpen(false);
        reset();
      },
      onError: err => {
        console.error("Failed to create fixed deposit:", err);
        // Error handling is done by the hook and toast notifications
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="size-4" />
          <span>Add new</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Add new fixed deposit</DialogTitle>
          <DialogDescription>
            Add a new fixed deposit to track interest and maturity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form */}
          <div className="grid gap-4 py-4">
            {/* Amount */}
            <div className="grid gap-2">
              <Label
                htmlFor="amount"
                className={errors.amount ? "text-destructive" : ""}
              >
                Deposit Amount
              </Label>
              <Controller
                name="amount"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Enter amount"
                    className={
                      errors.amount
                        ? "border-destructive ring-destructive/20"
                        : ""
                    }
                    onChange={e => {
                      // Ensure we always have a positive number
                      const inputValue = e.target.value;
                      const numValue =
                        inputValue === "" ? 0 : Math.max(1, Number(inputValue));
                      onChange(numValue);
                    }}
                    value={value || ""}
                    {...field}
                  />
                )}
              />
              {errors.amount && (
                <p className="text-destructive text-sm">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Interest Rate */}
            <div className="grid gap-2">
              <Label
                htmlFor="interestRate"
                className={errors.interestRate ? "text-destructive" : ""}
              >
                Interest Rate (%)
              </Label>
              <Controller
                name="interestRate"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    id="interestRate"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Enter interest rate"
                    className={
                      errors.interestRate
                        ? "border-destructive ring-destructive/20"
                        : ""
                    }
                    onChange={e => {
                      const inputValue = e.target.value;
                      const numValue =
                        inputValue === ""
                          ? 0
                          : Math.min(100, Math.max(0.01, Number(inputValue)));
                      onChange(numValue);
                    }}
                    value={value || ""}
                    {...field}
                  />
                )}
              />
              {errors.interestRate && (
                <p className="text-destructive text-sm">
                  {errors.interestRate.message}
                </p>
              )}
            </div>

            {/* Deposit Date */}
            <div className="grid gap-2">
              <Label
                htmlFor="depositDate"
                className={errors.depositDate ? "text-destructive" : ""}
              >
                Deposit Date
              </Label>
              <Controller
                name="depositDate"
                control={control}
                render={({ field }) => (
                  <Input
                    id="depositDate"
                    type="date"
                    className={
                      errors.depositDate
                        ? "border-destructive ring-destructive/20"
                        : ""
                    }
                    {...field}
                  />
                )}
              />
              {errors.depositDate && (
                <p className="text-destructive text-sm">
                  {errors.depositDate.message}
                </p>
              )}
            </div>

            {/* Maturity Date */}
            <div className="grid gap-2">
              <Label
                htmlFor="maturityDate"
                className={errors.maturityDate ? "text-destructive" : ""}
              >
                Maturity Date
              </Label>
              <Controller
                name="maturityDate"
                control={control}
                render={({ field }) => (
                  <Input
                    id="maturityDate"
                    type="date"
                    className={
                      errors.maturityDate
                        ? "border-destructive ring-destructive/20"
                        : ""
                    }
                    {...field}
                  />
                )}
              />
              {errors.maturityDate && (
                <p className="text-destructive text-sm">
                  {errors.maturityDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
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
              {isLoading ? "Creating..." : "Create Deposit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
