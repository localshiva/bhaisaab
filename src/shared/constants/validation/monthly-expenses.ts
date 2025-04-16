// @bhaisaab/shared/constants/validation/monthly-expenses.ts
import { z } from "zod";

// Shared between client & server
export const BaseMonthlyExpenseSchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than 0")
    .min(100, "Amount must be greater than 0"),
  comment: z.string().optional(),
});

// Only used server-side
export const AddMonthlyExpenseSchema = BaseMonthlyExpenseSchema.extend({
  rowIndex: z
    .number()
    .int()
    .positive()
    .describe("Row index in the spreadsheet (1-based)"),
});

// Types
export type BaseMonthlyExpenseRequest = z.infer<
  typeof BaseMonthlyExpenseSchema
>;
export type AddMonthlyExpenseRequest = z.infer<typeof AddMonthlyExpenseSchema>;
