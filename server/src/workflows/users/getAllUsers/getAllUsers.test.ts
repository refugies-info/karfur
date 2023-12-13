// @ts-nocheck
import { getAllUsers } from "./getAllUsers";
import { getAllUsersFromDB } from "../../../modules/users/users.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/users/users.repository", () => ({
  getAllUsersFromDB: jest.fn()
}));

const neededFields = {
  username: 1,
  picture: 1,
  status: 1,
  created_at: 1,
  roles: 1,
  structures: 1,
  email: 1,
  phone: 1,
  selectedLanguages: 1,
  adminComments: 1
};

const user1 = {
  username: "username1",
  _id: "id1",
  picture: { secure_url: "secure_url1" },
  status: "Actif",
  created_at: "created_at",
  roles: [{ nom: "Admin" }, { nom: "ExpertTrad" }, { nom: "Trad" }, { nom: "User" }, { nom: "Contrib" }],
  structures: [
    {
      _id: "id_structure",
      nom: "struct1",
      picture: { secure_url: "sec_struct1" },
      membres: [{ userId: "id1", roles: ["administrateur"] }]
    },
    {
      _id: "id_structure",
      nom: "struct2",
      picture: { secure_url: "sec_struct2" },
      membres: [{ userId: "id1", roles: ["contributeur"] }]
    }
  ],
  email: "email1",
  phone: "",
  selectedLanguages: [
    { langueCode: "fr", langueFr: "Français" },
    { langueCode: "gb", langueFr: "Anglais" },
    { langueCode: "sa", langueFr: "Pachto" }
  ],
  last_connected: ""
};

const user2 = {
  username: "username2",
  _id: "id2",
  picture: { secure_url: "secure_url2" },
  roles: [{ nom: "User" }],
  status: "Actif",
  created_at: "created_at",
  email: "email2",
  phone: "",
  last_connected: ""
};

const user3 = {
  ...user1,
  _id: "id3",
  roles: [{ nom: "ExpertTrad" }],
  structures: []
};

const user4 = {
  ...user1,
  _id: "id4",
  structures: [
    {
      _id: "id_structure",
      nom: "struct1",
      picture: { secure_url: "sec_struct1" },
      membres: [{ userId: "id1", roles: ["membre"] }]
    }
  ]
};
const user5 = {
  ...user1,
  _id: "id5",
  roles: [{ nom: "ExpertTrad" }],
  structures: [
    {
      _id: "id_structure",
      nom: "struct1",
      picture: { secure_url: "sec_struct1" },
      membres: [{ userId: "id5", roles: ["administrateur"] }]
    }
  ]
};

const simplifiedUserAdmin1 = {
  username: "username1",
  _id: "id1",
  picture: { secure_url: "secure_url1" },
  status: "Actif",
  created_at: "created_at",
  roles: ["Admin", "ExpertTrad", "Responsable"],
  structures: [
    {
      nom: "struct1",
      picture: { secure_url: "sec_struct1" },
      _id: "id_structure",
      role: ["Responsable"]
    },
    {
      _id: "id_structure",
      nom: "struct2",
      picture: { secure_url: "sec_struct2" },
      role: ["Rédacteur"]
    }
  ],
  email: "email1",
  phone: "",
  langues: [
    { langueCode: "gb", langueFr: "Anglais" },
    { langueCode: "sa", langueFr: "Pachto" }
  ],
  nbStructures: 2,
  nbContributions: 0,
  last_connected: "",
  adminComments: undefined
};

const simplifiedUserAdmin2 = {
  username: "username2",
  _id: "id2",
  picture: { secure_url: "secure_url2" },
  status: "Actif",
  created_at: "created_at",
  email: "email2",
  phone: "",
  langues: [],
  nbStructures: 0,
  roles: [],
  structures: [],
  nbContributions: 0,
  last_connected: ""
};

const simplifiedUserAdmin3 = {
  ...simplifiedUserAdmin1,
  _id: "id3",
  roles: ["ExpertTrad"],
  nbStructures: 0,
  structures: [],
  nbContributions: 0
};

const simplifiedUserAdmin4 = {
  ...simplifiedUserAdmin1,
  _id: "id4",
  roles: ["Admin", "ExpertTrad"],
  nbStructures: 1,
  structures: [
    {
      _id: "id_structure",
      nom: "struct1",
      picture: { secure_url: "sec_struct1" },
      role: []
    }
  ]
};

const simplifiedUserAdmin5 = {
  ...simplifiedUserAdmin1,
  _id: "id5",
  roles: ["ExpertTrad", "Responsable"],
  nbStructures: 1,
  structures: [
    {
      _id: "id_structure",
      nom: "struct1",
      picture: { secure_url: "sec_struct1" },
      role: ["Responsable"]
    }
  ]
};

const simplifiedUser1 = {
  username: "username1",
  _id: "id1",
  picture: { secure_url: "secure_url1" },
  status: "Actif",
  email: "email1"
};

const simplifiedUser2 = {
  username: "username2",
  _id: "id2",
  picture: { secure_url: "secure_url2" },
  status: "Actif",
  email: "email2"
};

const simplifiedUser3 = {
  ...simplifiedUser1,
  _id: "id3"
};

const simplifiedUser4 = {
  ...simplifiedUser1,
  _id: "id4"
};

const simplifiedUser5 = {
  ...simplifiedUser1,
  _id: "id5"
};

const users = [user1, user2, user3, user4, user5];
describe.skip("getAllUsers", () => {
  beforeEach(() => jest.clearAllMocks());
  it("should call getAllUsersFromDB and return 200 with user admin", async () => {
    getAllUsersFromDB.mockResolvedValueOnce(users);
    const res = mockResponse();
    const req = { user: { _id: "id1", roles: [] } };
    await getAllUsers(req, res);
    expect(getAllUsersFromDB).toHaveBeenCalledWith(neededFields);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [
        simplifiedUserAdmin1,
        simplifiedUserAdmin2,
        simplifiedUserAdmin3,
        simplifiedUserAdmin4,
        simplifiedUserAdmin5
      ]
    });
  });
  it("should call getAllUsersFromDB and return 200 when user has structure", async () => {
    getAllUsersFromDB.mockResolvedValueOnce(users);
    const res = mockResponse();
    const req = { user: { _id: "id5", roles: [], structures: ["dummy"] } };
    await getAllUsers(req, res);
    expect(getAllUsersFromDB).toHaveBeenCalledWith(neededFields);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [simplifiedUser1, simplifiedUser2, simplifiedUser3, simplifiedUser4, simplifiedUser5]
    });
  });
  it("should return 403 unauthorized when no role in structure", async () => {
    getAllUsersFromDB.mockResolvedValueOnce(users);
    const res = mockResponse();
    const req = { user: { _id: "id3", roles: [] } };
    await getAllUsers(req, res);
    expect(getAllUsersFromDB).toHaveBeenCalledWith(neededFields);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      text: "Accès interdit"
    });
  });
  it("should return 403 unauthorized when no role", async () => {
    getAllUsersFromDB.mockResolvedValueOnce(users);
    const res = mockResponse();
    const req = { user: { _id: "id2", roles: [] } };
    await getAllUsers(req, res);
    expect(getAllUsersFromDB).toHaveBeenCalledWith(neededFields);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      text: "Accès interdit"
    });
  });

  it("should call getAllUsersFromDB and return 500 if it throws", async () => {
    getAllUsersFromDB.mockRejectedValueOnce(new Error("erreur"));
    const res = mockResponse();
    await getAllUsers({}, res);
    expect(getAllUsersFromDB).toHaveBeenCalledWith(neededFields);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne"
    });
  });
});
