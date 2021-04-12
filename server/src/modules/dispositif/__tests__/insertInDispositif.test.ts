// @ts-nocheck
import { insertInDispositif } from "../insertInDispositif";
import {
  getDispositifByIdWithAllFields,
  updateDispositifInDB,
} from "../dispositif.repository";

jest.mock("../dispositif.repository", () => ({
  getDispositifByIdWithAllFields: jest.fn(),
  updateDispositifInDB: jest.fn(),
}));

describe("insertInDispositif", () => {
  it("should call getDispositifByIdWithAllFields and update in db when no trad", async () => {
    const dispo = {
      titreInformatif: "titre",
      abstract: "description",
      _id: "id",
      contenu: [{ title: "C'est quoi", content: "content", children: [] }],
      traductions: ["trad2", "trad3"],
      participants: ["userId2", "userId3"],
    };
    getDispositifByIdWithAllFields.mockResolvedValueOnce(dispo);

    const trad = {
      articleId: "articleId",
      translatedText: {
        titreInformatif: "title",
        abstract: "description english",
        contenu: [
          { title: "C'est quoi en", content: "content en", children: [] },
        ],
      },
      traductions: [
        { _id: "trad1", userId: { _id: "userId1" } },
        { _id: "trad2", userId: { _id: "userId2" } },
      ],
    };

    const result = {
      _id: "id",
      titreInformatif: { fr: "titre", en: "title" },
      abstract: { fr: "description", en: "description english" },
      contenu: [
        {
          title: { en: "C'est quoi en", fr: "C'est quoi" },
          content: { en: "content en", fr: "content" },
          children: [],
        },
      ],
      traductions: ["trad2", "trad3", "trad1"],
      participants: ["userId2", "userId3", "userId1"],
      avancement: { en: 1 },
    };
    await insertInDispositif(trad, "en");
    expect(getDispositifByIdWithAllFields).toHaveBeenCalledWith("articleId");
    expect(updateDispositifInDB).toHaveBeenCalledWith("id", result);
  });

  it("should call getDispositifByIdWithAllFields and update in db when new language", async () => {
    const dispo = {
      _id: "id",
      titreInformatif: { fr: "titre", en: "title" },
      abstract: { fr: "description", en: "description english" },
      contenu: [
        {
          title: { en: "C'est quoi en", fr: "C'est quoi" },
          content: { en: "content en", fr: "content" },
          children: [],
        },
      ],
      traductions: ["trad2", "trad3", "trad1"],
      participants: ["userId2", "userId3", "userId1"],
      avancement: { en: 1 },
    };
    getDispositifByIdWithAllFields.mockResolvedValueOnce(dispo);

    const trad = {
      articleId: "articleId",
      translatedText: {
        titreInformatif: "title ar",
        abstract: "description ar",
        contenu: [
          { title: "C'est quoi ar", content: "content ar", children: [] },
        ],
      },
      traductions: [{ _id: "trad5", userId: { _id: "userId5" } }],
    };

    const result = {
      _id: "id",
      titreInformatif: { fr: "titre", en: "title", ar: "title ar" },
      abstract: {
        fr: "description",
        en: "description english",
        ar: "description ar",
      },
      contenu: [
        {
          title: { en: "C'est quoi en", fr: "C'est quoi", ar: "C'est quoi ar" },
          content: { en: "content en", fr: "content", ar: "content ar" },
          children: [],
        },
      ],
      traductions: ["trad2", "trad3", "trad1", "trad5"],
      participants: ["userId2", "userId3", "userId1", "userId5"],
      avancement: { en: 1, ar: 1 },
    };
    await insertInDispositif(trad, "ar");
    expect(getDispositifByIdWithAllFields).toHaveBeenCalledWith("articleId");
    expect(updateDispositifInDB).toHaveBeenCalledWith("id", result);
  });
});
