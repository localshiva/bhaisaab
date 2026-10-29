import { z } from "zod";

export const AddLoanSchema = z.object({
  provider: z.string().min(1, "Provider name is required"),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than 0")
    .min(1, "Amount must be at least 1"),
});

export type AddLoanRequest = z.infer<typeof AddLoanSchema>;

/**
 * 1-based sheet row of a loan, as the payment endpoints take it.
 * Row 1 is the header and holds no loan.
 */
const loanRowIndexSchema = z
  .number()
  .int("Row index must be an integer")
  .min(2, "Row index must be at least 2");

export const AddLoanPaymentSchema = z.object({
  rowIndex: loanRowIndexSchema,
  amount: z
    .number()
    .positive("Payment amount must be positive")
    .min(1, "Payment amount must be at least 1"),
});

export type AddLoanPaymentRequest = z.infer<typeof AddLoanPaymentSchema>;

export const DeleteLoanSchema = z.object({
  rowIndex: z
    .number()
    .int("Row index must be an integer")
    .positive("Row index must be positive"),
});

export const LoanPaymentsSchema = z.object({
  rowIndex: loanRowIndexSchema,
});

export type LoanPaymentsRequest = z.infer<typeof LoanPaymentsSchema>;
