import { useEffect, useState } from "react";
import { Linking, Platform } from "react-native";
import {
  getPermissionsAsync,
  requestPermissionsAsync,
  getExpoPushTokenAsync,
  setNotificationChannelAsync,
  AndroidImportance,
} from "expo-notifications";
import { PermissionStatus } from "expo-modules-core";
import { isDevice } from "expo-device";
import { useAppState } from "@react-native-community/hooks";

import { updateAppUser } from "../utils/API";

export const useNotificationsStatus = (): [boolean, () => void, string] => {
  const [status, setStatus] = useState<PermissionStatus>(
    PermissionStatus.GRANTED
  );
  const appState = useAppState();

  useEffect(() => {
    const checkStatus = async () => {
      const { status: expoStatus } = await getPermissionsAsync();
      setStatus(expoStatus);
    };

    checkStatus();
  }, [appState]);

  const register = async () => {
    if (isDevice) {
      const { status: expoStatus } = await requestPermissionsAsync();
      setStatus(expoStatus);
      if (expoStatus === PermissionStatus.DENIED) {
        return Linking.openSettings();
      }
      if (expoStatus === PermissionStatus.GRANTED) {
        const token = (await getExpoPushTokenAsync()).data;
        if (token) {
          await updateAppUser({ expoPushToken: token });
        }

        if (Platform.OS === "android") {
          setNotificationChannelAsync("default", {
            name: "default",
            importance: AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }
      }
    }
  };

  return [status === PermissionStatus.GRANTED ? true : false, register, status];
};
