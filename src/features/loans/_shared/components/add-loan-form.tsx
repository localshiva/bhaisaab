import { useAddLoan } from "@bhaisaab/features/loans/_shared/hooks/use-add-loan";
import { useAddLoanModalStore } from "@bhaisaab/features/loans/_shared/hooks/use-open-add-loan-form";
import {
  AddLoanRequest,
  AddLoanSchema,
} from "@bhaisaab/features/loans/_shared/schemas/loans";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

export const AddLoanForm = () => {
  const { isAddLoanOpen, toggleAddLoan, closeAddLoan } = useAddLoanModalStore();
  const { addLoan, isLoading } = useAddLoan();

  const { control, handleSubmit, reset } = useForm<AddLoanRequest>({
    resolver: zodResolver(AddLoanSchema),
    defaultValues: {
      provider: "",
      amount: 0,
    },
  });

  const onSubmit = (data: AddLoanRequest) => {
    addLoan(data, {
      onSuccess: () => {
        closeAddLoan();
        reset();
      },
      onError: (err: Error) => {
        console.error("Failed to add loan:", err);
        // The mutation's toast meta shows the error to the user.
      },
    });
  };

  return (
    <Dialog open={isAddLoanOpen} onOpenChange={toggleAddLoan}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="size-4" />
          <span>Add new loan</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add new loan</DialogTitle>
          <DialogDescription>
            Add a new loan to track payments and pending amounts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Controller
                name="provider"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <>
                    <Label
                      htmlFor="provider"
                      className={errors.provider ? "text-destructive" : ""}
                    >
                      Loan Provider
                    </Label>

                    <Input
                      id="provider"
                      placeholder="Enter provider name"
                      className={
                        errors.provider
                          ? "border-destructive ring-destructive/20"
                          : ""
                      }
                      {...field}
                    />

                    {errors.provider && (
                      <p className="text-destructive text-sm">
                        {errors.provider.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

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
                      Loan Amount
                    </Label>

                    <Input
                      id="amount"
                      type="number"
                      min={100}
                      placeholder="Enter loan amount"
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
              onClick={closeAddLoan}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Loan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
