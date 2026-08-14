import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { logger } from "~/logger";
import { useIsDeviceSilent } from "./useIsDeviceSilent";

const STORAGE_KEY = "silentModeWarningDisabled";

export const useSilentModeWarning = () => {
  const isDeviceSilent = useIsDeviceSilent();
  // default to disabled so we never flash the modal before the storage is read
  const [isDisabled, setIsDisabled] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => setIsDisabled(value === "true"))
      .catch((e) => logger.error(e));
  }, []);

  /**
   * Shows the warning when relevant.
   * @returns true when the warning was shown, meaning the caller must not start reading yet
   */
  const warnIfSilent = useCallback(() => {
    if (!isDeviceSilent || isDisabled) return false;
    setIsVisible(true);
    return true;
  }, [isDeviceSilent, isDisabled]);

  const hide = useCallback(() => setIsVisible(false), []);

  const disableForever = useCallback(() => {
    setIsDisabled(true);
    setIsVisible(false);
    AsyncStorage.setItem(STORAGE_KEY, "true").catch((e) => logger.error(e));
  }, []);

  return { isVisible, warnIfSilent, hide, disableForever };
};
