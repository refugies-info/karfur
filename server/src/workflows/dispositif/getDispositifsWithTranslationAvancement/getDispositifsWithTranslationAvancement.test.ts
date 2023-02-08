// @ts-nocheck
import { getDispositifsWithTranslationAvancement } from "./getDispositifsWithTranslationAvancement";
import { getActiveContents } from "../../../modules/dispositif/dispositif.repository";
import { getTraductionsByLanguage } from "../../../modules/traductions/traductions.repository";
import { Dispositif, Id } from "../../../typegoose";
import { omit } from "lodash";

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getActiveContents: jest.fn()
}));

jest.mock("../../../modules/traductions/traductions.repository", () => ({
  getTraductionsByLanguage: jest.fn()
}));

jest.mock("../../../typegoose/Dispositif", () => ({
  DispositifModel: {
    find: jest.fn()
  }
}));
jest.mock("../../../schema/schemaTraduction", () => ({
  Traduction: {
    find: jest.fn()
  }
}));
jest.mock("src/typegoose/Error", () => ({
  Error: {
    save: jest.fn()
  }
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
  return res;
};

describe("getDispositifsWithTranslationAvancement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();

  it("should return 405 if not from site", async () => {
    const req = { fromSite: false };
    await getDispositifsWithTranslationAvancement(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("should return 400 if invalid request", async () => {
    const req = { fromSite: true };
    await getDispositifsWithTranslationAvancement(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if invalid request", async () => {
    const req = { fromSite: true, query: { _id: "_id" } };
    await getDispositifsWithTranslationAvancement(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if invalid request", async () => {
    const req = { fromSite: true, query: { locale: "test" } };
    await getDispositifsWithTranslationAvancement(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
  const neededFields = {
    nbMots: 1,
    created_at: 1,
    type: 1,
    translations: 1
  };
  const traductionFields = {
    articleId: 1,
    avancement: 1,
    status: 1,
    updatedAt: 1,
    userId: 1
  };

  // no corresponding trad
  const content1 = {
    nbMots: 200,
    created_at: "01/01/2021",
    type: "dispositif",
    _id: "id1",
    translations: {
      fr: {
        content: {
          titreInformatif: "t1",
          titreMarque: "TM1"
        }
      }
    }
  };

  const result1 = {
    ...omit(content1, "translations"),
    titreInformatif: "t1",
    titreMarque: "TM1",
    lastTradUpdatedAt: null,
    avancementTrad: 0,
    avancementExpert: 0,
    tradStatus: "À traduire"
  };

  // 1 corresponding trad, not userId
  const content2: Partial<Dispositif> = {
    nbMots: 400,
    created_at: new Date("02/02/2022"),
    type: "demarche",
    _id: "id2",
    translations: {
      fr: {
        content: {
          titreInformatif: "t2",
          titreMarque: "TM2"
        }
      }
    }
  };

  const result2 = {
    ...omit(content2, "translations"),
    titreInformatif: "t2",
    titreMarque: "TM2",
    lastTradUpdatedAt: 18,
    avancementTrad: 1,
    avancementExpert: 0,
    tradStatus: "Validée"
  };

  const tradC2 = {
    articleId: "id2",
    avancement: 1,
    status: "Validée",
    updatedAt: 18,
    userId: "userId1"
  };

  // 2 corresponding trad, one userId
  const content3 = {
    nbMots: 400,
    created_at: "03/03/303",
    type: "demarche",
    _id: "id3",
    translations: {
      fr: {
        content: {
          titreInformatif: "t3",
          titreMarque: "TM3"
        }
      }
    }
  };

  const tradC3 = {
    articleId: "id3",
    avancement: 0.8,
    status: "À revoir",
    updatedAt: 78,
    userId: "userId1"
  };

  const tradC4 = {
    articleId: "id3",
    avancement: 0.6,
    status: "En attente",
    updatedAt: 17,
    userId: "userId"
  };

  const result3 = {
    ...omit(content3, "translations"),
    titreInformatif: "t3",
    titreMarque: "TM3",
    lastTradUpdatedAt: 78,
    avancementTrad: 0.8,
    avancementExpert: 0.6,
    tradStatus: "À revoir"
  };

  // 2 corresponding trad, one userId
  const content4 = {
    nbMots: 400,
    created_at: "03/03/303",
    type: "demarche",
    _id: "id4",
    translations: {
      fr: {
        content: {
          titreInformatif: "t4",
          titreMarque: "TM4"
        }
      }
    }
  };

  const tradC6 = {
    articleId: "id4",
    avancement: 0.8,
    status: "En attente",
    updatedAt: 78,
    userId: "userId1"
  };

  const tradC5 = {
    articleId: "id4",
    avancement: 0.6,
    status: "À traduire",
    updatedAt: 17,
    userId: "userId"
  };

  const result4 = {
    ...omit(content4, "translations"),
    titreInformatif: "t4",
    titreMarque: "TM4",
    lastTradUpdatedAt: 78,
    avancementTrad: 0.8,
    avancementExpert: 0.6,
    tradStatus: "En attente"
  };

  const traductions = [tradC2, tradC4, tradC3, tradC4, tradC5, tradC6];
  const contents = [content1, content2, content3, content4];

  it("should get contents, get trad and return correct data", async () => {
    getActiveContents.mockResolvedValueOnce(contents);
    getTraductionsByLanguage.mockResolvedValueOnce(traductions);
    const req = { fromSite: true, query: { locale: "en" }, userId: "userId" };
    await getDispositifsWithTranslationAvancement(req, res);
    expect(getActiveContents).toHaveBeenCalledWith(neededFields);

    expect(getTraductionsByLanguage).toHaveBeenCalledWith("en", traductionFields);
    const results = [result1, result2, result3, result4];
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: results });
  });
});
