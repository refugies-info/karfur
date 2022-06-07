// @ts-nocheck
import { deleteWidget } from "./deleteWidget";
import { deleteWidgetById } from "../../../modules/widgets/widgets.repository";
import {
  checkIfUserIsAdmin,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";

jest.mock("../../../modules/widgets/widgets.repository", () => ({
  deleteWidgetById: jest.fn(),
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

describe("deleteWidget", () => {
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
    await deleteWidget(req, res);
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
    await deleteWidget(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
  it("should return 400 if no id", async () => {
    const req = {
      user: { roles: [], userId: "id" },
      params: {id: null}
    };
    await deleteWidget(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 200", async () => {
    const req = {
      user: { roles: [], userId: "id" },
      params: {id: "widgetId"}
    };
    await deleteWidget(req, res);
    expect(deleteWidgetById).toHaveBeenCalledWith("widgetId");
    expect(res.status).toHaveBeenCalledWith(200);
  });

});
