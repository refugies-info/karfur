import { ExpoPushMessage } from "expo-server-sdk";
import { omit } from "lodash";
import * as notifications from "../notifications.service";
import * as adminOptionsRepository from "../../adminOptions/adminOptions.repository";
import * as dispositifRepository from "../../dispositif/dispositif.repository";
import * as appusersRepository from "../../appusers/appusers.repository";
import * as notificationsService from "../helpers";
import { AdminOptionsModel, NotificationModel, DispositifModel, AppUser, AppUserModel, Notification } from "../../../typegoose";
import { demarche, dispositif } from "../../../__fixtures__";
import { targets } from "../__fixtures__/targets";

describe("notifications.service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("sendNotifications if active", async () => {
    jest.spyOn(adminOptionsRepository, "getAdminOption").mockResolvedValue(new AdminOptionsModel({ value: true }))

    const spy = jest.spyOn(notifications.expo, "chunkPushNotifications")
    const spySendNotif = jest.spyOn(notifications.expo, "sendPushNotificationsAsync")
    await notifications.sendNotifications([]);
    expect(spy).toHaveBeenCalledWith([]);
    expect(spySendNotif).not.toHaveBeenCalled();
  });

  it("sendNotifications called", async () => {
    jest.spyOn(adminOptionsRepository, "getAdminOption").mockResolvedValue(new AdminOptionsModel({ value: true }))

    const spy = jest.spyOn(notifications.expo, "chunkPushNotifications")
    const spySendNotif = jest.spyOn(notifications.expo, "sendPushNotificationsAsync")
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
      }
    ];
    await notifications.sendNotifications(notificationsMessages);
    expect(spy).toHaveBeenCalledWith(notificationsMessages);
    expect(spySendNotif).toHaveBeenCalled();
  });

  it("no sendNotifications if not active", async () => {
    jest.spyOn(adminOptionsRepository, "getAdminOption").mockResolvedValue(new AdminOptionsModel({ value: false }))

    const spy = jest.spyOn(notifications.expo, "chunkPushNotifications")
    const spySendNotif = jest.spyOn(notifications.expo, "sendPushNotificationsAsync")
    await notifications.sendNotifications([]);
    expect(spy).not.toHaveBeenCalled();
    expect(spySendNotif).not.toHaveBeenCalled();
  });

  it('should send notifications to all eligible users for a given dispositif', async () => {
    // Mock dependencies
    const getDispositifByIdMock = jest.spyOn(dispositifRepository, 'getDispositifById');
    const getAdminOptionMock = jest.spyOn(adminOptionsRepository, 'getAdminOption');
    const getAllAppUsersMock = jest.spyOn(appusersRepository, 'getAllAppUsers');
    const filterTargetsMock = jest.spyOn(notificationsService, 'filterTargets');
    const getNotificationEmojiMock = jest.spyOn(notificationsService, 'getNotificationEmoji');
    const updateDispositifInDBMock = jest.spyOn(dispositifRepository, 'updateDispositifInDB');
    const insertNotificationsMock = jest.spyOn(NotificationModel, 'insertMany');
    const sendNotifications = jest.spyOn(notifications, 'sendNotifications');

    // Mock data
    const dispositifId = 'dispositifId';
    const lang = 'fr';
    const requirements = {
      age: {
        max: 99,
        min: 0,
      },
      departments: [
        "13 - Bouches-du-Rhône",
      ],
      mainThemeId: "63286a015d31b2c0cad9960a",
      type: "dispositif",
    };
    const targetUsers: AppUser[] = targets;
    const savedNotifications: Notification[] = [{
      uid: "1",
      seen: false,
      title: "Réfugiés.info",
      data: {}
    }];
    const messages: ExpoPushMessage[] = [{
      to: "1",
      title: "Réfugiés.info",
      body: "Réfugiés.info",
      data: {
        notificationId: "anything",
      },
    }];

    // Mock function implementations
    getAdminOptionMock.mockResolvedValue(new AdminOptionsModel({ value: true }));
    getDispositifByIdMock.mockResolvedValue(new DispositifModel(dispositif));
    getAllAppUsersMock.mockResolvedValue(targetUsers.map(t => new AppUserModel(t)));
    filterTargetsMock.mockReturnValue(targetUsers);
    getNotificationEmojiMock.mockReturnValue('🔔');
    insertNotificationsMock.mockResolvedValue(savedNotifications.map(n => new NotificationModel(n)));
    updateDispositifInDBMock.mockResolvedValue(dispositif);

    // Call the function
    await notifications.sendNotificationsForDispositif(dispositifId, lang);

    // Assertions
    expect(getDispositifByIdMock).toHaveBeenCalledWith(dispositifId, {
      status: 1,
      translations: 1,
      typeContenu: 1,
      theme: 1,
      notificationsSent: 1,
      metadatas: 1
    }, 'theme');
    expect(getAdminOptionMock).toHaveBeenCalled();
    expect(getAllAppUsersMock).toHaveBeenCalled();
    expect(filterTargetsMock).toHaveBeenCalledWith(targetUsers.map(t => expect.objectContaining(omit(t, "_id"))), requirements, lang);
    expect(getNotificationEmojiMock).toHaveBeenCalledWith(new DispositifModel(dispositif));
    expect(insertNotificationsMock).toHaveBeenCalledWith(targetUsers.map(t => ({
      uid: t.uid,
      seen: false,
      title: "🔔 Nouvelle offre - Apprendre le français avec Des mots d'ancrage",
      data: {
        type: "dispositif",
        contentId: dispositif._id.toString(),
      },
    })));
    expect(updateDispositifInDBMock).toHaveBeenCalledWith(dispositifId, { notificationsSent: { [lang]: true } });
    // FIXME: randomly generated nested id
    expect(sendNotifications).toHaveBeenCalledWith(messages.map(m => ({ ...m, data: { notificationId: expect.anything() } })));
  });

  it('should not send notifications if not a dispositif', async () => {
    // Mock dependencies
    const getDispositifByIdMock = jest.spyOn(dispositifRepository, 'getDispositifById');
    const getAdminOptionMock = jest.spyOn(adminOptionsRepository, 'getAdminOption');
    const getAllAppUsersMock = jest.spyOn(appusersRepository, 'getAllAppUsers');
    const filterTargetsMock = jest.spyOn(notificationsService, 'filterTargets');
    const getNotificationEmojiMock = jest.spyOn(notificationsService, 'getNotificationEmoji');
    const updateDispositifInDBMock = jest.spyOn(dispositifRepository, 'updateDispositifInDB');
    const insertNotificationsMock = jest.spyOn(NotificationModel, 'insertMany');
    const sendNotifications = jest.spyOn(notifications, 'sendNotifications');

    // Mock data
    const dispositifId = 'dispositifId';
    const lang = 'fr';

    // Mock function implementations
    getAdminOptionMock.mockResolvedValue(new AdminOptionsModel({ value: true }));
    getDispositifByIdMock.mockResolvedValue(new DispositifModel(demarche));

    // Call the function
    await notifications.sendNotificationsForDispositif(dispositifId, lang);

    // Assertions
    expect(getDispositifByIdMock).toHaveBeenCalled();
    expect(getAdminOptionMock).toHaveBeenCalled();
    expect(getAllAppUsersMock).not.toHaveBeenCalled();
    expect(filterTargetsMock).not.toHaveBeenCalled();
    expect(getNotificationEmojiMock).not.toHaveBeenCalled();
    expect(insertNotificationsMock).not.toHaveBeenCalled();
    expect(updateDispositifInDBMock).not.toHaveBeenCalled();
    expect(sendNotifications).not.toHaveBeenCalled();
  });

  it('should not send notifications if already sent', async () => {
    // Mock dependencies
    const getDispositifByIdMock = jest.spyOn(dispositifRepository, 'getDispositifById');
    const getAdminOptionMock = jest.spyOn(adminOptionsRepository, 'getAdminOption');
    const getAllAppUsersMock = jest.spyOn(appusersRepository, 'getAllAppUsers');
    const filterTargetsMock = jest.spyOn(notificationsService, 'filterTargets');
    const getNotificationEmojiMock = jest.spyOn(notificationsService, 'getNotificationEmoji');
    const updateDispositifInDBMock = jest.spyOn(dispositifRepository, 'updateDispositifInDB');
    const insertNotificationsMock = jest.spyOn(NotificationModel, 'insertMany');
    const sendNotifications = jest.spyOn(notifications, 'sendNotifications');

    // Mock data
    const dispositifId = 'dispositifId';
    const lang = 'fr';

    // Mock function implementations
    getAdminOptionMock.mockResolvedValue(new AdminOptionsModel({ value: true }));
    getDispositifByIdMock.mockResolvedValue(new DispositifModel({ ...dispositif, notificationsSent: { fr: true } }));

    // Call the function
    await notifications.sendNotificationsForDispositif(dispositifId, lang);

    // Assertions
    expect(getDispositifByIdMock).toHaveBeenCalled();
    expect(getAdminOptionMock).toHaveBeenCalled();
    expect(getAllAppUsersMock).not.toHaveBeenCalled();
    expect(filterTargetsMock).not.toHaveBeenCalled();
    expect(getNotificationEmojiMock).not.toHaveBeenCalled();
    expect(insertNotificationsMock).not.toHaveBeenCalled();
    expect(updateDispositifInDBMock).not.toHaveBeenCalled();
    expect(sendNotifications).not.toHaveBeenCalled();
  });

  it('should send notifications to all eligible users for a given demarche', async () => {
    // Mock dependencies
    const getDispositifByIdMock = jest.spyOn(dispositifRepository, 'getDispositifById');
    const getAdminOptionMock = jest.spyOn(adminOptionsRepository, 'getAdminOption');
    const getAllAppUsersMock = jest.spyOn(appusersRepository, 'getAllAppUsers');
    const filterTargetsMock = jest.spyOn(notificationsService, 'filterTargetsForDemarche');
    const getNotificationEmojiMock = jest.spyOn(notificationsService, 'getNotificationEmoji');
    const updateDispositifInDBMock = jest.spyOn(dispositifRepository, 'updateDispositifInDB');
    const insertNotificationsMock = jest.spyOn(NotificationModel, 'insertMany');
    const sendNotifications = jest.spyOn(notifications, 'sendNotifications');

    // Mock data
    const dispositifId = 'dispositifId';
    const lang = 'fr';
    const requirements = {
      age: {
        max: 99,
        min: 0,
      },
      departments: "france",
      mainThemeId: "63450dd43e23cd7181ba0b26",
      type: "demarche",
    };
    const targetUsers: AppUser[] = targets;
    const savedNotifications: Notification[] = [{
      uid: "1",
      seen: false,
      title: "Réfugiés.info",
      data: {}
    }];
    const messages: ExpoPushMessage[] = [{
      to: "1",
      title: "Réfugiés.info",
      body: "Réfugiés.info",
      data: {
        notificationId: "anything",
      },
    }];

    // Mock function implementations
    const demarcheModel = new DispositifModel(demarche);
    getAdminOptionMock.mockResolvedValue(new AdminOptionsModel({ value: true }));
    getDispositifByIdMock.mockResolvedValue(demarcheModel);
    getAllAppUsersMock.mockResolvedValue(targetUsers.map(t => new AppUserModel(t)));
    filterTargetsMock.mockReturnValue(targetUsers);
    getNotificationEmojiMock.mockReturnValue('🔔');
    insertNotificationsMock.mockResolvedValue(savedNotifications.map(n => new NotificationModel(n)));
    updateDispositifInDBMock.mockResolvedValue(dispositif);

    // Call the function
    await notifications.sendNotificationsForDemarche(dispositifId);

    // Assertions
    expect(getDispositifByIdMock).toHaveBeenCalledWith(dispositifId, {
      status: 1,
      translations: 1,
      typeContenu: 1,
      theme: 1,
      notificationsSent: 1,
      metadatas: 1
    }, 'theme');
    expect(getAdminOptionMock).toHaveBeenCalled();
    expect(getAllAppUsersMock).toHaveBeenCalled();
    expect(filterTargetsMock).toHaveBeenCalledWith(targetUsers.map(t => expect.objectContaining(omit(t, "_id"))), requirements, demarcheModel);
    expect(getNotificationEmojiMock).toHaveBeenCalledWith(demarcheModel);
    expect(insertNotificationsMock).toHaveBeenCalledWith(targetUsers.map(t => ({
      uid: t.uid,
      seen: false,
      title: `🔔 ${t.selectedLanguage === "fa" ? "پیشنهاد جدید" : "Nouvelle offre"} : ${demarche.translations[t.selectedLanguage].content.titreInformatif}`,
      data: {
        type: "dispositif",
        contentId: demarche._id.toString(),
      },
    })));
    expect(updateDispositifInDBMock).toHaveBeenCalledWith(dispositifId, {
      notificationsSent: {
        ar: true,
        en: true,
        fa: true,
        ps: true,
        ru: true,
        ti: true,
        uk: true,
      }
    });
    // FIXME: randomly generated nested id
    expect(sendNotifications).toHaveBeenCalledWith(messages.map(m => ({ ...m, data: { notificationId: expect.anything() } })));
  });

});
