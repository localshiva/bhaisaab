import { z } from "zod";

/** Body of the add source request, validated by the form and the route. */
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

export type AddSourceRequest = z.infer<typeof AddSourceSchema>;

/**
 * Body of the delete source request.
 * `id` is the 0-based sheet row, where the header is 0.
 */
export const DeleteSourceSchema = z.object(
  {
    id: z.number().min(0, "Row ID is required"),
    source: z.string().min(1, "Source is required"),
  },
  {
    required_error: "Source information is required",
  },
);

export type DeleteSourceRequest = z.infer<typeof DeleteSourceSchema>;
