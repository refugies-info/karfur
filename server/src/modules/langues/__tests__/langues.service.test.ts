// @ts-nocheck
import { updateLanguagesAvancement } from "../langues.service";
import {
  getActiveLanguagesFromDB,
  updateLanguageAvancementInDB,
} from "../langues.repository";
import { getActiveContents } from "../../dispositif/dispositif.repository";
import { getPublishedTradIds } from "../../traductions/traductions.repository";

jest.mock("../langues.repository", () => ({
  getActiveLanguagesFromDB: jest.fn(),
  updateLanguageAvancementInDB: jest.fn(),
}));

jest.mock("../../dispositif/dispositif.repository", () => ({
  getActiveContents: jest.fn(),
}));

jest.mock("../../traductions/traductions.repository", () => ({
  getPublishedTradIds: jest.fn(),
}));

describe("updateLanguagesAvancement", () => {
  it("should get active languages, get active contents and update avancement", async () => {
    getActiveLanguagesFromDB.mockResolvedValueOnce([
      { i18nCode: "en", _id: "langue1" },
      { i18nCode: "ps", _id: "langue2" },
    ]);
    getPublishedTradIds.mockResolvedValueOnce([
      "id1",
      "id2",
      "id3",
      "id4",
      "id5",
    ]);
    getPublishedTradIds.mockResolvedValueOnce(["id1", "id2", "id4"]);
    getActiveContents.mockResolvedValueOnce([
      { _id: "id1" },
      { _id: "id2" },
      { _id: "id3" },
      { _id: "id6" },
    ]);

    await updateLanguagesAvancement();
    expect(getActiveLanguagesFromDB).toHaveBeenCalledWith();
    expect(getActiveContents).toHaveBeenCalledWith({ _id: 1 });
    expect(getPublishedTradIds).toHaveBeenCalledWith("en");
    expect(getPublishedTradIds).toHaveBeenCalledWith("ps");

    expect(updateLanguageAvancementInDB).toHaveBeenCalledWith("langue1", 3 / 4);
    expect(updateLanguageAvancementInDB).toHaveBeenCalledWith("langue2", 2 / 4);
  });
});
