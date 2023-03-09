// @ts-nocheck
import saveNeed from "./saveNeed";
import { getNeedFromDB, saveNeedInDB } from "../../../modules/needs/needs.repository";
import {
  checkIfUserIsAdminOrExpert,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";

jest.mock("../../../modules/needs/needs.repository", () => ({
  getNeedFromDB: jest.fn().mockResolvedValue({
    fr: {
      text: "titre",
      subtitle: "sous-titre",
      updatedAt: "2022-12-31"
    }
  }),
  saveNeedInDB: jest.fn(),
}));
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn().mockReturnValue(true),
  checkIfUserIsAdminOrExpert: jest.fn().mockReturnValue(true),
}));

jest.mock("../../../schema/schemaNeeds", () => ({
  Need: jest.fn().mockImplementation(w => w)
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("saveNeed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 405 if not from site", async () => {
    checkRequestIsFromSite.mockImplementationOnce(() => {
      throw new Error("NOT_FROM_SITE");
    });
    const req = {
      fromSite: false,
      params: {}
    };
    await saveNeed[1](req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
  it("should return 403 if not admin or expert", async () => {
    checkIfUserIsAdminOrExpert.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    })
    const req = {
      user: { roles: [] },
      params: {}
    };
    await saveNeed[1](req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
  it("should return 400 if no id", async () => {
    const req = {
      user: { roles: [] },
      params: {}
    };
    await saveNeed[1](req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 200 and edit updateAt when text changes", async () => {

    const req = {
      user: { roles: [] },
      params: {
        id: "needId"
      },
      body: {
        fr: {
          text: "nouveau titre",
          subtitle: "sous-titre"
        }
      }
    };

    const date = "2023-01-01";
    Date.now = jest.fn(() => date);

    await saveNeed[1](req, res);
    expect(saveNeedInDB).toHaveBeenCalledWith("needId", {
      fr: {
        text: "nouveau titre",
        subtitle: "sous-titre",
        updatedAt: "2023-01-01"
      }
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 and edit updateAt when subtitle changes", async () => {
    const req = {
      user: { roles: [] },
      params: {
        id: "needId"
      },
      body: {
        fr: {
          text: "titre",
          subtitle: "nouveau sous-titre"
        }
      }
    };

    const date = "2023-01-01";
    Date.now = jest.fn(() => date);

    await saveNeed[1](req, res);
    expect(saveNeedInDB).toHaveBeenCalledWith("needId", {
      fr: {
        text: "titre",
        subtitle: "nouveau sous-titre",
        updatedAt: "2023-01-01"
      }
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 and not edit updateAt", async () => {
    const req = {
      user: { roles: [] },
      params: {
        id: "needId"
      },
      body: {
        fr: {
          text: "titre",
          subtitle: "sous-titre"
        }
      }
    };

    const date = "2023-01-01";
    Date.now = jest.fn(() => date);

    await saveNeed[1](req, res);
    expect(saveNeedInDB).toHaveBeenCalledWith("needId", {
      fr: {
        text: "titre",
        subtitle: "sous-titre",
        updatedAt: "2022-12-31"
      }
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 when edit translation", async () => {
    const req = {
      user: { roles: [] },
      params: {
        id: "needId"
      },
      body: {
        en: {
          text: "title",
          subtitle: "subtitle",
          updatedAt: "2023-02-01"
        }
      }
    };

    await saveNeed[1](req, res);
    expect(saveNeedInDB).toHaveBeenCalledWith("needId", {
      en: {
        text: "title",
        subtitle: "subtitle",
        updatedAt: "2023-02-01"
      }
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
