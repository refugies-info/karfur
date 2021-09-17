// @ts-nocheck
import { getStructuresFromDB } from "src/modules/structure/structure.repository";
import { getUserById } from "../../../modules/users/users.repository";
import { getAllStructures } from "./getAllStructures";

jest.mock("src/modules/structure/structure.repository", () => ({
  getStructuresFromDB: jest
    .fn()
    .mockResolvedValue([{ id: "id1" }, { id: "id2" }]),
}));

jest.mock("../../../modules/users/users.repository", () => ({
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
  const neededFieldsUser = { picture: 1, username: 1 };
  it("should call getStructuresFromDB and getUserById and return a 200 (structure with respo)", async () => {
    getStructuresFromDB.mockResolvedValueOnce([
      {
        toJSON: () => structure2,
      },
    ]);
    const res = mockResponse();
    await getAllStructures({}, res);

    expect(getStructuresFromDB).toHaveBeenCalledWith({}, neededFields, true);

    expect(getUserById).toHaveBeenCalledWith("id1", neededFieldsUser);

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
        dispositifsIds: ["dispo1", "dispo2", "dispo2"],
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
        dispositifsIds: ["dispo1", "dispo2", "dispo2"],
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
        dispositifsIds: ["dispo1", "dispo2", "dispo2"],
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
