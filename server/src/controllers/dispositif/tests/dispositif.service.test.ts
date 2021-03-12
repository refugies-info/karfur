// @ts-nocheck
import {
  updateDispositifAdminComments,
  getNbDispositifsByRegion,
} from "../dispositif.service";
import {
  updateDispositifInDB,
  getActiveDispositifsFromDBWithoutPopulate,
} from "../dispositif.repository";
import {
  fakeContenuWithoutZoneDAction,
  fakeContenuWithZoneDAction,
  fakeContenuWithEmptyZoneDAction,
} from "../../../__fixtures__/dispositifs";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../dispositif.repository", () => ({
  updateDispositifInDB: jest.fn(),
  getActiveDispositifsFromDBWithoutPopulate: jest.fn(),
}));

const dispositifs = [
  {
    _id: "id1",
    contenu: fakeContenuWithZoneDAction,
  },
  {
    _id: "id2",
    contenu: fakeContenuWithoutZoneDAction,
  },
];

const dispositifsFigures = dispositifs.concat([
  { _id: "id3", contenu: fakeContenuWithEmptyZoneDAction },
]);

describe("updateDispositifAdminComments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 405 if not fromSite", async () => {
    const req = { body: {} };
    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête bloquée par API" });
  });

  it("should return 400 if no body", async () => {
    const req = { fromSite: true };
    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no query", async () => {
    const req = { fromSite: true, body: { test: "test" } };
    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no dispositifId", async () => {
    const req = { fromSite: true, body: { query: { test: "test" } } };
    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should call updateDispositifInDB", async () => {
    const req = {
      fromSite: true,
      body: {
        query: {
          dispositifId: "id",
          adminComments: "adminComments",
          adminProgressionStatus: "adminProgressionStatus",
          adminPercentageProgressionStatus: "adminPercentageProgressionStatus",
        },
      },
    };

    const date = 148707670800;
    Date.now = jest.fn(() => date);

    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      adminComments: "adminComments",
      adminProgressionStatus: "adminProgressionStatus",
      adminPercentageProgressionStatus: "adminPercentageProgressionStatus",
      lastAdminUpdate: date,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });
});

describe("updateDispositifAdminComments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call getActiveDispositifsFromDBWithoutPopulate and return correct result", async () => {
    getActiveDispositifsFromDBWithoutPopulate.mockResolvedValue(
      dispositifsFigures
    );
    const res = mockResponse();
    await getNbDispositifsByRegion({}, res);
    expect(getActiveDispositifsFromDBWithoutPopulate).toHaveBeenCalledWith({
      contenu: 1,
    });
    const result = [
      {
        region: "Auvergne-Rhône-Alpes",
        nbDispositifs: 0,
        nbDepartments: 12,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Hauts-de-France",
        nbDispositifs: 0,
        nbDepartments: 5,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Provence-Alpes-Côte d'Azur",
        nbDispositifs: 0,
        nbDepartments: 6,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Grand Est",
        nbDispositifs: 1,
        nbDepartments: 10,
        nbDepartmentsWithDispo: 1,
      },
      {
        region: "Occitanie",
        nbDispositifs: 0,
        nbDepartments: 13,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Normandie",
        nbDispositifs: 0,
        nbDepartments: 5,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Nouvelle-Aquitaine",
        nbDispositifs: 0,
        nbDepartments: 12,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Centre-Val de Loire",
        nbDispositifs: 0,
        nbDepartments: 6,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Bourgogne-Franche-Comté",
        nbDispositifs: 0,
        nbDepartments: 8,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Bretagne",
        nbDispositifs: 0,
        nbDepartments: 4,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Corse",
        nbDispositifs: 0,
        nbDepartments: 2,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Pays de la Loire",
        nbDispositifs: 0,
        nbDepartments: 5,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Île-de-France",
        nbDispositifs: 0,
        nbDepartments: 8,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "No geoloc",
        nbDispositifs: 2,
        nbDepartments: 0,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "France",
        nbDispositifs: 1,
        nbDepartments: 0,
        nbDepartmentsWithDispo: 0,
      },
    ];
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        regionFigures: result,
        dispositifsWithoutGeoloc: ["id2", "id3"],
      },
    });
  });

  it("should return a 500 if getActiveDispositifsFromDBWithoutPopulate throws ", async () => {
    getActiveDispositifsFromDBWithoutPopulate.mockRejectedValue(
      new Error("error")
    );

    const res = mockResponse();
    await getNbDispositifsByRegion({}, res);
    expect(getActiveDispositifsFromDBWithoutPopulate).toHaveBeenCalledWith({
      contenu: 1,
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });
});
