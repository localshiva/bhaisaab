// @bhaisaab/pages/spreadsheet/monthly-returns/add-source.tsx
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bhaisaab/shared/components/core/select";
import {
  AddSourceRequest,
  AddSourceSchema,
} from "@bhaisaab/shared/constants/validation/monthly-returns";
import { useAddMonthlyIncomeSource } from "@bhaisaab/shared/hooks/services/monthly-return";
import { cn } from "@bhaisaab/shared/utils/shadcn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useToggle } from "react-use";

export const MRAddSource = () => {
  const [isOpen, toggleOpen] = useToggle(false);
  const { addIncomeSource, isLoading } = useAddMonthlyIncomeSource();

  const { control, handleSubmit, reset } = useForm<AddSourceRequest>({
    resolver: zodResolver(AddSourceSchema),
    defaultValues: {
      type: undefined,
      source: "",
      amount: 0, // Default to 0 instead of undefined
    },
  });

  const onSubmit = (data: AddSourceRequest) => {
    addIncomeSource(data, {
      onSuccess: () => {
        // Close dialog and reset form on success
        toggleOpen(false);
        reset();
      },
      onError: err => {
        console.error("Failed to add source:", err);
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
          <DialogTitle>Add new source</DialogTitle>
          <DialogDescription>
            Add new source of income to your monthly returns.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form */}
          <div className="grid gap-4 py-4">
            {/* Type */}
            <div className="grid gap-2">
              <Controller
                name="type"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <>
                    <Label
                      htmlFor="type"
                      className={errors.type ? "text-destructive" : ""}
                    >
                      Type
                    </Label>

                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="type"
                        className={cn("w-full", {
                          "border-destructive ring-destructive/20": errors.type,
                        })}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Salary">Salary</SelectItem>
                        <SelectItem value="Rent">Rent</SelectItem>
                      </SelectContent>
                    </Select>

                    {errors.type && (
                      <p className="text-destructive text-sm">
                        {errors.type.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Income Source */}
            <div className="grid gap-2">
              <Controller
                name="source"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <>
                    <Label
                      htmlFor="source"
                      className={errors.source ? "text-destructive" : ""}
                    >
                      Income Source
                    </Label>

                    <Input
                      id="source"
                      placeholder="Enter source name"
                      className={
                        errors.source
                          ? "border-destructive ring-destructive/20"
                          : ""
                      }
                      {...field}
                    />

                    {errors.source && (
                      <p className="text-destructive text-sm">
                        {errors.source.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

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
                      Amount
                    </Label>

                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Enter amount"
                      className={
                        errors.amount
                          ? "border-destructive ring-destructive/20"
                          : ""
                      }
                      onChange={e => {
                        // Ensure we always have a non-negative number
                        const inputValue = e.target.value;
                        const numValue =
                          inputValue === ""
                            ? 0
                            : Math.max(0, Number(inputValue));
                        onChange(numValue);
                      }}
                      value={value}
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
              onClick={toggleOpen}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Source"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
