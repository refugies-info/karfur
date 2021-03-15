//@ts-nocheck
import { updateDispositifReactions } from "./updateDispositifReactions";
import {
  updateDispositifInDB,
  modifyReadSuggestionInDispositif,
} from "../../../modules/dispositif/dispositif.repository";
import mockdate from "mockdate";

mockdate.set("2019-11-10T10:00:00.00Z");

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  updateDispositifInDB: jest.fn(),
  modifyReadSuggestionInDispositif: jest.fn(),
}));

jest.mock("uniqid", () => ({
  __esModule: true, // this property makes it work
  default: () => "test",
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("updateDispositifReactions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();
  it("should return 405 if not from site", async () => {
    const req = {};

    await updateDispositifReactions(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("should return 400 if invalid request", async () => {
    const req = { fromSite: true, body: { fieldName: "fieldName" } };
    await updateDispositifReactions(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if invalid request", async () => {
    const req = { fromSite: true, body: { dispositifId: "dispositifId" } };
    await updateDispositifReactions(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if type not in enum", async () => {
    const req = {
      fromSite: true,
      body: {
        dispositifId: "dispositifId",
        fieldName: "fieldName",
        type: "type",
      },
    };
    await updateDispositifReactions(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should call updateDispositifInDB if type remove", async () => {
    const req = {
      fromSite: true,
      body: {
        dispositifId: "dispositifId",
        fieldName: "suggestions",
        suggestionId: "suggestionId",
        type: "remove",
      },
    };
    await updateDispositifReactions(req, res);
    expect(updateDispositifInDB).toHaveBeenCalledWith("dispositifId", {
      $pull: { ["suggestions"]: { suggestionId: "suggestionId" } },
    });
    expect(modifyReadSuggestionInDispositif).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should call updateDispositifInDB if type add with userId", async () => {
    const req = {
      fromSite: true,
      body: {
        dispositifId: "dispositifId",
        fieldName: "suggestions",
        suggestionId: "suggestionId",
        type: "add",
        text: "text",
      },
      userId: "userId",
      user: { username: "username", picture: null },
    };
    await updateDispositifReactions(req, res);
    expect(modifyReadSuggestionInDispositif).not.toHaveBeenCalled();
    expect(updateDispositifInDB).toHaveBeenCalledWith("dispositifId", {
      $push: {
        ["suggestions"]: {
          userId: "userId",
          username: "username",
          picture: null,
          text: "text",
          createdAt: new Date("2019-11-10T10:00:00.00Z"),
          suggestionId: "test",
        },
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should call updateDispositifInDB if type add without userId", async () => {
    const req = {
      fromSite: true,
      body: {
        dispositifId: "dispositifId",
        fieldName: "suggestions",
        suggestionId: "suggestionId",
        type: "add",
        text: "text",
      },
    };
    await updateDispositifReactions(req, res);
    expect(modifyReadSuggestionInDispositif).not.toHaveBeenCalled();
    expect(updateDispositifInDB).toHaveBeenCalledWith("dispositifId", {
      $push: {
        ["suggestions"]: {
          text: "text",
          createdAt: new Date("2019-11-10T10:00:00.00Z"),
          suggestionId: "test",
        },
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should call modifyReadSuggestionInDispositif ", async () => {
    const req = {
      fromSite: true,
      body: {
        dispositifId: "dispositifId",
        fieldName: "suggestions",
        suggestionId: "suggestionId",
        type: "read",
      },
    };
    await updateDispositifReactions(req, res);
    expect(modifyReadSuggestionInDispositif).toHaveBeenCalledWith(
      "dispositifId",
      "suggestionId"
    );
    expect(updateDispositifInDB).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 500 if type read when modifyReadSuggestionInDispositif ", async () => {
    modifyReadSuggestionInDispositif.mockRejectedValueOnce(new Error("erreur"));
    const req = {
      fromSite: true,
      body: {
        dispositifId: "dispositifId",
        fieldName: "suggestions",
        suggestionId: "suggestionId",
        type: "read",
      },
    };
    await updateDispositifReactions(req, res);
    expect(modifyReadSuggestionInDispositif).toHaveBeenCalledWith(
      "dispositifId",
      "suggestionId"
    );
    expect(updateDispositifInDB).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
