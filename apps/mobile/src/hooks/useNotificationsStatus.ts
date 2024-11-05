import { useAppState } from "@react-native-community/hooks";
import crashlytics from "@react-native-firebase/crashlytics";
import Constants from "expo-constants";
import { isDevice } from "expo-device";
import { PermissionStatus } from "expo-modules-core";
import {
  AndroidImportance,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from "expo-notifications";
import { useEffect, useState } from "react";
import { Linking, Platform } from "react-native";

import { updateAppUser } from "~/utils/API";

export const useNotificationsStatus = (): [boolean, () => Promise<void>, string] => {
  const [status, setStatus] = useState<PermissionStatus>(PermissionStatus.GRANTED);
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
        const token = (
          await getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas.projectId || "@refugies-info/refugies-info-app",
          })
        ).data;
        if (token) {
          await updateAppUser({ expoPushToken: token });
          crashlytics().setUserId(token);
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
