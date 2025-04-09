// @bhaisaab/shared/constants/validation/loans.ts
import { z } from "zod";

// Define a Zod schema for adding a new loan
export const AddLoanSchema = z.object({
  provider: z.string().min(1, "Provider name is required"),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than 0")
    .min(100, "Amount must be greater than 0"),
});

// Type inference from the Zod schema
export type AddLoanRequest = z.infer<typeof AddLoanSchema>;

// Validation schema for loan payment
export const AddLoanPaymentSchema = z.object({
  rowIndex: z
    .number()
    .int("Row index must be an integer")
    .positive("Row index must be positive"),
  amount: z
    .number()
    .positive("Payment amount must be positive")
    .min(100, "Payment amount must be at least 1"),
});

export type AddLoanPaymentRequest = z.infer<typeof AddLoanPaymentSchema>;
