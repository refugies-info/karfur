// @ts-nocheck
import { getNbDispositifsByRegion } from "./getNbDispositifsByRegion";
// import { getActiveDispositifsFromDBWithoutPopulate } from "../../../modules/dispositif/dispositif.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

/* jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getActiveDispositifsFromDBWithoutPopulate: jest.fn(),
})); */

describe.skip("getNbDispositifsByRegion", () => {
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
