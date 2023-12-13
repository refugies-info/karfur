// @ts-nocheck
/* import postThemes, { hasOneNotificationEnabled } from "./postThemes";
import { createTheme } from "../../../modules/themes/themes.repository";
import { checkIfUserIsAdmin, checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { updateNotificationsSettings } from "../../../modules/appusers/appusers.repository"; */
/* 
jest.mock("../../../modules/appusers/appusers.repository", () => ({
  getAllAppUsers: jest.fn().mockResolvedValue([
    {
      uid: "UserUUID1",
      city: "Paris",
      department: "75 - Paris",
      selectedLanguage: "fr",
      age: "42",
      frenchLevel: "c2",
      expoPushToken: "expoToken",
      notificationsSettings: {
        global: true,
        local: false,
        demarches: true,
        themes: {
          test: false,
          test2: true,
          test3: false,
          test4: false
        }
      }
    },
    {
      uid: "UserUUID2",
      city: "Paris",
      department: "75 - Paris",
      selectedLanguage: "fr",
      age: "42",
      frenchLevel: "c2",
      expoPushToken: "expoToken",
      notificationsSettings: {
        global: false,
        local: false,
        demarches: false,
        themes: {
          test: false,
          test2: false,
          test3: false,
          test4: false
        }
      }
    }
  ]),
  updateNotificationsSettings: jest.fn()
}));

jest.mock("../../../modules/themes/themes.repository", () => ({
  createTheme: jest.fn((theme) => ({ ...theme, _id: "ThemeUUID" }))
}));
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn().mockReturnValue(true),
  checkIfUserIsAdmin: jest.fn().mockReturnValue(true)
}));

jest.mock("../../../schema/schemaTheme", () => ({
  Theme: jest.fn().mockImplementation((w) => w)
}));

jest.mock("../../../modules/langues/langues.repository", () => ({
  getActiveLanguagesFromDB: jest.fn()
})); */

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe.skip("postThemes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 405 if not from site", async () => {
    checkRequestIsFromSite.mockImplementationOnce(() => {
      throw new Error("NOT_FROM_SITE");
    });
    const req = { fromSite: false };
    await postThemes[1](req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
  it("should return 403 if not admin", async () => {
    checkIfUserIsAdmin.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    });
    const req = {
      user: { roles: [] }
    };
    await postThemes[1](req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should return 200", async () => {
    const req = {
      fromSite: true,
      body: {
        name: { fr: "Theme" }
      },
      user: { roles: [] },
      userId: "id"
    };
    await postThemes[1](req, res);
    expect(createTheme).toHaveBeenCalledWith({
      name: { fr: "Theme" }
    });
    expect(getActiveLanguagesFromDB).toHaveBeenCalled();

    expect(updateNotificationsSettings).toHaveBeenNthCalledWith(1, "UserUUID1", {
      demarches: true,
      global: true,
      local: false,
      themes: { ThemeUUID: true, test: false, test2: true, test3: false, test4: false }
    });
    expect(updateNotificationsSettings).toHaveBeenNthCalledWith(2, "UserUUID2", {
      global: false,
      local: false,
      demarches: false,
      themes: { ThemeUUID: false, test: false, test2: false, test3: false, test4: false }
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe.skip("hasOneNotificationEnabled", () => {
  it("should return true if the user has one notification theme enabled", () => {
    const user: AppUserType = {
      uid: "UserUUID",
      city: "Paris",
      department: "75 - Paris",
      selectedLanguage: "fr",
      age: "42",
      frenchLevel: "c2",
      expoPushToken: "expoToken",
      notificationsSettings: {
        global: false,
        local: false,
        demarches: false,
        themes: {
          test: false,
          test2: true,
          test3: false,
          test4: false
        }
      }
    };

    expect(hasOneNotificationEnabled(user)).toBe(true);
  });
  it("should return true if the user has one notification enabled", () => {
    const user: AppUserType = {
      uid: "UserUUID",
      city: "Paris",
      department: "75 - Paris",
      selectedLanguage: "fr",
      age: "42",
      frenchLevel: "c2",
      expoPushToken: "expoToken",
      notificationsSettings: {
        global: true,
        local: false,
        demarches: false,
        themes: {
          test: false,
          test2: false,
          test3: false,
          test4: false
        }
      }
    };

    expect(hasOneNotificationEnabled(user)).toBe(true);
  });
  it("should return false if the user does not have one notification enabled", () => {
    const user: AppUserType = {
      uid: "UserUUID",
      city: "Paris",
      department: "75 - Paris",
      selectedLanguage: "fr",
      age: "42",
      frenchLevel: "c2",
      expoPushToken: "expoToken",
      notificationsSettings: {
        global: false,
        local: false,
        demarches: false,
        themes: {
          test: false,
          test2: false,
          test3: false,
          test4: false
        }
      }
    };

    expect(hasOneNotificationEnabled(user)).toBe(false);
  });
});
