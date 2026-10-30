import type { Languages } from "@refugies-info/api-types";
import {
  AdminOptionsModel,
  type AppUser,
  AppUserModel,
  type AppUserType,
  DispositifModel,
  type Notification,
  NotificationModel,
} from "@refugies-info/mongo";
import type { ExpoPushMessage } from "expo-server-sdk";
import { omit } from "lodash";
import { fixtures } from "../../../__fixtures__";
import * as adminOptionsRepository from "../../adminOptions/adminOptions.repository";
import * as appusersRepository from "../../appusers/appusers.repository";
import * as dispositifRepository from "../../dispositif/dispositif.repository";
import { targets } from "../__fixtures__/targets";
import * as notificationsService from "../helpers";
import * as notifications from "../notifications.service";

describe("getNotificationsToSend", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("remove not allowed users", async () => {
    const savedNotifications: Notification[] = [
      {
        uid: "1",
        seen: false,
        title: "test",
        data: {},
      } as any,
      {
        uid: "2",
        seen: false,
        title: "test",
        data: {},
      } as any,
      {
        uid: "3",
        seen: false,
        title: "test",
        data: { type: "dispositif", contentId: "content3" },
      } as any,
    ];

    const tokens = {
      "1": "expo1",
      "2": "expo2",
      "3": "expo3",
    };
    const res = await notifications.getNotificationsToSend(
      savedNotifications.map((n) => new NotificationModel(n)),
      tokens,
      new Set(["1", "2"]),
    );
    expect(res).toEqual([
      {
        to: "expo3",
        title: "Réfugiés.info",
        body: "test",
        data: {
          type: "dispositif",
          contentId: "content3",
          notificationId: expect.anything(),
        },
      },
    ]);
  });
});

describe("sendNotifications", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("sendNotifications if active", async () => {
    jest
      .spyOn(adminOptionsRepository, "getAdminOption")
      .mockResolvedValue(new AdminOptionsModel({ value: true }));

    const spy = jest.spyOn(notifications.expo, "chunkPushNotifications");
    const spySendNotif = jest.spyOn(notifications.expo, "sendPushNotificationsAsync");
    await notifications.sendNotifications([]);
    expect(spy).toHaveBeenCalledWith([]);
    expect(spySendNotif).not.toHaveBeenCalled();
  });

  it("sendNotifications if active", async () => {
    jest
      .spyOn(adminOptionsRepository, "getAdminOption")
      .mockResolvedValue(new AdminOptionsModel({ value: true }));

    const spy = jest.spyOn(notifications.expo, "chunkPushNotifications");
    const spySendNotif = jest.spyOn(notifications.expo, "sendPushNotificationsAsync");
    await notifications.sendNotifications([]);
    expect(spy).toHaveBeenCalledWith([]);
    expect(spySendNotif).not.toHaveBeenCalled();
  });

  it("sendNotifications called", async () => {
    jest
      .spyOn(adminOptionsRepository, "getAdminOption")
      .mockResolvedValue(new AdminOptionsModel({ value: true }));

    const spy = jest.spyOn(notifications.expo, "chunkPushNotifications");
    const spySendNotif = jest.spyOn(notifications.expo, "sendPushNotificationsAsync");
    const notificationsMessages = [
      {
        to: "test",
        title: "Réfugiés.info",
        body: "title",
        data: {},
      },
      {
        to: "test2",
        title: "Réfugiés.info",
        body: "title",
        data: {},
      },
    ];
    await notifications.sendNotifications(notificationsMessages);
    expect(spy).toHaveBeenCalledWith(notificationsMessages);
    expect(spySendNotif).toHaveBeenCalled();
  });

  it("no sendNotifications if not active", async () => {
    jest
      .spyOn(adminOptionsRepository, "getAdminOption")
      .mockResolvedValue(new AdminOptionsModel({ value: false }));

    const spy = jest.spyOn(notifications.expo, "chunkPushNotifications");
    const spySendNotif = jest.spyOn(notifications.expo, "sendPushNotificationsAsync");
    await notifications.sendNotifications([]);
    expect(spy).not.toHaveBeenCalled();
    expect(spySendNotif).not.toHaveBeenCalled();
  });
});

