// @ts-nocheck
/* import { updateLanguagesAvancement } from "../langues.service";
import { getActiveLanguagesFromDB, updateLanguageAvancementInDB } from "../langues.repository";
import { getActiveContents } from "../../dispositif/dispositif.repository";
 */
/* jest.mock("../langues.repository", () => ({
  getActiveLanguagesFromDB: jest.fn(),
  updateLanguageAvancementInDB: jest.fn(),
}));

jest.mock("../../dispositif/dispositif.repository", () => ({
  getActiveContents: jest.fn(),
})); */

describe.skip("updateLanguagesAvancement", () => {
  it("should get active languages, get active contents and update avancement", async () => {
    getActiveLanguagesFromDB.mockResolvedValueOnce([
      { i18nCode: "en", _id: "langue1" },
      { i18nCode: "ps", _id: "langue2" },
    ]);
    getActiveContents.mockResolvedValueOnce([{ _id: "id1" }, { _id: "id2" }, { _id: "id3" }, { _id: "id6" }]);

    await updateLanguagesAvancement();
    expect(getActiveLanguagesFromDB).toHaveBeenCalledWith();
    expect(getActiveContents).toHaveBeenCalledWith({ _id: 1 });
    // expect(getPublishedTradIds).toHaveBeenCalledWith("en");
    // expect(getPublishedTradIds).toHaveBeenCalledWith("ps");

    expect(updateLanguageAvancementInDB).toHaveBeenCalledWith("langue1", 3 / 4);
    expect(updateLanguageAvancementInDB).toHaveBeenCalledWith("langue2", 2 / 4);
  });
});

