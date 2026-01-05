import { isEmpty } from "lodash";

/**
 * Ensure that the minimum version number is correctly set in environment
 * @returns Promise
 */
const ensureMinimumAppVersion = () =>
  !isEmpty(process.env.MINIMUM_APP_VERSION) &&
  process.env.MINIMUM_APP_VERSION.match(/^\d+\.\d+\.\d+$/)
    ? Promise.resolve(process.env.MINIMUM_APP_VERSION)
    : Promise.reject(
        "You must set MINIMUM_APP_VERSION = X.Y.Z in envar, got " + process.env.MINIMUM_APP_VERSION,
      );

const compareTo = (appVersion: string) => (minimumAppVersion: string) => {
  const versionRegex = /^\d+\.\d+\.\d+$/;

  if (!appVersion || !versionRegex.test(appVersion)) {
    return false;
  }

  const [major, minor, patch] = appVersion.split(".").map(Number);
  const [minMajor, minMinor, minPatch] = minimumAppVersion.split(".").map(Number);

  if (major > minMajor) return true;
  if (major < minMajor) return false;

  if (minor > minMinor) return true;
  if (minor < minMinor) return false;

  return patch >= minPatch;
};

const verifyVersion = async (appVersion: string): Promise<boolean> =>
  ensureMinimumAppVersion().then(compareTo(appVersion));

export default verifyVersion;
