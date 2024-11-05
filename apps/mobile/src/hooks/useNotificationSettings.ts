import set from "lodash/set";
import { useQueryClient } from "react-query";
import { FirebaseEvent } from "~/utils/eventsUsedInFirebase";
import { logEventInFirebase } from "~/utils/logEvent";
import { useApi, useApiMutation } from "./useApi";

export type NotificationsSettings = {
  global: boolean;
  local: boolean;
  demarches: boolean;
  themes: {
    [key: string]: boolean;
  };
};

const logSettingsUpdate = (key: string, value: boolean) => {
  const event = key.includes("themes")
    ? FirebaseEvent.TOGGLE_NOTIFICATION_THEME
    : FirebaseEvent.TOGGLE_NOTIFICATION_TYPE;
  logEventInFirebase(event, {
    id: key,
    value: value,
  });
};

export const useNotificationsSettings = (): [
  NotificationsSettings | undefined,
  (key: string, value: boolean) => void,
] => {
  const queryClient = useQueryClient();
  const { data: settings } = useApi<NotificationsSettings, Error>(
    "/appuser/notification_settings",
    "GET",
    "notificationsSettings",
  );

  const mutation = useApiMutation<Partial<NotificationsSettings>, Error>(
    "/appuser/notification_settings",
    "POST",
    "notificationsSettings",
    {
      onError: () => {
        queryClient.invalidateQueries("notificationsSettings");
        throw new Error("Failed to update notifications settings");
      },
    },
  );

  const updateSettings = async (key: string, value: boolean) => {
    try {
      logSettingsUpdate(key, value);
      const payload: any = {};
      set(payload, key, value);
      queryClient.setQueryData("notificationsSettings", (current: any) => {
        if (payload.themes) {
          return {
            ...current,
            themes: {
              ...current.themes,
              ...payload.themes,
            },
          };
        }
        return { ...current, ...payload };
      });
      await mutation.mutateAsync(payload);
    } catch (err) {
      queryClient.invalidateQueries("notificationsSettings");
      throw err;
    }
  };

  return [settings, updateSettings];
};
