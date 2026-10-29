import { format } from "date-fns/format";
import { isValid } from "date-fns/isValid";

/**
 * Formats a date as the `YYYY-MM-DD` value a date input and
 * `CreateFixedDepositSchema` expect.
 *
 * Returns null for a date that cannot be parsed, such as an empty date
 * input or a sheet date in a locale `new Date` does not read.
 * date-fns `format` throws on such a date, which would crash the form.
 */
export function toDateInputValue(date: Date | string): string | null {
  const parsed = typeof date === "string" ? new Date(date) : date;
  return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : null;
}
