import { z } from "zod";

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

export type AddLoanRequest = z.infer<typeof AddLoanSchema>;

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

export const DeleteLoanSchema = z.object({
  rowIndex: z
    .number()
    .int("Row index must be an integer")
    .positive("Row index must be positive"),
});

export const LoanPaymentsSchema = z.object({
  rowIndex: z
    .number()
    .int("Row index must be an integer")
    .positive("Row index must be positive"),
});

export type LoanPaymentsRequest = z.infer<typeof LoanPaymentsSchema>;
