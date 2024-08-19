// @ts-nocheck
/* import { patchWidget } from "./patchWidget";
import { updateWidget } from "../../../modules/widgets/widgets.repository";
import {
  checkIfUserIsAdmin,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { Widget } from ".../../../schema/schemaWidget"; */

/* jest.mock("../../../modules/widgets/widgets.repository", () => ({
  updateWidget: jest.fn(),
}));
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn().mockReturnValue(true),
  checkIfUserIsAdmin: jest.fn().mockReturnValue(true),
}));

jest.mock("../../../schema/schemaWidget", () => ({
  Widget: jest.fn().mockImplementation(w => w)
}));
 */
type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe.skip("patchWidget", () => {
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
    await patchWidget(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
  it("should return 403 if not admin", async () => {
    checkIfUserIsAdmin.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    })
    const req = {
      user: { roles: [] },
      params: {}
    };
    await patchWidget(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
  it("should return 400 if no id", async () => {
    const req = {
      fromSite: true,
      user: { roles: [] },
      params: { id: null }
    };
    await patchWidget(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 200", async () => {
    const req = {
      fromSite: true,
      user: { roles: [] },
      params: { id: "widgetId" },
      userId: "userId",
      body: {
        typeContenu: ["dispositif"],
        themes: [{ _id: "xyz" }],
        languages: [],
        department: ""
      }
    };
    await patchWidget(req, res);
    expect(updateWidget).toHaveBeenCalledWith("widgetId", {
      author: "userId",
      typeContenu: ["dispositif"],
      themes: ["xyz"],
      languages: [],
      department: ""
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

});
