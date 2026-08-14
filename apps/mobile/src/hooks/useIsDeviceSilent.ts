import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { VolumeManager } from "react-native-volume-manager";
import { logger } from "~/logger";

/**
 * Tells whether the voiceover will actually be audible.
 */
export const useIsDeviceSilent = (): boolean => {
  const [isMuteSwitchOn, setIsMuteSwitchOn] = useState(false);
  const [isAndroidSilent, setIsAndroidSilent] = useState(false);
  const [volume, setVolume] = useState<number | null>(null);

  useEffect(() => {
    VolumeManager.getVolume()
      .then((result) => setVolume(result.volume))
      .catch((e) => logger.error(e));

    if (Platform.OS === "android") {
      VolumeManager.isAndroidDeviceSilent()
        .then((silent) => setIsAndroidSilent(silent ?? false))
        .catch((e) => logger.error(e));
    }

    const volumeListener = VolumeManager.addVolumeListener((result) => setVolume(result.volume));

    const silentListener =
      Platform.OS === "ios"
        ? VolumeManager.addSilentListener((status) => setIsMuteSwitchOn(status.isMuted))
        : null;

    return () => {
      volumeListener.remove();
      silentListener?.remove();
    };
  }, []);

  return isMuteSwitchOn || volume === 0 || (Platform.OS === "android" && isAndroidSilent);
};
