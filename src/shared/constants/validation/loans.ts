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
    .min(1, "Amount must be greater than 0"),
});

// Type inference from the Zod schema
export type AddLoanRequest = z.infer<typeof AddLoanSchema>;
