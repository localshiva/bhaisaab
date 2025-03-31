import { IMonthlyReturnsRow } from "../hooks/services/monthly-return";

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
