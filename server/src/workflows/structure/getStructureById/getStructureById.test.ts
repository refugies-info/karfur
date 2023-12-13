// @ts-nocheck
/* import { getStructureById } from "./getStructureById";
import { getStructureFromDB } from "../../../modules/structure/structure.repository";
import { getUserById } from "../../../modules/users/users.repository"; */

const structure = { id: "id" };

/* jest.mock("../../../modules/structure/structure.repository", () => ({
  getStructureFromDB: jest.fn().mockResolvedValue({
    id: "id",
    membres: [{ _id: "id" }],
    toJSON: () => ({ id: "id", membres: [{ _id: "id" }] }),
  }),
}));

jest.mock("../../../controllers/dispositif/functions", () => ({
  turnToLocalized: jest.fn(),
}));

jest.mock("../../../modules/users/users.repository", () => ({
  getUserById: jest.fn(),
})); */

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
  theme: "theme1",
  secondaryThemes: [],
  titreInformatif: "titre",
  titreMarque: "titreMarque",
};

const simplifiedDispo1 = {
  _id: "dispo1",
  abstract: "abstract",
  status: "Actif",
  theme: "theme1",
  contenu: "content1",
  mainSponsor: undefined,
  secondaryThemes: [],
  titreInformatif: "titre",
  titreMarque: "titreMarque",
  nbVues: 0,
  nbMercis: 0,
};

const simplifiedDispo2 = {
  _id: "dispo2",
  abstract: "abstract",
  status: "Actif",
  theme: "theme1",
  contenu: "content2",
  mainSponsor: undefined,
  secondaryThemes: [],
  titreInformatif: "titre",
  titreMarque: "titreMarque",
  nbVues: 0,
  nbMercis: 0,
};

const dispositif2 = {
  _id: "dispo2",
  contenu: "content2",
  unusedField: "unusedField",
  abstract: "abstract",
  status: "Actif",
  theme: "theme1",
  secondaryThemes: [],
  titreInformatif: "titre",
  titreMarque: "titreMarque",
};

const structure1 = {
  id: "id",
  dispositifsAssocies: [dispositif1, dispositif2],
};

describe.skip("getStructureById", () => {
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
          withMembres: "false",
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
          withMembres: "false",
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
          withMembres: "false",
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
          withMembres: "false",
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
          withMembres: "false",
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
          withMembres: "false",
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
          withMembres: "false",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", true, "all");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should call turnToLocalized when withDisposAssocies", async () => {
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
          withMembres: "false",
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
  const neededFields = { username: 1, picture: 1, last_connected: 1 };
  const user1 = { username: "username1", _id: "id1", userId: "userId1" };
  const user2 = { username: "username2", _id: "id2", userId: "userId2" };

  it("should call turnToLocalized and getUserById when withDisposAssocies and withMembres and user is admin", async () => {
    getUserById.mockResolvedValueOnce({ toJSON: () => user1 });
    getUserById.mockResolvedValueOnce({ toJSON: () => user2 });

    getStructureFromDB.mockResolvedValueOnce({
      toJSON: () => ({
        ...structure1,
        membres: [
          { roles: ["admin"] },
          { userId: "userId1", roles: ["contributeur"] },
          { userId: "userId2", roles: ["administrateur"] },
        ],
      }),
    });

    const res = mockResponse();
    await getStructureById(
      {
        user: { roles: [{ nom: "Admin" }] },
        userId: "userId",
        query: {
          id: "id",
          withDisposAssocies: "true",
          localeOfLocalizedDispositifsAssocies: "en",
          withMembres: "true",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", true, "all");
    expect(turnToLocalized).toHaveBeenCalledWith(dispositif1, "en");
    expect(turnToLocalized).toHaveBeenCalledWith(dispositif2, "en");
    expect(getUserById).toHaveBeenCalledWith("userId1", neededFields);
    expect(getUserById).toHaveBeenCalledWith("userId2", neededFields);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: {
        id: "id",
        dispositifsAssocies: [simplifiedDispo1, simplifiedDispo2],
        membres: [
          { ...user1, roles: ["contributeur"] },
          { ...user2, roles: ["administrateur"] },
        ],
      },
    });
  });

  it("should return members when user is member of structure", async () => {
    getUserById.mockResolvedValueOnce({ toJSON: () => user1 });
    getUserById.mockResolvedValueOnce({ toJSON: () => user2 });

    getStructureFromDB.mockResolvedValueOnce({
      toJSON: () => ({
        ...structure1,
        membres: [
          { userId: "userId1", roles: ["contributeur"] },
          { userId: "userId2", roles: ["administrateur"] },
        ],
      }),
    });

    const res = mockResponse();
    await getStructureById(
      {
        user: { roles: [{ nom: "Contributeur" }] },
        userId: "userId1",
        query: {
          id: "id",
          withDisposAssocies: "true",
          localeOfLocalizedDispositifsAssocies: "en",
          withMembres: "true",
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
        membres: [
          { ...user1, roles: ["contributeur"] },
          { ...user2, roles: ["administrateur"] },
        ],
      },
    });
  });

  it("should not return membre array when user not in structure", async () => {
    getStructureFromDB.mockResolvedValueOnce({
      toJSON: () => ({
        ...structure1,
        membres: [
          { roles: ["admin"] },
          { userId: "userId2", roles: ["contributeur"] },
        ],
      }),
    });

    const res = mockResponse();
    await getStructureById(
      {
        user: { roles: [{ nom: "Contributeur" }] },
        userId: "userId1",
        query: {
          id: "id",
          withDisposAssocies: "true",
          localeOfLocalizedDispositifsAssocies: "en",
          withMembres: "true",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", true, "all");


    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: {
        id: "id",
        dispositifsAssocies: [simplifiedDispo1, simplifiedDispo2],
      },
    });
  });

  it("should not return membres array when no user ", async () => {
    getStructureFromDB.mockResolvedValueOnce({
      toJSON: () => ({
        ...structure1,
        membres: [
          { roles: ["admin"] },
          { userId: "userId1", roles: ["contributeur"] },
        ],
      }),
    });

    const res = mockResponse();
    await getStructureById(
      {
        query: {
          id: "id",
          withDisposAssocies: "false",
          localeOfLocalizedDispositifsAssocies: "en",
          withMembres: "true",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", true, "all");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: {
        id: "id",
        dispositifsAssocies: [simplifiedDispo1, simplifiedDispo2],
      },
    });
  });


  it("should return empty membre array when getUserById throws ", async () => {
    getUserById.mockRejectedValueOnce(new Error("erreur"));

    getStructureFromDB.mockResolvedValueOnce({
      toJSON: () => ({
        ...structure1,
        membres: [
          { roles: ["admin"] },
          { userId: "userId1", roles: ["contributeur"] },
        ],
      }),
    });

    const res = mockResponse();
    await getStructureById(
      {
        user: { roles: [{ nom: "Admin" }] },
        userId: "userId",
        query: {
          id: "id",
          withDisposAssocies: "false",
          localeOfLocalizedDispositifsAssocies: "en",
          withMembres: "true",
        },
      },
      res
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", true, "all");

    expect(getUserById).toHaveBeenCalledWith("userId1", neededFields);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: {
        id: "id",
        dispositifsAssocies: [simplifiedDispo1, simplifiedDispo2],
        membres: [],
      },
    });
  });
});
