// @ts-nocheck
import { getUserFavoritesInLocale } from "./getUserFavoritesInLocale";
import { getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import functions from "../../../controllers/dispositif/functions";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getDispositifById: jest.fn(),
}));

jest.mock("../../../schema/schemaDispositif", () => ({
  Dispositif: {
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
  }
}));

jest.mock("../../../schema/schemaError", () => ({
  Error: {
    save: jest.fn(),
  }
}));

describe("getUserFavoritesInLocale", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();

  it("should throw 405 if not from site ", async () => {
    const req = { fromSite: false };
    await getUserFavoritesInLocale(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("should throw 400 if no locale ", async () => {
    const req = { fromSite: true, query: { noLocale: true } };
    await getUserFavoritesInLocale(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 200 and [] if no dispo pinned", async () => {
    const req = {
      fromSite: true,
      query: { locale: "fr" },
      user: { _id: "userId" },
    };
    await getUserFavoritesInLocale(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [] });
  });

  it("should return 200 and [] if no dispo pinned", async () => {
    const req = {
      fromSite: true,
      query: { locale: "fr" },
      user: { _id: "userId", cookies: { parkourPinned: {} } },
    };
    await getUserFavoritesInLocale(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [] });
  });

  it("should return 200 and [] if no dispo pinned", async () => {
    const req = {
      fromSite: true,
      query: { locale: "fr" },
      user: { _id: "userId", cookies: { dispositifPinned: [] } },
    };
    await getUserFavoritesInLocale(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [] });
  });
  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    _id: 1,
    theme: 1,
    secondaryThemes: 1,
    abstract: 1,
    status: 1,
    typeContenu: 1,
    contenu: 1,
    mainSponsor: 1,
    needs: 1,
    lastModificationDate: 1
  };

  it("should return 200 and get dispo if dispo pinned", async () => {
    const dispo1Data = {
      titreInformatif: "TI1",
      contenu: [{}, {children: []}],
      mainSponsor: {
        nom: "",
        picture: {secure_url: null}
      }
    };
    const dispo1 = {
      titreInformatif: "TI1",
      contenu: [],
      toJSON: () => dispo1Data,
      status: "Actif",
    };
    const dispo2Data = {
      titreInformatif: "TI2",
      contenu: [{}, {children: []}],
      mainSponsor: {
        nom: "",
        picture: {secure_url: null}
      }
    };
    const dispo2 = {
      titreInformatif: "TI2",
      contenu: [],
      toJSON: () => dispo2Data,
      status: "En attente",
    };
    const dispo3Data = {
      titreInformatif: "TI3",
      contenu: [{}, {children: []}],
      mainSponsor: {
        nom: "",
        picture: {secure_url: null}
      }
    };
    const dispo3 = {
      titreInformatif: "TI3",
      contenu: [],
      toJSON: () => dispo3Data,
      status: "Actif",
    };
    getDispositifById.mockResolvedValueOnce(dispo1);
    getDispositifById.mockResolvedValueOnce(dispo2);
    getDispositifById.mockResolvedValueOnce(dispo3);
    jest.spyOn(functions, "turnToLocalized");

    const req = {
      fromSite: true,
      query: { locale: "fr" },
      user: {
        _id: "userId",
        cookies: {
          dispositifsPinned: [{ _id: "id1" }, { _id: "id2" }, { _id: "id3" }],
        },
      },
    };
    await getUserFavoritesInLocale(req, res);

    expect(getDispositifById).toHaveBeenCalledWith("id1", neededFields, "theme secondaryThemes mainSponsor");
    expect(getDispositifById).toHaveBeenCalledWith("id2", neededFields, "theme secondaryThemes mainSponsor");
    expect(getDispositifById).toHaveBeenCalledWith("id3", neededFields, "theme secondaryThemes mainSponsor");
    expect(functions.turnToLocalized).toHaveBeenCalledWith(dispo1Data, "fr");
    expect(functions.turnToLocalized).toHaveBeenCalledWith(dispo3Data, "fr");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [
        dispo1Data,
        dispo3Data,
      ],
    });
  });
});
