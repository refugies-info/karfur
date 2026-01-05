import { isEmpty } from "lodash";

/**
 * Ensure that the minimum version number is correctly set in environment
 * @returns Promise
 */
const ensureMinimumAppVersion = () =>
  !isEmpty(process.env.MINIMUM_APP_VERSION) &&
  process.env.MINIMUM_APP_VERSION.match("\\d+\\.\\d+\\.\\d+")
    ? Promise.resolve(process.env.MINIMUM_APP_VERSION)
    : Promise.reject(
        "You must set MINIMUM_APP_VERSION = X.Y.Z in envar, got " + process.env.MINIMUM_APP_VERSION,
      );

const compareTo = (appVersion: string) => (minimumAppVersion: string) => {
  const [major, minor, patch] = appVersion.split(".");
  const [minMajor, minMinor, minPatch] = minimumAppVersion.split(".");

  if (parseInt(major) > parseInt(minMajor)) return true;
  if (parseInt(major) < parseInt(minMajor)) return false;

  if (parseInt(minor) > parseInt(minMinor)) return true;
  if (parseInt(minor) < parseInt(minMinor)) return false;

  return parseInt(patch) >= parseInt(minPatch);
};

const verifyVersion = async (appVersion: string): Promise<boolean> =>
  ensureMinimumAppVersion().then(compareTo(appVersion));

export default verifyVersion;
