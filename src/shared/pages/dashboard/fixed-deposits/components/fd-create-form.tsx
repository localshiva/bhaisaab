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
import { addYears } from "date-fns/addYears";
import { format } from "date-fns/format";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useToggle } from "react-use";

export const FDCreateForm = () => {
  const [isOpen, toggleOpen] = useToggle(false);
  const { createFixedDeposit, isLoading } = useCreateFixedDeposit();

  const { control, handleSubmit, reset } = useForm<CreateFixedDepositRequest>({
    resolver: zodResolver(CreateFixedDepositSchema),
    defaultValues: {
      amount: 0,
      interestRate: 0,
      depositDate: format(new Date(), "yyyy-MM-dd"),
      maturityDate: format(addYears(new Date(), 1), "yyyy-MM-dd"),
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
                      Deposit Amount
                    </Label>

                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Enter amount"
                      aria-invalid={!!errors.amount}
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

            {/* Interest Rate */}
            <div className="grid gap-2">
              <Controller
                name="interestRate"
                control={control}
                render={({
                  field: { onChange, value, ...field },
                  formState: { errors },
                }) => (
                  <>
                    <Label
                      htmlFor="interestRate"
                      className={errors.interestRate ? "text-destructive" : ""}
                    >
                      Interest Rate (%)
                    </Label>
                    <Input
                      id="interestRate"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Enter interest rate"
                      aria-invalid={!!errors.interestRate}
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
                    {errors.interestRate && (
                      <p className="text-destructive text-sm">
                        {errors.interestRate.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Deposit Date */}
            <div className="grid gap-2">
              <Controller
                name="depositDate"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <>
                    <Label
                      htmlFor="depositDate"
                      className={errors.depositDate ? "text-destructive" : ""}
                    >
                      Deposit Date
                    </Label>

                    <Input
                      id="depositDate"
                      type="date"
                      aria-invalid={errors.depositDate ? "true" : "false"}
                      {...field}
                    />

                    {errors.depositDate && (
                      <p className="text-destructive text-sm">
                        {errors.depositDate.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Maturity Date */}
            <div className="grid gap-2">
              <Controller
                name="maturityDate"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <>
                    <Label
                      htmlFor="maturityDate"
                      className={errors.maturityDate ? "text-destructive" : ""}
                    >
                      Maturity Date
                    </Label>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label
                          htmlFor="maturityYears"
                          className="text-sm mb-1 block"
                        >
                          Years
                        </Label>
                        <Input
                          id="maturityYears"
                          type="number"
                          min="0"
                          max="30"
                          defaultValue="1"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="maturityMonths"
                          className="text-sm mb-1 block"
                        >
                          Months
                        </Label>
                        <Input
                          id="maturityMonths"
                          type="number"
                          min="0"
                          max="11"
                          defaultValue="0"
                        />
                      </div>
                    </div>

                    <Input
                      id="maturityDate"
                      type="date"
                      aria-invalid={errors.maturityDate ? "true" : "false"}
                      {...field}
                    />

                    {errors.maturityDate && (
                      <p className="text-destructive text-sm">
                        {errors.maturityDate.message}
                      </p>
                    )}
                  </>
                )}
              />
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
