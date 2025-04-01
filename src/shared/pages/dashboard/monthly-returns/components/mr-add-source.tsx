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
import { cn } from "@bhaisaab/shared/utils/shadcn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useToggle } from "react-use";

export const MRAddSource = () => {
  const [isOpen, toggleOpen] = useToggle(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddSourceRequest>({
    resolver: zodResolver(AddSourceSchema),
    defaultValues: {
      type: undefined,
      source: "",
      amount: 0, // Default to 0 instead of undefined
    },
  });

  const onSubmit = (data: AddSourceRequest) => {
    setIsSubmitting(true);
    try {
      // Here you would add your API call to add the source
      // await addSource(data);
      console.info("Form submitted successfully:", data);
    } catch (error) {
      // Handle API error
      console.error("Failed to add source:", error);
    } finally {
      setIsSubmitting(false);
    }
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
              <Label
                htmlFor="type"
                className={errors.type ? "text-destructive" : ""}
              >
                Type
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
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
                )}
              />
              {errors.type && (
                <p className="text-destructive text-sm">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Income Source */}
            <div className="grid gap-2">
              <Label
                htmlFor="source"
                className={errors.source ? "text-destructive" : ""}
              >
                Income Source
              </Label>
              <Controller
                name="source"
                control={control}
                render={({ field }) => (
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
                )}
              />
              {errors.source && (
                <p className="text-destructive text-sm">
                  {errors.source.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="grid gap-2">
              <Label
                htmlFor="amount"
                className={errors.amount ? "text-destructive" : ""}
              >
                Amount
              </Label>
              <Controller
                name="amount"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
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
                        inputValue === "" ? 0 : Math.max(0, Number(inputValue));
                      onChange(numValue);
                    }}
                    value={value}
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
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={toggleOpen}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Source"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
