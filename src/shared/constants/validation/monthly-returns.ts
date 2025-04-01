// @bhaisaab/shared/constants/validation/monthly-returns.ts
import { z } from "zod";

// Define a Zod schema for the request body
export const AddSourceSchema = z.object({
  type: z.union([z.literal("Salary"), z.literal("Rent")], {
    required_error: "Type is required",
    invalid_type_error: "Type must be either Salary or Rent",
  }),
  source: z.string().min(1, "Source is required"),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .nonnegative("Amount must be zero or greater")
    .min(0, "Amount must be zero or greater"),
});

// Type inference from the Zod schema
export type AddSourceRequest = z.infer<typeof AddSourceSchema>;
