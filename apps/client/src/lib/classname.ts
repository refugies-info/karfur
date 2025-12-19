import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Join classNames and filter out undefined values
 * @param classNames - classNames to join
 * @returns {string} - joined classNames
 * @deprecated Use cn instead
 */
export const cls = (...classNames: (string | boolean | undefined)[]) =>
  classNames.filter((className) => !!className).join(" ");

/**
 * Join classNames and Merge classes with tailwind-merge
 * @param classNames - classNames to join
 * @returns {string} - joined classNames
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
