//@ts-nocheck
import { setNewPassword } from "./setNewPassword";
import { login2FA } from "../../../modules/users/login2FA";
import { proceedWithLogin } from "../../../modules/users/users.service";
import { userRespoStructureId } from "../../../modules/structure/structure.service";
import { UserModel } from "src/typegoose/User";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/users/users.repository", () => ({
  getUserById: jest.fn(),
  updateUserInDB: jest.fn().mockResolvedValue({ getToken: () => "token" })
}));
jest.mock("../../../modules/users/login2FA", () => ({
  login2FA: jest.fn()
}));
jest.mock("../../../modules/users/users.service", () => ({
  proceedWithLogin: jest.fn()
}));
jest.mock("../../../modules/structure/structure.service", () => ({
  userRespoStructureId: jest.fn()
}));
jest.mock("password-hash", () => ({
  __esModule: true, // this property makes it work
  default: {
    generate: () => "hashedPassword",
    verify: (pass1: string, pass2: string) => pass1 === pass2
  }
}));

describe("setNewPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();
  it("should return 403 if not from site", async () => {
    const req = { fromSite: false };
    await setNewPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ text: "Création d'utilisateur ou login impossible par API" });
  });
  it("should return 400 if invalid request", async () => {
    const req = {
      fromSite: true,
      body: { newPassword: "newPassword" }
    };
    await setNewPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });
  it("should return 400 if invalid request", async () => {
    const req = {
      fromSite: true,
      body: { reset_password_token: "token" }
    };
    await setNewPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });
  it("should get user and return 500 if no user", async () => {
    UserModel.findOne.mockReturnValueOnce(null);
    const req = {
      fromSite: true,
      body: {
        newPassword: "password",
        reset_password_token: "token"
      }
    };
    await setNewPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Utilisateur inconnu" });
  });
  it("should return 403 if no email", async () => {
    UserModel.findOne.mockReturnValueOnce({
      email: ""
    });
    const req = {
      fromSite: true,
      body: {
        newPassword: "password",
        reset_password_token: "token"
      }
    };
    await setNewPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      text: "Aucune adresse mail n'est associée à ce compte. Il n'est pas possible de récupérer le mot de passe ainsi."
    });
  });
  it("should get user and return 400 if password is the same as before", async () => {
    UserModel.findOne.mockReturnValueOnce({
      email: "dev@refugies.info",
      roles: [],
      password: "userPassword"
    });
    const req = {
      fromSite: true,
      body: {
        newPassword: "userPassword",
        reset_password_token: "token"
      },
      roles: []
    };
    await setNewPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: "USED_PASSWORD",
      text: "Le mot de passe ne peut pas être identique à l'ancien mot de passe."
    });
  });
  it("should return 401 if admin", async () => {
    UserModel.findOne.mockReturnValueOnce({
      email: "dev@refugies.info",
      roles: ["Admin"]
    });
    const req = {
      fromSite: true,
      body: {
        newPassword: "password",
        reset_password_token: "token"
      },
      roles: [{ nom: "Admin", _id: "Admin" }]
    };
    await setNewPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      text: "Cet utilisateur n'est pas autorisé à modifier son mot de passe ainsi, merci de contacter l'administrateur du site"
    });
  });
  it("should get user and return 401 if password too weak", async () => {
    UserModel.findOne.mockReturnValueOnce({
      email: "dev@refugies.info",
      roles: []
    });
    const req = {
      fromSite: true,
      body: {
        newPassword: "a",
        reset_password_token: "token"
      },
      roles: [{ nom: "Admin", _id: "Admin" }]
    };
    await setNewPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      text: "Le mot de passe est trop faible"
    });
  });
  it("should call login2FA is user has structure", async () => {
    UserModel.findOne.mockReturnValueOnce({
      email: "dev@refugies.info",
      roles: [],
      save: jest.fn(),
      getToken: jest.fn()
    });
    userRespoStructureId.mockResolvedValueOnce("structureId");
    const req = {
      fromSite: true,
      body: {
        newPassword: "password1&",
        reset_password_token: "token"
      },
      roles: [{ nom: "Admin", _id: "Admin" }]
    };
    await setNewPassword(req, res);
    expect(login2FA).toHaveBeenCalled();
    expect(proceedWithLogin).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("should not call login2FA is user has no structure", async () => {
    UserModel.findOne.mockReturnValueOnce({
      email: "dev@refugies.info",
      roles: [],
      save: jest.fn(),
      getToken: jest.fn()
    });
    userRespoStructureId.mockResolvedValueOnce(null);
    const req = {
      fromSite: true,
      body: {
        newPassword: "password1&",
        reset_password_token: "token"
      },
      roles: [{ nom: "Admin", _id: "Admin" }]
    };
    await setNewPassword(req, res);
    expect(login2FA).not.toHaveBeenCalled();
    expect(proceedWithLogin).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("should return token if logged in", async () => {
    UserModel.findOne.mockReturnValueOnce({
      email: "dev@refugies.info",
      roles: [],
      save: jest.fn(),
      getToken: jest.fn().mockReturnValue("token")
    });
    userRespoStructureId.mockResolvedValueOnce(null);
    const req = {
      fromSite: true,
      body: {
        newPassword: "password1&",
        reset_password_token: "token"
      },
      roles: [{ nom: "Admin", _id: "Admin" }]
    };
    await setNewPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: "token",
      text: "Authentification réussie"
    });
  });
});
