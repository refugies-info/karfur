/**
 * ☃ dateDiff "Snowman Carl" (http://stackoverflow.com/questions/13903897)
 * Returns a detail object about the difference between two dates
 *
 * When providing custom units, provide them in descending order (eg week,day,hour; not hour,day,week)
 *
 * @param {Date} dateStart - date to compare to
 * @param {Date|string} [dateEnd=new Date()] - second date, can be used as unit param instead
 * @param {...string} [units=Object.keys(dateDiffDef)] - limits the returned object to provided keys
 */

import { useTranslationWithRTL } from "./useTranslationWithRTL";

// default time units for dateDiff
export const dateDiffDef: Record<string, number> = {
  //   millennium: 31536000000000,
  //   century: 3153600000000,
  //   decade: 315360000000,
  year: 31536000000,
  //   quarter: 7776000000,
  month: 2592000000,
  //   week: 604800000,
  day: 86400000,
  hour: 3600000,
  minute: 60000,
  //   second: 1000,
  //   millisecond: 1,
};

function dateDiff(
  dateStart: Date,
  dateEnd: Date | string = new Date(),
  ...units: string[]
): {
  [key: string]: number;
} {
  if (typeof dateEnd === "string") dateEnd = new Date();

  let delta: number = Math.abs(dateStart.getTime() - dateEnd.getTime());

  return (units.length ? units : Object.keys(dateDiffDef)).reduce(
    (res: any, key: string) => {
      if (!dateDiffDef.hasOwnProperty(key))
        throw new Error("Unknown unit in dateDiff: " + key);
      res[key] = Math.floor(delta / dateDiffDef[key]);
      delta -= res[key] * dateDiffDef[key];
      return res;
    },
    {}
  );
}

const useDateDiffReadable = (date: Date) => {
  const { t } = useTranslationWithRTL();
  const diff = dateDiff(date);

  if (diff.year) {
    return diff.year === 1 ? t("relative_date.year_one", { count: diff.year }) : t("relative_date.year_other", { count: diff.year });
  } else if (diff.month > 0) {
    return diff.month === 1 ? t("relative_date.month_one", { count: diff.month }) : t("relative_date.month_other", { count: diff.month });
  } else if (diff.day > 0) {
    return diff.day === 1 ? t("relative_date.day_one", { count: diff.day }) : t("relative_date.day_other", { count: diff.day });
  } else if (diff.hour > 0) {
    return diff.hour === 1 ? t("relative_date.hour_one", { count: diff.hour }) : t("relative_date.hour_other", { count: diff.hour });
  } else if (diff.minute > 0) {
    return diff.minute === 1 ? t("relative_date.minute_one", { count: diff.minute }) : t("relative_date.minute_other", { count: diff.minute });
  }
  return t("relative_date.now");
};

export { useDateDiffReadable };
