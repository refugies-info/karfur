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

const dateDiffReadable = (date: Date) => {
  const diff = dateDiff(date);

  if (diff.year) {
    return diff.year === 1 ? "1 ANNÉE" : `${diff.year} ANNÉES`;
  } else if (diff.month > 0) {
    return `${diff.month} MOIS`;
  } else if (diff.day > 0) {
    return diff.day === 1 ? "1 JOUR" : `${diff.day} JOURS`;
  } else if (diff.hour > 0) {
    return diff.hour === 1 ? "1 HEURE" : `${diff.hour} HEURES`;
  } else if (diff.minute > 0) {
    return diff.minute === 1 ? "1 MINUTE" : `${diff.minute} MINUTES`;
  }
  return "À L'INSTANT";
};

export { dateDiff, dateDiffReadable };
