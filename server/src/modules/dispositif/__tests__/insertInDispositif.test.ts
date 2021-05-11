// @ts-nocheck
import { insertInDispositif } from "../insertInDispositif";
import { updateDispositifInDB } from "../dispositif.repository";

jest.mock("../dispositif.repository", () => ({
  updateDispositifInDB: jest.fn().mockResolvedValue("updatedDispo"),
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
    const { insertedDispositif, traductorIdsList } = await insertInDispositif(
      trad,
      "en",
      dispo
    );
    expect(updateDispositifInDB).toHaveBeenCalledWith("id", result);
    expect(insertedDispositif).toEqual("updatedDispo");
    expect(traductorIdsList).toEqual(["userId1", "userId2"]);
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

    const trad = {
      articleId: "articleId",
      translatedText: {
        titreInformatif: "title ar",
        abstract: "description ar",
        contenu: [
          { title: "C'est quoi ar", content: "content ar", children: [] },
        ],
      },
      traductions: [
        { _id: "trad5", userId: { _id: "userId5" } },
        { _id: "trad6", userId: { _id: "userId5" } },
      ],
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
      traductions: ["trad2", "trad3", "trad1", "trad5", "trad6"],
      participants: ["userId2", "userId3", "userId1", "userId5"],
      avancement: { en: 1, ar: 1 },
    };
    const { insertedDispositif, traductorIdsList } = await insertInDispositif(
      trad,
      "ar",
      dispo
    );
    expect(updateDispositifInDB).toHaveBeenCalledWith("id", result);
    expect(insertedDispositif).toEqual("updatedDispo");
    expect(traductorIdsList).toEqual(["userId5"]);
  });
});
