// @ts-nocheck
import { postWidgets } from "./postWidgets";
import { createWidget } from "../../../modules/widgets/widgets.repository";
import {
  checkIfUserIsAdmin,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { Widget } from ".../../../schema/schemaWidget";

jest.mock("../../../modules/widgets/widgets.repository", () => ({
  createWidget: jest.fn(),
}));
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn().mockReturnValue(true),
  checkIfUserIsAdmin: jest.fn().mockReturnValue(true),
}));

jest.mock("../../../schema/schemaWidget", () => ({
  Widget: jest.fn().mockImplementation(w => w)
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("postWidgets", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 405 if not from site", async () => {
    checkRequestIsFromSite.mockImplementationOnce(() => {
      throw new Error("NOT_FROM_SITE");
    });
    const req = { fromSite: false };
    await postWidgets(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
  it("should return 403 if not admin", async () => {
    checkIfUserIsAdmin.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    })
    const req = {
      user: { roles: [] },
    };
    await postWidgets(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
  it("should return 400 if no name", async () => {
    const req = {
      body: { typeContenu: ["demarches"], tags: ["administratif"]},
      user: { roles: [], userId: "id" },
    };
    await postWidgets(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
  it("should return 400 if no tag", async () => {
    const req = {
      body: { name:"test", typeContenu: ["demarches"], tags: []},
      user: { roles: [], userId: "id" },
    };
    await postWidgets(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
  it("should return 400 if no typeContenu", async () => {
    const req = {
      body: { name:"test", tags: ["administratif"]},
      user: { roles: [], userId: "id" },
    };
    await postWidgets(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 200", async () => {
    const req = {
      fromSite: true,
      body: {
        name: "test",
        typeContenu: ["demarches"],
        tags: ["administratif"],
        location: {
          city: "Paris"
        }
      },
      user: { roles: [] },
      userId: "id"
    };
    await postWidgets(req, res);
    expect(createWidget).toHaveBeenCalledWith({
      name: "test",
      tags: ["administratif"],
      typeContenu: ["demarches"],
      author: "id",
      // no city because no department
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

});
