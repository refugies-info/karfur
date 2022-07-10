import { ObjectId } from "mongoose";
import { Expo, ExpoPushMessage } from "expo-server-sdk";

import { getDispositifById, updateDispositifInDB } from "../../modules/dispositif/dispositif.repository";
import { getAllAppUsers } from "../../modules/appusers/appusers.service";
import { Notification } from "../../schema/schemaNotification";

import logger from "src/logger";
import { getLocaleString as t } from "src/libs/getLocaleString";

import { parseDispositif, filterTargets, getNotificationEmoji, getTitle } from "./helpers";

// Push security should be enabled here : https://expo.dev/accounts/refugies-info/settings/access-tokens
// const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
const expo = new Expo();

export const getNotificationsForUser = async (uid: string) => {
  const notifications = await Notification.find({ uid }).limit(15).sort({ createdAt: -1 });
  return notifications;
};

export const markNotificationAsSeen = async (notificationId: string, uid: string) => {
  try {
    const notification = await Notification.findOne({ _id: notificationId, uid });
    if (notification) {
      notification.seen = true;
      await notification.save();
    }
    return true;
  } catch (error) {
    logger.error("[markNotificationAsSeen] error while marking notification as seen", { error: error.message });
    return false;
  }
};

export const sendNotifications = async (messages: ExpoPushMessage[]) => {
  const chunks = expo.chunkPushNotifications(messages);

  await Promise.all(
    chunks.map(async (chunk) => {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        return ticketChunk;
      } catch (error) {
        logger.error("[sendNotifications]", error);
      }
    })
  );
};

export const sendNotificationsForDispositif = async (dispositifId: string | ObjectId, lang: string = "en") => {
  try {
    const dispositif = await getDispositifById(dispositifId, {
      status: 1,
      titreMarque: 1,
      typeContenu: 1,
      titreInformatif: 1,
      contenu: 1,
      tags: 1,
      notificationsSent: 1
    });

    if (!dispositif) {
      logger.error(`[sendNotificationsForDispositif] dispositif ${dispositifId} not found`);
      return;
    }

    if (dispositif.notificationsSent && dispositif.notificationsSent[lang]) {
      logger.info(
        `[sendNotificationsForDispositif] dispositif ${dispositifId} notifications already sent for lang ${lang}`
      );
      return;
    }

    const requirements = parseDispositif(dispositif);
    if (!requirements) {
      logger.error(`[sendNotificationsForDispositif] dispositif ${dispositifId} - Failed to parse requirements`);
      return;
    }

    const targetUsers = filterTargets(await getAllAppUsers(), requirements);

    logger.info(`[sendNotificationsForDispositif] dispositif ${dispositifId} - ${targetUsers.length} users found`);

    const tokens = {} as Record<string, string>;
    targetUsers.forEach((user) => {
      if (user.expoPushToken) {
        tokens[user.uid] = user.expoPushToken;
      }
    });

    const savedNotifications = await Notification.insertMany(
      targetUsers.map((user) => {
        return {
          uid: user.uid,
          seen: false,
          title: `${getNotificationEmoji(dispositif)} ${t(lang, "notifications.newOffer")} - ${getTitle(
            dispositif.titreInformatif
          )} ${t(lang, "notifications.with")} ${getTitle(dispositif.titreMarque)}`,
          data: {
            type: "dispositif",
            // @ts-ignore
            contentId: dispositif._id.toString()
          }
        };
      })
    );

    const messages: ExpoPushMessage[] = savedNotifications
      .map((notification) => {
        return {
          to: tokens[notification.uid],
          title: "Réfugiés.info",
          body: notification.title,
          data: {
            ...notification.data,
            notificationId: notification._id.toString()
          }
        };
      })
      .filter((message) => message.to);

    await sendNotifications(messages);

    const payload = dispositif?.notificationsSent || {};
    payload[lang] = true;
    await updateDispositifInDB(dispositifId, { notificationsSent: payload });
  } catch (err) {
    logger.error("[sendNotificationsForDispositif]", err);
  }
};
