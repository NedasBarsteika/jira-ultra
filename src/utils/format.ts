// Useful functions for website
/**
 * Round a number to a given number of decimal places.
 */
export function round(value: number, decimals: number = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Truncate a string and append an ellipsis if it exceeds maxLength.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

/**
 * Format a date as a human-readable relative string (e.g. "3 days ago").
 */
export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) {
      return `${count} ${label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}
