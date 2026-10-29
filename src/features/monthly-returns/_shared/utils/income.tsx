import { IMonthlyReturnsRow } from "@bhaisaab/features/monthly-returns/_shared/types/monthly-returns";

/** Sums the amount column (index 2) and counts the sources. */
export const getTotalIncome = (rows: IMonthlyReturnsRow[]) => {
  let sum = 0;

  for (const row of rows) {
    sum += Number(row[2]);
  }

  return {
    sum,
    sources: rows.length,
  };
};
