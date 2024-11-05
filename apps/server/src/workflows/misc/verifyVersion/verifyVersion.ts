import { isEmpty } from "lodash";

/**
 * Ensure that the minimum version number is correctly set in environment
 * @returns Promise
 */
const ensureMinimumAppVersion = () =>
  !isEmpty(process.env.MINIMUM_APP_VERSION) && process.env.MINIMUM_APP_VERSION.match("\\d{4}.\\d{2}.\\d{1,}")
    ? Promise.resolve(process.env.MINIMUM_APP_VERSION)
    : Promise.reject("You must set MINIMUM_APP_VERSION = XXXX.XX.X in envar, got " + process.env.MINIMUM_APP_VERSION);

const compareTo = (appVersion: string) => (minimumAppVersion: string) => {
  const [year, month, inc] = appVersion.split(".");
  const [minYear, minMonth, minInc] = minimumAppVersion.split(".");

  if (parseInt(year) > parseInt(minYear)) return true;
  return (
    parseInt(year) >= parseInt(minYear) && parseInt(month) >= parseInt(minMonth) && parseInt(inc) >= parseInt(minInc)
  );
};

const verifyVersion = async (appVersion: string): Promise<boolean> =>
  ensureMinimumAppVersion().then(compareTo(appVersion));

export default verifyVersion;
