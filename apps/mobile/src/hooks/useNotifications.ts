import { useApi } from "./useApi";

export type Notification = {
  _id: string;
  title: string;
  data: {
    type: string;
    contentId: string;
  };
  createdAt: Date;
  seen: boolean;
};

interface NotificationsResponse {
  notifications: Notification[];
  unseenCount: number;
}

export const useNotifications = () => {
  return useApi<NotificationsResponse, Error>("/notifications", "GET", "notifications");
};
