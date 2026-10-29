import { z } from "zod";

/** One message for every invalid amount, since the rule is a single one. */
const AMOUNT_ERROR = "Amount must be a whole number of at least 1";

/** Body of the add source request, validated by the form and the route. */
export const AddSourceSchema = z.object({
  type: z.union([z.literal("Salary"), z.literal("Rent")], {
    required_error: "Type is required",
    invalid_type_error: "Type must be either Salary or Rent",
  }),
  source: z.string().min(1, "Source is required"),
  amount: z
    .number({
      required_error: AMOUNT_ERROR,
      invalid_type_error: AMOUNT_ERROR,
    })
    .int(AMOUNT_ERROR)
    .min(1, AMOUNT_ERROR),
});

export type AddSourceRequest = z.infer<typeof AddSourceSchema>;

/**
 * Body of the delete source request.
 * `id` is the 0-based sheet row, where the header is 0.
 * So, the first source is 1 and the header row can never be deleted.
 */
export const DeleteSourceSchema = z.object(
  {
    id: z.number().min(1, "Row ID must be at least 1"),
    source: z.string().min(1, "Source is required"),
  },
  {
    required_error: "Source information is required",
  },
);

export type DeleteSourceRequest = z.infer<typeof DeleteSourceSchema>;
