import "server-only";

/** Converts a 0-based column index to A1 letters, e.g. 0 -> A, 26 -> AA. */
export function columnIndexToLetter(index: number): string {
  let letter = "";
  let temp = index;
  while (temp >= 0) {
    letter = String.fromCodePoint((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}
