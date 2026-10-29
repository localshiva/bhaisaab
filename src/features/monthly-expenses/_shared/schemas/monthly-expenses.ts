import { z } from "zod";

/**
 * Fields the user enters for an expense.
 * The amount is whole rupees. The comment is stored as the cell's note.
 *
 * The comment is trimmed, the same as on edit.
 * So, a comment of only spaces never becomes a note.
 */
export const BaseMonthlyExpenseSchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than 0")
    .int("Amount must be a whole number")
    .min(1, "Amount must be at least 1"),
  comment: z.string().trim().optional(),
});

/** Body of the add expense request, validated by the form and the route. */
export const AddMonthlyExpenseSchema = BaseMonthlyExpenseSchema.extend({
  rowIndex: z
    .number()
    .int()
    .positive()
    .describe("Row index in the spreadsheet (1-based)"),
});

export type BaseMonthlyExpenseRequest = z.infer<
  typeof BaseMonthlyExpenseSchema
>;
export type AddMonthlyExpenseRequest = z.infer<typeof AddMonthlyExpenseSchema>;

/**
 * Body of the additional payment request.
 * The amount is whole rupees.
 * It replaces the month's additional payment, it is not added to it.
 */
export const AddAdditionalPaymentSchema = z.object({
  rowIndex: z.number().int().positive(),
  amount: z
    .number()
    .positive("Amount must be greater than 0")
    .int("Amount must be a whole number")
    .min(1, "Amount must be at least 1"),
});

export type AddAdditionalPaymentRequest = z.infer<
  typeof AddAdditionalPaymentSchema
>;
