import { addMonths, addYears } from "date-fns";
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
      .min(0.01, "Interest rate is required")
      .positive("Interest rate must be positive")
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
  )
  .refine(
    data => {
      const depositDate = new Date(data.depositDate);
      const maturityDate = new Date(data.maturityDate);
      const oneMonthLater = addMonths(depositDate, 1);
      return maturityDate >= oneMonthLater;
    },
    {
      message: "Maturity date must be at least 1 month after deposit date",
      path: ["maturityDate"],
    },
  )
  .refine(
    data => {
      const depositDate = new Date(data.depositDate);
      const maturityDate = new Date(data.maturityDate);
      const twentyYearsLater = addYears(depositDate, 20);
      return maturityDate <= twentyYearsLater;
    },
    {
      message: "Maturity date cannot be more than 20 years after deposit date",
      path: ["maturityDate"],
    },
  );

// Type inference from the Zod schema
export type CreateFixedDepositRequest = z.infer<
  typeof CreateFixedDepositSchema
>;
