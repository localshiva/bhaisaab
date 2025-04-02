// @bhaisaab/shared/constants/validation/fixed-deposits.ts
import { z } from "zod";

// Helper function to ensure date is in YYYY-MM-DD format
const dateStringValidator = z
  .string()
  .refine(val => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: "Date must be in YYYY-MM-DD format",
  });

// Define a Zod schema for creating a fixed deposit
export const CreateFixedDepositSchema = z
  .object({
    amount: z
      .number()
      .positive("Amount must be positive")
      .min(1, "Amount is required"),
    interestRate: z
      .number()
      .positive("Interest rate must be positive")
      .min(0.01, "Interest rate is required")
      .max(100, "Interest rate cannot exceed 100%"),
    depositDate: dateStringValidator,
    maturityDate: dateStringValidator,
  })
  .refine(
    data => {
      const depositDate = new Date(data.depositDate);
      const maturityDate = new Date(data.maturityDate);
      return maturityDate > depositDate;
    },
    {
      message: "Maturity date must be after deposit date",
      path: ["maturityDate"],
    },
  );

// Type inference from the Zod schema
export type CreateFixedDepositRequest = z.infer<
  typeof CreateFixedDepositSchema
>;
