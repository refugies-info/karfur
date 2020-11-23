// @ts-nocheck
import { getStructureById, getActiveStructures } from "../structure.service";
import {
  getStructureFromDB,
  getStructuresFromDB,
} from "../structure.repository";
import { turnJSONtoHTML } from "../../dispositif/functions";

const structure = { id: "id" };

jest.mock("../structure.repository.ts", () => ({
  getStructureFromDB: jest.fn().mockResolvedValue({
    id: "id",
  }),
  getStructuresFromDB: jest
    .fn()
    .mockResolvedValue([{ id: "id1" }, { id: "id2" }]),
}));

jest.mock("../../dispositif/functions", () => ({
  turnToLocalized: jest.fn(),
  turnJSONtoHTML: jest.fn(),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getStructureById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call getStructureFromDB with correct params and return result", async () => {
    const res = mockResponse();
    await getStructureById(
      {
        query: {
          id: "id",
          withDisposAssocies: "true",
          withLocalizedDispositifs: "false",
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
          withLocalizedDispositifs: "false",
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
          withLocalizedDispositifs: "false",
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
          withLocalizedDispositifs: "false",
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
          withLocalizedDispositifs: "false",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, "all");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should return 500 if turnToLocalized throws", async () => {
    turnJSONtoHTML.mockRejectedValueOnce(new Error("error"));
    const res = mockResponse();
    await getStructureById(
      {
        query: {
          id: "id",
          withDisposAssocies: "true",
          withLocalizedDispositifs: "true",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", true, "all");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  // it("should call turnToLocalized and turnJSONtoHTML ", async () => {
  //   getStructureFromDB.mockResolvedValueOnce({
  //     toJSON: () => ({
  //       id: "id",
  //       dispositifsAssocies: [
  //         { id: "dispo1", contenu: "content1" },
  //         { id: "dispo2", contenu: "content2" },
  //       ],
  //     }),
  //   });

  //   const res = mockResponse();
  //   await getStructureById(
  //     {
  //       query: {
  //         id: "id",
  //         withDisposAssocies: "true",
  //         withLocalizedDispositifs: "true",
  //       },
  //     },
  //     res
  //   );
  //   expect(getStructureFromDB).toHaveBeenCalledWith("id", true, "all");
  //   expect(turnToLocalized).toHaveBeenCalledWith(
  //     { id: "dispo1", contenu: "content1" },
  //     "fr"
  //   );
  //   expect(turnToLocalized).toHaveBeenCalledWith(
  //     { id: "dispo2", contenu: "content2" },
  //     "fr"
  //   );
  //   expect(turnJSONtoHTML).toHaveBeenCalledWith("content1");
  //   expect(turnJSONtoHTML).toHaveBeenCalledWith("content2");

  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith({
  //     text: "Succès",
  //     data: {
  //       id: "id",
  //       dispositifsAssocies: [
  //         { id: "dispo1", contenu: "content1" },
  //         { id: "dispo2", contenu: "content2" },
  //       ],
  //     },
  //   });
  // });
});

describe("getActiveStructures", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call getStructuresFromDB and return a 200", async () => {
    const res = mockResponse();
    await getActiveStructures({}, res);
    expect(getStructuresFromDB).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [{ id: "id1" }, { id: "id2" }],
    });
  });

  it("should return a 500 if getStructuresFromDB throw ", async () => {
    getStructuresFromDB.mockRejectedValueOnce(new Error("error"));
    const res = mockResponse();
    await getActiveStructures({}, res);
    expect(getStructuresFromDB).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});
