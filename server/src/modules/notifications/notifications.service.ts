import { Expo, ExpoPushMessage } from "expo-server-sdk";

import { getDispositifById, updateDispositifInDB } from "../../modules/dispositif/dispositif.repository";
import { getAllAppUsers } from "../../modules/appusers/appusers.repository";

import logger from "../../logger";
import { getLocaleString as t } from "../../libs/getLocaleString";
import { availableLanguages } from "../../libs/getFormattedLocale";

import { parseDispositif, filterTargets, filterTargetsForDemarche, getNotificationEmoji } from "./helpers";
import { getAdminOption } from "../adminOptions/adminOptions.repository";
import { Dispositif, DispositifId, NotificationModel } from "../../typegoose";
import { ContentType, Languages } from "@refugies-info/api-types";

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

const isNotificationsActive = async () => {
  const adminOption = await getAdminOption("activesNotifications");
  return !adminOption || adminOption.value === true;
};

export const getNotificationsForUser = async (uid: string) => {
  const notifications = await NotificationModel.find({ uid }).limit(15).sort({ createdAt: -1 });
  return notifications;
};

export const markNotificationAsSeen = async (notificationId: string, uid: string) => {
  try {
    const notification = await NotificationModel.findOne({ _id: notificationId, uid });
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
  const notificationActive = await isNotificationsActive();
  // already added in sendNotificationsForDispositif but replicated here
  // to be more secure if new feature in the future
  if (notificationActive) {
    const chunks = expo.chunkPushNotifications(messages);

    await Promise.all(
      chunks.map(async (chunk) => {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          return ticketChunk;
        } catch (error) {
          logger.error("[sendNotifications]", error);
        }
      }),
    );
  }
};

export const sendNotificationsForDispositif = async (dispositifId: DispositifId, lang: Languages) => {
  const notificationActive = await isNotificationsActive();
  if (notificationActive) {
    logger.info("[sendNotificationsForDispositif] notifications actives");
    try {
      const dispositif = await getDispositifById(
        dispositifId,
        {
          status: 1,
          translations: 1,
          typeContenu: 1,
          theme: 1,
          notificationsSent: 1,
          metadatas: 1
        },
        "theme",
      );

      if (!dispositif) {
        logger.error(`[sendNotificationsForDispositif] dispositif ${dispositifId} not found`);
        return;
      }

      /*
       * Pas de mail si ce n'est pas un dispositif
       */
      if (!dispositif.isDispositif()) {
        return;
      }

      if (dispositif.notificationsSent && dispositif.notificationsSent[lang]) {
        logger.info(
          `[sendNotificationsForDispositif] dispositif ${dispositifId} notifications already sent for lang ${lang}`,
        );
        return;
      }

      const requirements = parseDispositif(dispositif);
      if (!requirements) {
        logger.error(`[sendNotificationsForDispositif] dispositif ${dispositifId} - Failed to parse requirements`);
        return;
      }

      const targetUsers = filterTargets(await getAllAppUsers(), requirements, lang);

      logger.info(`[sendNotificationsForDispositif] dispositif ${dispositifId} - ${targetUsers.length} users found`);

      const tokens = {} as Record<string, string>;
      targetUsers.forEach((user) => {
        if (user.expoPushToken) {
          tokens[user.uid] = user.expoPushToken;
        }
      });

      const savedNotifications = await NotificationModel.insertMany(
        targetUsers.map((user) => {
          return {
            uid: user.uid,
            seen: false,
            title: `${getNotificationEmoji(dispositif)} ${t(
              lang,
              "notifications.newOffer",
            )} - ${dispositif.getTranslated("content.titreInformatif", lang)} ${t(
              lang,
              "notifications.with",
            )} ${dispositif.getTranslated("content.titreMarque", lang)}`,
            data: {
              type: ContentType.DISPOSITIF,
              contentId: dispositif._id.toString(),
            },
          };
        }),
      );

      const messages: ExpoPushMessage[] = savedNotifications
        .map((notification) => {
          return {
            to: tokens[notification.uid],
            title: "Réfugiés.info",
            body: notification.title,
            data: {
              ...notification.data,
              notificationId: notification._id.toString(),
            },
          };
        })
        .filter((message) => message.to);

      await sendNotifications(messages);

      const payload = dispositif?.notificationsSent;
      payload[lang] = true;
      await updateDispositifInDB(dispositifId, { notificationsSent: payload });
    } catch (err) {
      logger.error("[sendNotificationsForDispositif]", err);
    }
  } else {
    logger.error("[sendNotificationsForDispositif] not active: nothing sent");
  }
};

export const sendNotificationsForDemarche = async (demarcheId: DispositifId) => {
  const notificationActive = await isNotificationsActive();
  if (notificationActive) {
    logger.error("[sendNotificationsForDemarche] notifications actives");
    try {
      const demarche: Dispositif = await getDispositifById(
        demarcheId,
        {
          status: 1,
          typeContenu: 1,
          theme: 1,
          notificationsSent: 1,
          metadatas: 1,
          translations: 1
        },
        "theme",
      );

      if (!demarche || !demarche.isDemarche()) {
        // not a demarche: error
        logger.error(`[sendNotificationsForDemarche] demarche ${demarcheId} not found`);
        return;
      }

      const requirements = parseDispositif(demarche);
      if (!requirements) {
        logger.error(`[sendNotificationsForDemarche] demarche ${demarcheId} - Failed to parse requirements`);
        return;
      }

      const targetUsers = filterTargetsForDemarche(await getAllAppUsers(), requirements, demarche);

      logger.info(`[sendNotificationsForDemarche] demarche ${demarcheId} - ${targetUsers.length} users found`);

      const tokens = {} as Record<string, string>;
      targetUsers.forEach((user) => {
        if (user.expoPushToken) {
          tokens[user.uid] = user.expoPushToken;
        }
      });

      const savedNotifications = await NotificationModel.insertMany(
        targetUsers.map((user) => {
          const lang = user.selectedLanguage || "fr";
          return {
            uid: user.uid,
            seen: false,
            title: `${getNotificationEmoji(demarche)} ${t(lang, "notifications.newOffer")} : ${demarche.getTranslated(
              "content.titreInformatif",
              lang,
            )}`,
            data: {
              type: ContentType.DISPOSITIF,
              contentId: demarche._id.toString(),
            },
          };
        }),
      );

      const messages: ExpoPushMessage[] = savedNotifications
        .map((notification) => {
          return {
            to: tokens[notification.uid],
            title: "Réfugiés.info",
            body: notification.title,
            data: {
              ...notification.data,
              notificationId: notification._id.toString(),
            },
          };
        })
        .filter((message) => message.to);

      await sendNotifications(messages);

      const payload = demarche?.notificationsSent;
      for (const lang of availableLanguages) {
        payload[lang] = true;
      }
      await updateDispositifInDB(demarcheId, { notificationsSent: payload });
    } catch (err) {
      logger.error("[sendNotificationsForDemarche]", err);
    }
  } else {
    logger.error("[sendNotificationsForDemarche] not active: nothing sent");
  }
};
