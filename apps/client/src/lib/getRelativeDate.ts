import { TFunction } from "next-i18next";

/**
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 */
export function getRelativeTimeString(date: Date | number, lang: string, t: TFunction): string {
  // Allow dates or times to be passed
  const timeMs = typeof date === "number" ? date : date.getTime();

  // Get the amount of days between the given date and now
  const deltaDays = Math.round((timeMs - Date.now()) / (1000 * 60 * 60 * 24));

  // Array reprsenting one day, week, month, etc in day
  const cutoffs = [30, 365, Infinity];

  // Array equivalent to the above but in the string representation of the units
  const units: Intl.RelativeTimeFormatUnit[] = ["day", "month", "year"];

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaDays));

  if (units[unitIndex] === "year") {
    return t("Dispositif.more_1_year");
  }

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
  // is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  // Intl.RelativeTimeFormat do its magic
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  return `${t("Dispositif.updated")} ${rtf.format(Math.floor(deltaDays / divisor), units[unitIndex])}`;
}
