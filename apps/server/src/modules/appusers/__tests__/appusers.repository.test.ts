import { AppUserModel } from "@refugies-info/mongo";
import { updateNotificationsSettings } from "~/modules/appusers/appusers.repository";

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

    const updated = await updateNotificationsSettings(uid, {
      global: false,
      themes: {
        "theme-2": false,
      },
    });

    expect(updated).toEqual({
      global: false,
      local: true,
      demarches: true,
      themes: {
        "theme-1": true,
        "theme-2": false,
      },
    });

    const saved = await AppUserModel.findOne({ uid }).lean();
    expect(saved?.notificationsSettings).toEqual(updated);

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
});
