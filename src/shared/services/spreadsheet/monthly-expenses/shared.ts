import { clientEnv } from "@bhaisaab/shared/utils/env-vars/client.env";

export const MONTHLY_EXPENSE_SHEET_NAME = clientEnv.isDev
  ? "Monthly Expense Test"
  : "Monthly Expense";
