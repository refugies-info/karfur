// @ts-nocheck
import { getAllUsers } from "./getAllUsers";
import { getAllUsersFromDB } from "../users.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../users.repository", () => ({
  getAllUsersFromDB: jest.fn(),
}));

const neededFields = {
  username: 1,
  picture: 1,
  status: 1,
  created_at: 1,
  roles: 1,
  structures: 1,
  email: 1,
  selectedLanguages: 1,
};

const user1 = {
  username: "username1",
  _id: "id1",
  picture: { secure_url: "secure_url1" },
  status: "Actif",
  created_at: "created_at",
  roles: [
    { nom: "Admin" },
    { nom: "ExpertTrad" },
    { nom: "Trad" },
    { nom: "User" },
    { nom: "Contrib" },
    { nom: "hasStructure" },
  ],
  structures: [
    {
      _id: "id_structure",
      nom: "struct1",
      picture: { secure_url: "sec_struct1" },
      membres: [{ userId: "id1", roles: ["administrateur"] }],
    },
    {
      _id: "id_structure",
      nom: "struct2",
      picture: { secure_url: "sec_struct2" },
      membres: [{ userId: "id1", roles: ["contributeur"] }],
    },
  ],
  email: "email1",
  selectedLanguages: [
    { langueCode: "fr" },
    { langueCode: "en" },
    { langueCode: "gb" },
    { langueCode: "sa" },
  ],
};

const user3 = {
  ...user1,
  structures: [
    {
      _id: "id_structure",
      nom: "struct1",
      picture: { secure_url: "sec_struct1" },
      membres: [{ userId: "id1", roles: ["contributeur"] }],
    },
  ],
};

const simplifiedUser1 = {
  username: "username1",
  _id: "id1",
  picture: { secure_url: "secure_url1" },
  status: "Actif",
  created_at: "created_at",
  roles: ["Admin", "ExpertTrad", "Responsable"],
  structure: {
    nom: "struct1",
    picture: { secure_url: "sec_struct1" },
    _id: "id_structure",
  },
  email: "email1",
  langues: ["gb", "sa"],
  nbStructures: 2,
};

const simplifiedUser3 = {
  ...simplifiedUser1,
  roles: ["Admin", "ExpertTrad", "Rédacteur"],
  nbStructures: 1,
};

const user2 = {
  username: "username2",
  _id: "id2",
  picture: { secure_url: "secure_url2" },
  status: "Actif",
  created_at: "created_at",
  email: "email2",
};

const simplifiedUser2 = {
  username: "username2",
  _id: "id2",
  picture: { secure_url: "secure_url2" },
  status: "Actif",
  created_at: "created_at",
  email: "email2",
  langues: [],
  nbStructures: 0,
  roles: [],
  structure: null,
};

const users = [user1, user2, user3];
describe("getAllUsers", () => {
  it("should call getAllUsersFromDB and return 200", async () => {
    getAllUsersFromDB.mockResolvedValueOnce(users);
    const res = mockResponse();
    await getAllUsers({}, res);
    expect(getAllUsersFromDB).toHaveBeenCalledWith(neededFields);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [simplifiedUser1, simplifiedUser2, simplifiedUser3],
    });
  });

  it("should call getAllUsersFromDB and return 500 if it throws", async () => {
    getAllUsersFromDB.mockRejectedValueOnce(new Error("erreur"));
    const res = mockResponse();
    await getAllUsers({}, res);
    expect(getAllUsersFromDB).toHaveBeenCalledWith(neededFields);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});
