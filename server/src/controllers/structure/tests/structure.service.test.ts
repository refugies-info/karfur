// @ts-nocheck
import {
  getStructureById,
  getActiveStructures,
  getAllStructures,
} from "../structure.service";
import {
  getStructureFromDB,
  getStructuresFromDB,
} from "../structure.repository";
import { turnToLocalized } from "../../dispositif/functions";
import { getUserById } from "../../account/users.repository";

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
}));

jest.mock("../../account/users.repository", () => ({
  getUserById: jest.fn().mockResolvedValue({
    _id: "id1",
    username: "respo",
    picture: { secure_url: "test" },
  }),
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
const dispositif3 = {
  _id: "dispo2",
  contenu: "content2",
  unusedField: "unusedField",
  abstract: "abstract",
  status: "Supprimé",
  tags: [],
  titreInformatif: "titre",
  titreMarque: "titreMarque",
};

const dispositif4 = {
  _id: "dispo2",
  contenu: "content2",
  unusedField: "unusedField",
  abstract: "abstract",
  status: "Brouillon",
  tags: [],
  titreInformatif: "titre",
  titreMarque: "titreMarque",
};

const structure1 = {
  id: "id",
  dispositifsAssocies: [dispositif1, dispositif2],
};

const structure2 = {
  id: "id",
  dispositifsAssocies: [dispositif1, dispositif2, dispositif3, dispositif4],
  membres: [
    { userId: "id1", roles: ["administrateur"] },
    { userId: "id2", roles: ["redacteur"] },
  ],
  nom: "nom",
  status: "En attente",
  picture: { secure_url: "secure_url" },
  contact: "contact",
  phone_contact: "phone_contact",
  mail_contact: "mail_contact",
  created_at: 1500,
};

const structure3 = {
  id: "id",
  dispositifsAssocies: [dispositif1, dispositif2, dispositif3, dispositif4],
  membres: [
    { userId: "id1", roles: ["traducteur"] },
    { userId: "id2", roles: ["redacteur"] },
  ],
  nom: "nom",
  status: "En attente",
  picture: { secure_url: "secure_url" },
  contact: "contact",
  phone_contact: "phone_contact",
  mail_contact: "mail_contact",
  created_at: 1500,
};

const structure4 = {
  id: "id",
  dispositifsAssocies: [dispositif1, dispositif2, dispositif3, dispositif4],
  membres: [
    { roles: ["administrateur"] },
    { userId: "id2", roles: ["redacteur"] },
  ],
  nom: "nom",
  status: "En attente",
  picture: { secure_url: "secure_url" },
  contact: "contact",
  phone_contact: "phone_contact",
  mail_contact: "mail_contact",
  created_at: 1500,
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

describe("getActiveStructures", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call getStructuresFromDB and return a 200", async () => {
    const res = mockResponse();
    await getActiveStructures({}, res);
    expect(getStructuresFromDB).toHaveBeenCalledWith(
      { status: "Actif" },
      { nom: 1, acronyme: 1, picture: 1 },
      false
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [{ id: "id1" }, { id: "id2" }],
    });
  });

  it("should return a 500 if getStructuresFromDB throw ", async () => {
    getStructuresFromDB.mockRejectedValueOnce(new Error("error"));
    const res = mockResponse();
    await getActiveStructures({}, res);
    expect(getStructuresFromDB).toHaveBeenCalledWith(
      { status: "Actif" },
      { nom: 1, acronyme: 1, picture: 1 },
      false
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});

describe("getAllStructures", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const neededFields = {
    nom: 1,
    status: 1,
    picture: 1,
    dispositifsAssocies: 1,
    contact: 1,
    phone_contact: 1,
    mail_contact: 1,
    membres: 1,
    created_at: 1,
  };
  it("should call getStructuresFromDB and getUserById and return a 200 (structure with respo)", async () => {
    getStructuresFromDB.mockResolvedValueOnce([
      {
        toJSON: () => structure2,
      },
    ]);
    const res = mockResponse();
    await getAllStructures({}, res);

    expect(getStructuresFromDB).toHaveBeenCalledWith({}, neededFields, true);

    expect(getUserById).toHaveBeenCalledWith("id1");

    expect(res.status).toHaveBeenCalledWith(200);
    const result = [
      {
        id: "id",
        // dispositifsAssocies: [simplifiedDispo1, simplifiedDispo2],
        nbMembres: 2,
        nom: "nom",
        status: "En attente",
        picture: { secure_url: "secure_url" },
        contact: "contact",
        phone_contact: "phone_contact",
        mail_contact: "mail_contact",
        created_at: 1500,
        responsable: {
          _id: "id1",
          username: "respo",
          picture: { secure_url: "test" },
        },
        nbFiches: 2,
        membres: [
          { userId: "id1", roles: ["administrateur"] },
          { userId: "id2", roles: ["redacteur"] },
        ],
      },
    ];
    expect(res.json).toHaveBeenCalledWith({
      data: result,
    });
  });

  it("should call getStructuresFromDB and getUserById and return a 200 (structure without respo)", async () => {
    getStructuresFromDB.mockResolvedValueOnce([
      {
        toJSON: () => structure3,
      },
    ]);
    const res = mockResponse();
    await getAllStructures({}, res);

    expect(getUserById).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    const result = [
      {
        id: "id",
        nbMembres: 2,
        nom: "nom",
        status: "En attente",
        picture: { secure_url: "secure_url" },
        contact: "contact",
        phone_contact: "phone_contact",
        mail_contact: "mail_contact",
        created_at: 1500,
        responsable: null,
        nbFiches: 2,
        membres: [
          { userId: "id1", roles: ["traducteur"] },
          { userId: "id2", roles: ["redacteur"] },
        ],
      },
    ];
    expect(res.json).toHaveBeenCalledWith({
      data: result,
    });
  });

  it("should call getStructuresFromDB and getUserById and return a 200 (admin without userId)", async () => {
    getStructuresFromDB.mockResolvedValueOnce([
      {
        toJSON: () => structure4,
      },
    ]);
    const res = mockResponse();
    await getAllStructures({}, res);

    expect(getUserById).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    const result = [
      {
        id: "id",
        nbMembres: 2,
        nom: "nom",
        status: "En attente",
        picture: { secure_url: "secure_url" },
        contact: "contact",
        phone_contact: "phone_contact",
        mail_contact: "mail_contact",
        created_at: 1500,
        responsable: null,
        nbFiches: 2,
        membres: [
          { roles: ["administrateur"] },
          { userId: "id2", roles: ["redacteur"] },
        ],
      },
    ];
    expect(res.json).toHaveBeenCalledWith({
      data: result,
    });
  });

  it("should return a 500 if getStructuresFromDB throw ", async () => {
    getStructuresFromDB.mockRejectedValueOnce(new Error("error"));
    const res = mockResponse();
    await getAllStructures({}, res);
    expect(getStructuresFromDB).toHaveBeenCalledWith({}, neededFields, true);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});