describe("sendDispositifNotifications", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send notifications to all eligible users for a given dispositif", async () => {
    // Mock dependencies
    const getDispositifByIdMock = jest.spyOn(dispositifRepository, "getDispositifById");
    const getAdminOptionMock = jest.spyOn(adminOptionsRepository, "getAdminOption");
    const getAppUsersBatchMock = jest.spyOn(appusersRepository, "getAppUsersBatch");
    const filterTargetsMock = jest.spyOn(notificationsService, "filterTargets");
    const getNotificationEmojiMock = jest.spyOn(notificationsService, "getNotificationEmoji");
    const updateDispositifInDBMock = jest.spyOn(dispositifRepository, "updateDispositifInDB");
    const insertNotificationsMock = jest.spyOn(NotificationModel, "insertMany");
    const getNotificationsToSendMock = jest.spyOn(notifications, "getNotificationsToSend");
    const sendNotifications = jest.spyOn(notifications, "sendNotifications");
    const claimMock = jest.spyOn(dispositifRepository, "claimNotificationsLanguages");
    const usersNotAllowedMock = jest.spyOn(notifications, "getUsersNotifsNotAllowed");

    // Mock data
    const dispositifId = fixtures.dispositif._id;
    const lang = "fr";
    const requirements = {
      age: {
        max: 99,
        min: 0,
      },
      departments: ["13 - Bouches-du-Rhône"],
      mainThemeId: "63286a015d31b2c0cad9960a",
      type: "dispositif",
    };
    const targetUsers: AppUserType[] = targets;
    const savedNotifications: Notification[] = [
      {
        uid: "1",
        seen: false,
        title: "Réfugiés.info",
        data: {},
      } as any,
    ];
    const messages: ExpoPushMessage[] = [
      {
        to: "1",
        title: "Réfugiés.info",
        body: "Réfugiés.info",
        data: {
          notificationId: "anything",
        },
      },
    ];

    // Mock function implementations
    const dispositifModel = new DispositifModel(fixtures.dispositif);
    getAdminOptionMock.mockResolvedValue(new AdminOptionsModel({ value: true }));
    getDispositifByIdMock.mockResolvedValue(dispositifModel);
    getAppUsersBatchMock
      .mockResolvedValueOnce(
        targetUsers.map((t) => new AppUserModel(t).toObject({ flattenMaps: true }) as any),
      )
      .mockResolvedValue([]);
    filterTargetsMock.mockReturnValue(targetUsers);
    getNotificationEmojiMock.mockReturnValue("🔔");
    insertNotificationsMock.mockResolvedValue(
      savedNotifications.map((n) => new NotificationModel(n)),
    );
    getNotificationsToSendMock.mockResolvedValue(messages);
    claimMock.mockResolvedValue([lang]);
    usersNotAllowedMock.mockResolvedValue(new Set(["blocked"]));

    // Call the function
    await notifications.sendDispositifNotifications(dispositifId, lang);

    // Assertions
    expect(getDispositifByIdMock).toHaveBeenCalledWith(
      dispositifId,
      {
        status: 1,
        translations: 1,
        typeContenu: 1,
        theme: 1,
        notificationsSent: 1,
        metadatas: 1,
      },
      "theme",
    );
    expect(getAdminOptionMock).toHaveBeenCalled();
    expect(getAppUsersBatchMock).toHaveBeenCalledWith(expect.any(Object), null, 100);
    expect(filterTargetsMock).toHaveBeenCalledWith(
      targetUsers.map((t) => expect.objectContaining(omit(t, "_id"))),
      requirements,
      lang,
    );
    expect(getNotificationEmojiMock).toHaveBeenCalledWith(dispositifModel);
    expect(insertNotificationsMock).toHaveBeenCalledWith(
      targetUsers.map((t) => ({
        uid: t.uid,
        seen: false,
        title: "🔔 Nouvelle offre - Apprendre le français avec Des mots d'ancrage",
        data: {
          type: "dispositif",
          contentId: fixtures.dispositif._id.toString(),
        },
      })),
    );
    expect(claimMock).toHaveBeenCalledWith(dispositifId, [lang]);
    expect(getNotificationsToSendMock).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Object),
      new Set(["blocked"]),
    );
    expect(updateDispositifInDBMock).not.toHaveBeenCalled();
    // FIXME: randomly generated nested id
    expect(sendNotifications).toHaveBeenCalledWith(
      messages.map((m) => ({ ...m, data: { notificationId: expect.anything() } })),
    );
  });

  it("should not send notifications if not a dispositif", async () => {
    // Mock dependencies
    const getDispositifByIdMock = jest.spyOn(dispositifRepository, "getDispositifById");
    const getAdminOptionMock = jest.spyOn(adminOptionsRepository, "getAdminOption");
    const getAllAppUsersMock = jest.spyOn(appusersRepository, "getAllAppUsers");
    const filterTargetsMock = jest.spyOn(notificationsService, "filterTargets");
    const getNotificationEmojiMock = jest.spyOn(notificationsService, "getNotificationEmoji");
    const updateDispositifInDBMock = jest.spyOn(dispositifRepository, "updateDispositifInDB");
    const insertNotificationsMock = jest.spyOn(NotificationModel, "insertMany");
    const getNotificationsToSendMock = jest.spyOn(notifications, "getNotificationsToSend");
    const sendNotifications = jest.spyOn(notifications, "sendNotifications");

    // Mock data
    const dispositifId = "dispositifId";
    const lang = "fr";

    // Mock function implementations
    getAdminOptionMock.mockResolvedValue(new AdminOptionsModel({ value: true }));
    getDispositifByIdMock.mockResolvedValue(new DispositifModel(fixtures.demarche));

    // Call the function
    await notifications.sendDispositifNotifications(dispositifId, lang);

    // Assertions
    expect(getDispositifByIdMock).toHaveBeenCalled();
    expect(getAdminOptionMock).toHaveBeenCalled();
    expect(getAllAppUsersMock).not.toHaveBeenCalled();
    expect(filterTargetsMock).not.toHaveBeenCalled();
    expect(getNotificationEmojiMock).not.toHaveBeenCalled();
    expect(insertNotificationsMock).not.toHaveBeenCalled();
    expect(updateDispositifInDBMock).not.toHaveBeenCalled();
    expect(getNotificationsToSendMock).not.toHaveBeenCalled();
    expect(sendNotifications).not.toHaveBeenCalled();
  });

  it("should not send notifications if already sent", async () => {
    // Mock dependencies
    const getDispositifByIdMock = jest.spyOn(dispositifRepository, "getDispositifById");
    const getAdminOptionMock = jest.spyOn(adminOptionsRepository, "getAdminOption");
    const getAllAppUsersMock = jest.spyOn(appusersRepository, "getAllAppUsers");
    const filterTargetsMock = jest.spyOn(notificationsService, "filterTargets");
    const getNotificationEmojiMock = jest.spyOn(notificationsService, "getNotificationEmoji");
    const updateDispositifInDBMock = jest.spyOn(dispositifRepository, "updateDispositifInDB");
    const insertNotificationsMock = jest.spyOn(NotificationModel, "insertMany");
    const getNotificationsToSendMock = jest.spyOn(notifications, "getNotificationsToSend");
    const sendNotifications = jest.spyOn(notifications, "sendNotifications");

    // Mock data
    const dispositifId = "dispositifId";
    const lang = "fr";

    // Mock function implementations
    getAdminOptionMock.mockResolvedValue(new AdminOptionsModel({ value: true }));
    getDispositifByIdMock.mockResolvedValue(
      new DispositifModel({ ...fixtures.dispositif, notificationsSent: { fr: true } }),
    );

    // Call the function
    await notifications.sendDispositifNotifications(dispositifId, lang);

    // Assertions
    expect(getDispositifByIdMock).toHaveBeenCalled();
    expect(getAdminOptionMock).toHaveBeenCalled();
    expect(getAllAppUsersMock).not.toHaveBeenCalled();
    expect(filterTargetsMock).not.toHaveBeenCalled();
    expect(getNotificationEmojiMock).not.toHaveBeenCalled();
    expect(insertNotificationsMock).not.toHaveBeenCalled();
    expect(updateDispositifInDBMock).not.toHaveBeenCalled();
    expect(getNotificationsToSendMock).not.toHaveBeenCalled();
    expect(sendNotifications).not.toHaveBeenCalled();
  });
});
describe("sendDemarcheNotifications", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send notifications to all eligible users for a given demarche", async () => {
    // Mock dependencies
    const getDispositifByIdMock = jest.spyOn(dispositifRepository, "getDispositifById");
    const getAdminOptionMock = jest.spyOn(adminOptionsRepository, "getAdminOption");
    const getAppUsersBatchMock = jest.spyOn(appusersRepository, "getAppUsersBatch");
    const filterTargetsMock = jest.spyOn(notificationsService, "filterTargetsForDemarche");
    const getNotificationEmojiMock = jest.spyOn(notificationsService, "getNotificationEmoji");
    const updateDispositifInDBMock = jest.spyOn(dispositifRepository, "updateDispositifInDB");
    const insertNotificationsMock = jest.spyOn(NotificationModel, "insertMany");
    const getNotificationsToSendMock = jest.spyOn(notifications, "getNotificationsToSend");
    const sendNotifications = jest.spyOn(notifications, "sendNotifications");
    const claimMock = jest.spyOn(dispositifRepository, "claimNotificationsLanguages");
    const usersNotAllowedMock = jest.spyOn(notifications, "getUsersNotifsNotAllowed");

    // Mock data
    const dispositifId = fixtures.demarche._id;
    const requirements = {
      age: {
        max: 99,
        min: 0,
      },
      departments: "france",
      mainThemeId: "63450dd43e23cd7181ba0b26",
      type: "demarche",
    };
    const targetUsers: AppUserType[] = targets;
    const savedNotifications: Notification[] = [
      {
        uid: "1",
        seen: false,
        title: "Réfugiés.info",
        data: {},
      } as any,
    ];
    const messages: ExpoPushMessage[] = [
      {
        to: "1",
        title: "Réfugiés.info",
        body: "Réfugiés.info",
        data: {
          notificationId: "anything",
        },
      },
    ];

    // Mock function implementations
    const demarcheModel = new DispositifModel(fixtures.demarche);
    getAdminOptionMock.mockResolvedValue(new AdminOptionsModel({ value: true }));
    getDispositifByIdMock.mockResolvedValue(demarcheModel);
    getAppUsersBatchMock
      .mockResolvedValueOnce(
        targetUsers.map((t) => new AppUserModel(t).toObject({ flattenMaps: true }) as any),
      )
      .mockResolvedValue([]);
    filterTargetsMock.mockReturnValue(targetUsers);
    getNotificationEmojiMock.mockReturnValue("🔔");
    insertNotificationsMock.mockResolvedValue(
      savedNotifications.map((n) => new NotificationModel(n)),
    );
    getNotificationsToSendMock.mockResolvedValue(messages);
    const translatedLanguages = Object.keys(fixtures.demarche.translations);
    const newLanguages = translatedLanguages.slice(1);
    claimMock.mockResolvedValue(newLanguages);
    usersNotAllowedMock.mockResolvedValue(new Set());

    // Call the function
    await notifications.sendDemarcheNotifications(dispositifId);

    // Assertions
    expect(getDispositifByIdMock).toHaveBeenCalledWith(
      dispositifId,
      {
        status: 1,
        translations: 1,
        typeContenu: 1,
        theme: 1,
        notificationsSent: 1,
        metadatas: 1,
      },
      "theme",
    );
    expect(getAdminOptionMock).toHaveBeenCalled();
    expect(getAppUsersBatchMock).toHaveBeenCalledWith(expect.any(Object), null, 100);
    expect(filterTargetsMock).toHaveBeenCalledWith(
      targetUsers.map((t) => expect.objectContaining(omit(t, "_id"))),
      requirements,
      newLanguages,
    );
    expect(getNotificationEmojiMock).toHaveBeenCalledWith(demarcheModel);
    expect(insertNotificationsMock).toHaveBeenCalledWith(
      targetUsers.map((t) => ({
        uid: t.uid,
        seen: false,
        title: `🔔 ${t.selectedLanguage === "fa" ? "پیشنهاد جدید" : "Nouvelle offre"} : ${fixtures.demarche.translations[t.selectedLanguage as Languages].content.titreInformatif}`,
        data: {
          type: "dispositif",
          contentId: fixtures.demarche._id.toString(),
        },
      })),
    );
    expect(claimMock).toHaveBeenCalledWith(dispositifId, translatedLanguages);
    expect(getNotificationsToSendMock).toHaveBeenCalled();
    expect(updateDispositifInDBMock).not.toHaveBeenCalled();
    // FIXME: randomly generated nested id
    expect(sendNotifications).toHaveBeenCalledWith(
      messages.map((m) => ({ ...m, data: { notificationId: expect.anything() } })),
    );
  });

  it("should not send anything when every translated language was already notified", async () => {
    jest
      .spyOn(adminOptionsRepository, "getAdminOption")
      .mockResolvedValue(new AdminOptionsModel({ value: true }));
    jest
      .spyOn(dispositifRepository, "getDispositifById")
      .mockResolvedValue(new DispositifModel(fixtures.demarche));
    jest.spyOn(dispositifRepository, "claimNotificationsLanguages").mockResolvedValue([]);
    const getAppUsersBatchMock = jest.spyOn(appusersRepository, "getAppUsersBatch");
    const sendNotifications = jest.spyOn(notifications, "sendNotifications");

    await notifications.sendDemarcheNotifications(fixtures.demarche._id);

    expect(getAppUsersBatchMock).not.toHaveBeenCalled();
    expect(sendNotifications).not.toHaveBeenCalled();
  });
});

