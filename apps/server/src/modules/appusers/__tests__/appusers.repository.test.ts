import { AppUserModel } from "@refugies-info/mongo";
import {
  updateNotificationsSettings,
  updateOrCreateAppUser,
} from "~/modules/appusers/appusers.repository";

describe("appusers.repository", () => {
  beforeEach(async () => {
    await AppUserModel.deleteMany({});
  });

  it("should merge theme updates without persisting Mongoose internal keys", async () => {
    const uid = "appuser-notification-settings-lean-test";

    await AppUserModel.create({
      uid,
      notificationsSettings: {
        global: true,
        local: true,
        demarches: true,
        themes: {
          "theme-1": true,
        },
      },
    });

    const firstUpdate = await updateNotificationsSettings(uid, {
      global: false,
      themes: {
        "theme-2": false,
      },
    });

    expect(firstUpdate).toEqual({
      global: false,
      local: true,
      demarches: true,
      themes: {
        "theme-1": true,
        "theme-2": false,
      },
    });

    const secondUpdate = await updateNotificationsSettings(uid, {
      themes: {
        "theme-3": true,
      },
    });

    expect(secondUpdate).toEqual({
      global: false,
      local: true,
      demarches: true,
      themes: {
        "theme-1": true,
        "theme-2": false,
        "theme-3": true,
      },
    });

    const saved = await AppUserModel.findOne({ uid }).lean();
    expect(saved?.notificationsSettings).toEqual(secondUpdate);

    const themeKeys = Object.keys(saved?.notificationsSettings?.themes || {});
    expect(themeKeys.some((key) => key.startsWith("$__"))).toBe(false);
  });

  it("should apply default settings when notificationsSettings is missing", async () => {
    const uid = "appuser-notification-settings-defaults-test";

    await AppUserModel.create({ uid });

    const updated = await updateNotificationsSettings(uid, {
      local: false,
    });

    expect(updated).toEqual({
      global: true,
      local: false,
      demarches: true,
      themes: {},
    });

    const saved = await AppUserModel.findOne({ uid }).lean();
    expect(saved?.notificationsSettings).toEqual(updated);
  });

  it("should not delete other app users when no push token is sent", async () => {
    await AppUserModel.create({ uid: "other-without-token" });
    await AppUserModel.create({ uid: "current" });

    await updateOrCreateAppUser({ uid: "current", age: "18 à 25 ans" }, []);

    expect(await AppUserModel.countDocuments({ uid: "other-without-token" })).toBe(1);
  });

  it("should delete the stale app user sharing the same push token", async () => {
    await AppUserModel.create({ uid: "stale", expoPushToken: "ExponentPushToken[same]" });

    await updateOrCreateAppUser({ uid: "current", expoPushToken: "ExponentPushToken[same]" }, []);

    expect(await AppUserModel.countDocuments({ uid: "stale" })).toBe(0);
  });
});
