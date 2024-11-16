import * as Notifications from "expo-notifications";
import { NotificationResponse } from "expo-notifications";

let notificationDataStack: NotificationResponse[] = [];
let notificationListener: ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null = null;

export const enableNotificationsListener = () => {
  notificationListener = Notifications.addNotificationResponseReceivedListener((response) => {
    if (response) notificationDataStack.push(response);
  });
};

export const disableNotificationsListener = () => {
  notificationListener && notificationListener.remove();
};

export const getNotificationFromStack = () => notificationDataStack.shift();
export const notificationDataStackLength = () => notificationDataStack.length;
