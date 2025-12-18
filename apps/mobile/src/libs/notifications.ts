import type { EventSubscription, NotificationResponse } from "expo-notifications";
import * as Notifications from "expo-notifications";

const notificationDataStack: NotificationResponse[] = [];
let notificationListener: EventSubscription | null = null;

export const enableNotificationsListener = () => {
  notificationListener = Notifications.addNotificationResponseReceivedListener((response) => {
    if (response) notificationDataStack.push(response);
  });
};

export const disableNotificationsListener = () => {
  if (notificationListener) {
    notificationListener.remove();
  }
};

export const getNotificationFromStack = () => notificationDataStack.shift();
export const notificationDataStackLength = () => notificationDataStack.length;
