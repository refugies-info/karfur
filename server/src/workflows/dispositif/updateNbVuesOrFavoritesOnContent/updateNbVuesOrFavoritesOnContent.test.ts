// @ts-nocheck
import { updateNbVuesOrFavoritesOnContent } from "./updateNbVuesOrFavoritesOnContent";
import { updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  updateDispositifInDB: jest.fn(),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("updateNbVuesOrFavoritesOnContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return 500 if not from site", async () => {
    const res = mockResponse();

    await updateNbVuesOrFavoritesOnContent(
      {
        body: { query: { id: "id", nbVues: 2 } },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return 200 and callupdateDispositifInDB ", async () => {
    const res = mockResponse();

    await updateNbVuesOrFavoritesOnContent(
      {
        body: { query: { id: "id", nbVues: 2 } },
        fromSite: true,
      },
      res
    );
    expect(updateDispositifInDB).toHaveBeenCalledWith("id", { nbVues: 2 });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
