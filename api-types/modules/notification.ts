
/**
 * @url POST /notifications/seen
 */
export interface MarkAsSeenRequest {
  notificationId: string;
}

/**
 * @url POST /notifications/send
 */
export interface SendNotificationsRequest {
  demarcheId: string;
}

/**
 * @url GET /notifications
 */
export interface GetNotificationResponse {
  unseenCount: number;
  notifications: {
    uid: string;
    seen: boolean;
    title: string;
    data: any;
  }[]
}
