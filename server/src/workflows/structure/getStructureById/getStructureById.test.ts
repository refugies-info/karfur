// @ts-nocheck
import { getStructureById } from "./getStructureById";
import { getStructureFromDB } from "src/models/structure/structure.repository";
import { turnToLocalized } from "../../../controllers/dispositif/functions";

const structure = { id: "id" };

jest.mock("src/models/structure/structure.repository", () => ({
  getStructureFromDB: jest.fn().mockResolvedValue({
    id: "id",
  }),
}));

jest.mock("../../../controllers/dispositif/functions", () => ({
  turnToLocalized: jest.fn(),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const dispositif1 = {
  _id: "dispo1",
  contenu: "content1",
  unusedField: "unusedField",
  abstract: "abstract",
  status: "Actif",
  tags: [],
  titreInformatif: "titre",
  titreMarque: "titreMarque",
};

const simplifiedDispo1 = {
  _id: "dispo1",
  abstract: "abstract",
  status: "Actif",
  tags: [],
  titreInformatif: "titre",
  titreMarque: "titreMarque",
};

const simplifiedDispo2 = {
  _id: "dispo2",
  abstract: "abstract",
  status: "Actif",
  tags: [],
  titreInformatif: "titre",
  titreMarque: "titreMarque",
};

const dispositif2 = {
  _id: "dispo2",
  contenu: "content2",
  unusedField: "unusedField",
  abstract: "abstract",
  status: "Actif",
  tags: [],
  titreInformatif: "titre",
  titreMarque: "titreMarque",
};

const structure1 = {
  id: "id",
  dispositifsAssocies: [dispositif1, dispositif2],
};

describe("getStructureById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call getStructureFromDB with correct params and return result with a responsable", async () => {
    const res = mockResponse();
    await getStructureById(
      {
        query: {
          id: "id",
          withDisposAssocies: "true",
          localeOfLocalizedDispositifsAssocies: "false",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", true, "all");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "Succès", data: structure });
  });

  it("should call getStructureFromDB with correct params and return result", async () => {
    const res = mockResponse();
    await getStructureById(
      {
        query: {
          id: "id",
          withDisposAssocies: "false",
          localeOfLocalizedDispositifsAssocies: "false",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, "all");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "Succès", data: structure });
  });

  it("should call getStructureFromDB with correct params and return result", async () => {
    const res = mockResponse();
    await getStructureById(
      {
        query: {
          id: "id",
          withDisposAssocies: "false",
          localeOfLocalizedDispositifsAssocies: "false",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, "all");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "Succès", data: structure });
  });

  it("should return 400 if no id in query", async () => {
    const res = mockResponse();
    await getStructureById({ query: {} }, res);
    expect(getStructureFromDB).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 404 if no structure found", async () => {
    getStructureFromDB.mockResolvedValueOnce(null);
    const res = mockResponse();
    await getStructureById(
      {
        query: {
          id: "id",
          withDisposAssocies: "false",
          localeOfLocalizedDispositifsAssocies: "false",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, "all");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ text: "Pas de résultat" });
  });

  it("should return 500 if getStructureFromDb throws", async () => {
    getStructureFromDB.mockRejectedValueOnce(new Error("error"));
    const res = mockResponse();
    await getStructureById(
      {
        query: {
          id: "id",
          withDisposAssocies: "false",
          localeOfLocalizedDispositifsAssocies: "false",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, "all");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should return 500 if structure has no json throws", async () => {
    const res = mockResponse();
    await getStructureById(
      {
        query: {
          id: "id",
          withDisposAssocies: "true",
          localeOfLocalizedDispositifsAssocies: "en",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", true, "all");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should return 500 if turnToLocalized throws", async () => {
    getStructureFromDB.mockResolvedValueOnce({
      toJSON: () => structure1,
    });
    turnToLocalized.mockImplementationOnce(() => {
      throw new Error("error");
    });
    const res = mockResponse();
    await getStructureById(
      {
        query: {
          id: "id",
          withDisposAssocies: "true",
          localeOfLocalizedDispositifsAssocies: "en",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", true, "all");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should call turnToLocalized and turnJSONtoHTML ", async () => {
    getStructureFromDB.mockResolvedValueOnce({
      toJSON: () => structure1,
    });

    const res = mockResponse();
    await getStructureById(
      {
        query: {
          id: "id",
          withDisposAssocies: "true",
          localeOfLocalizedDispositifsAssocies: "en",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", true, "all");
    expect(turnToLocalized).toHaveBeenCalledWith(dispositif1, "en");
    expect(turnToLocalized).toHaveBeenCalledWith(dispositif2, "en");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: {
        id: "id",
        dispositifsAssocies: [simplifiedDispo1, simplifiedDispo2],
      },
    });
  });
});
