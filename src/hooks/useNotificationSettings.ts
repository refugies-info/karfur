import { useQueryClient } from "react-query";
import { set } from "lodash";

import { useApi, useApiMutation } from "./useApi";

export type NotificationsSettings = {
  global: boolean;
  local: boolean;
  demarches: boolean;
  themes: {
    [key: string]: boolean;
  };
};

export const useNotificationsSettings = (): [
  NotificationsSettings | undefined,
  (key: string, value: boolean) => void
] => {
  const queryClient = useQueryClient();
  const { data: settings } = useApi<NotificationsSettings, Error>(
    "/appuser/notification_settings",
    "GET",
    "notificationsSettings"
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
    }
  );

  const updateSettings = async (key: string, value: boolean) => {
    try {
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
