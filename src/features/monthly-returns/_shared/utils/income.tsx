import {
  IIncomeSource,
  IMonthlyReturnsRow,
} from "@bhaisaab/features/monthly-returns/_shared/types/monthly-returns";

/**
 * Turns the API rows into the income sources the page lists.
 *
 * Skips a blank row and a row whose amount is missing or not a number,
 * so that one bad row cannot turn every total into NaN.
 *
 * Each source keeps its own sheet row as its id,
 * even when rows above it are skipped.
 */
export const getIncomeSources = (
  rows: IMonthlyReturnsRow[],
): IIncomeSource[] => {
  const sources: IIncomeSource[] = [];

  for (const [index, row] of rows.entries()) {
    const [type = "", source = "", amountText = ""] = row;

    // Number("") is 0, so a blank amount must not reach Number().
    const amount = amountText.trim() === "" ? Number.NaN : Number(amountText);

    if (Number.isFinite(amount)) {
      // rows starts at sheet row 2, which is 0-based row 1.
      sources.push({ id: index + 1, type, source, amount });
    }
  }

  return sources;
};

/** Sums the amounts and counts the sources. */
export const getTotalIncome = (sources: IIncomeSource[]) => {
  let sum = 0;

  for (const { amount } of sources) {
    sum += amount;
  }

  return {
    sum,
    sources: sources.length,
  };
};
