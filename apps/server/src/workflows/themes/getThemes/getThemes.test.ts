// @ts-nocheck
import { getActiveLanguagesFromDB } from "~/modules/langues/langues.repository";
import { getAllThemes } from "~/modules/themes/themes.repository";
import getThemes from "./getThemes";

/* jest.mock("../../../modules/themes/themes.repository", () => ({
  getAllThemes: jest.fn(),
}));
jest.mock("../../../modules/langues/langues.repository", () => ({
  getActiveLanguagesFromDB: jest.fn(),
})); */

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe.skip("getThemes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 200", async () => {
    const req = {};
    await getThemes[0](req, res);
    expect(getAllThemes).toHaveBeenCalled();
    expect(getActiveLanguagesFromDB).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
