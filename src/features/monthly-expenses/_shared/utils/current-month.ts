/**
 * The current month lock rule, shared by the month list in the browser
 * and the API routes on the server.
 *
 * Both sides read today's date in India time. So, they agree on the
 * current month whatever the device or server clock's own time zone is.
 */

const INDIA_TIME_ZONE = "Asia/Kolkata";

/**
 * Parses a column A month such as "January, 2025"
 * by rewriting it to "January 1, 2025", which `new Date` reads reliably.
 *
 * Returns an invalid date when the text cannot be read as a month.
 */
export function parseMonthYear(dateStr: string): Date {
  const [month, yearStr] = dateStr.split(",").map(part => part.trim());
  const year = Number.parseInt(yearStr, 10);

  return new Date(`${month} 1, ${year}`);
}

/**
 * Today's month and year in India time.
 *
 * `month` is 0-based, the same as `Date.getMonth()`.
 */
export function getIndiaMonthYear(now: Date = new Date()): {
  month: number;
  year: number;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
    month: "numeric",
  }).formatToParts(now);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find(part => part.type === type)?.value);

  return { month: getPart("month") - 1, year: getPart("year") };
}

/**
 * Whether a column A month is today's month in India time.
 *
 * An empty or unreadable month is never current. So, it stays locked.
 */
export function isCurrentIndiaMonth(dateStr: string | undefined): boolean {
  if (!dateStr) {
    return false;
  }

  const monthDate = parseMonthYear(dateStr);

  if (Number.isNaN(monthDate.getTime())) {
    return false;
  }

  const today = getIndiaMonthYear();

  return (
    monthDate.getMonth() === today.month &&
    monthDate.getFullYear() === today.year
  );
}
