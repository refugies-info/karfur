// @ts-nocheck
/* import { Langue } from "../../typegoose";
import { getActiveLanguagesFromDB } from "../langues.repository"; */
/* 
jest.mock("../../typegoose", () => ({
  Langue: {
    find: jest.fn()
  }
})); */

describe.skip("getActiveLanguagesFromDB", () => {
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
