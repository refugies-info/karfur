// @ts-nocheck
import getThemes from "./getThemes";
import {getAllThemes} from "../../../modules/themes/themes.repository";

jest.mock("../../../modules/themes/themes.repository", () => ({
  getAllThemes: jest.fn(),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getThemes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 200", async () => {
    const req = {};
    await getThemes[0](req, res);
    expect(getAllThemes).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

});
