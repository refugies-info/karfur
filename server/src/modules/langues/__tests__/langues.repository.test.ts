// @ts-nocheck
import { Langue } from "src/typegoose";
import { getActiveLanguagesFromDB } from "../langues.repository";

jest.mock("src/typegoose", () => ({
  Langue: {
    find: jest.fn()
  }
}));

describe("getActiveLanguagesFromDB", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call Langue.find", async () => {
    Langue.find.mockReturnValueOnce({
      sort: jest.fn()
    });
    await getActiveLanguagesFromDB();
    expect(Langue.find).toHaveBeenCalledWith(
      { avancement: { $gt: 0 } },
      {
        langueFr: 1,
        langueLoc: 1,
        langueCode: 1,
        i18nCode: 1,
        avancement: 1,
        avancementTrad: 1
      }
    );
  });
});