describe("claimNotificationsLanguages", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("claims each language once, even when called twice (double click)", async () => {
    const { insertedId: _id } = await DispositifModel.collection.insertOne({
      typeContenu: "demarche",
      notificationsSent: { ar: true },
    });

    const [first, second] = await Promise.all([
      dispositifRepository.claimNotificationsLanguages(_id, ["fr", "ar", "uk"]),
      dispositifRepository.claimNotificationsLanguages(_id, ["fr", "ar", "uk"]),
    ]);

    expect([...first, ...second].sort()).toEqual(["fr", "uk"]);
    expect(await dispositifRepository.claimNotificationsLanguages(_id, ["fr", "uk", "en"])).toEqual(
      ["en"],
    );
  });

  it("claims a language on a content without notificationsSent", async () => {
    const { insertedId: _id } = await DispositifModel.collection.insertOne({
      typeContenu: "dispositif",
    });
    expect(await dispositifRepository.claimNotificationsLanguages(_id, ["fr"])).toEqual(["fr"]);
  });
});

describe("getUsersNotifsNotAllowed", () => {
  beforeEach(async () => {
    jest.restoreAllMocks();
    await NotificationModel.deleteMany({});
  });

  it("blocks users with 3 notifications in a day or 7 in a week, ignoring older ones", async () => {
    const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 3600 * 1000);
    const notif = (uid: string, createdAt: Date) => ({
      uid,
      title: "t",
      data: {},
      seen: false,
      createdAt,
    });
    await NotificationModel.collection.insertMany([
      ...[0, 0, 0].map(() => notif("threeToday", daysAgo(0.1))),
      ...[0, 0].map(() => notif("twoToday", daysAgo(0.1))),
      ...[1, 2, 3, 4, 5, 6, 6.5].map((d) => notif("sevenThisWeek", daysAgo(d))),
      ...[8, 9, 10, 11, 12, 13, 14].map((d) => notif("sevenOld", daysAgo(d))),
    ]);

    expect([...(await notifications.getUsersNotifsNotAllowed())].sort()).toEqual([
      "sevenThisWeek",
      "threeToday",
    ]);
  });
});
