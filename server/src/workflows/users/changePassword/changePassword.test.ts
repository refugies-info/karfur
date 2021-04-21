//@ts-nocheck
import { changePassword } from "./changePassword";
import {
  getUserById,
  updateUserInDB,
} from "../../../modules/users/users.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/users/users.repository", () => ({
  getUserById: jest.fn(),
  updateUserInDB: jest.fn().mockResolvedValue({ getToken: () => "token" }),
}));

jest.mock("password-hash", () => ({
  __esModule: true, // this property makes it work
  default: { generate: () => "hashedPassword" },
}));

describe("changePassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();
  it("should return 405 if not from site", async () => {
    const req = { fromSite: false };
    await changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête bloquée par API" });
  });

  it("should return 400 if invalid request", async () => {
    const req = {
      fromSite: true,
      body: { newPassword: "newPassword", currentPassword: "currentPassword" },
    };
    await changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if invalid request", async () => {
    const req = {
      fromSite: true,
      body: { userId: "userId", currentPassword: "currentPassword" },
    };
    await changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if invalid request", async () => {
    const req = {
      fromSite: true,
      body: { userId: "userId", newPassword: "newPassword" },
    };
    await changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 401 if invalid token", async () => {
    const req = {
      fromSite: true,
      body: {
        userId: "userId",
        newPassword: "newPassword",
        currentPassword: "currentPassword",
      },
      userId: "id",
    };
    await changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ text: "Token invalide" });
  });

  it("should get user and return 500 if no user", async () => {
    const req = {
      fromSite: true,
      body: {
        userId: "userId",
        newPassword: "newPassword",
        currentPassword: "currentPassword",
      },
      userId: "userId",
    };
    await changePassword(req, res);
    expect(getUserById).toHaveBeenCalledWith("userId", {});
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Utilisateur inconnu" });
  });

  it("should get user and return 401 if wrong password", async () => {
    getUserById.mockResolvedValueOnce({ authenticate: () => false });
    const req = {
      fromSite: true,
      body: {
        userId: "userId",
        newPassword: "newPassword",
        currentPassword: "currentPassword",
      },
      userId: "userId",
    };
    await changePassword(req, res);
    expect(getUserById).toHaveBeenCalledWith("userId", {});
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ text: "Mot de passe incorrect" });
  });

  it("should get user and return 401 if password too weak", async () => {
    getUserById.mockResolvedValueOnce({ authenticate: () => true });
    const req = {
      fromSite: true,
      body: {
        userId: "userId",
        newPassword: "a",
        currentPassword: "currentPassword",
      },
      userId: "userId",
    };
    await changePassword(req, res);
    expect(getUserById).toHaveBeenCalledWith("userId", {});
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      text: "Le mot de passe est trop faible",
    });
  });

  it("should get user and update user in db", async () => {
    getUserById.mockResolvedValueOnce({ authenticate: () => true });
    const req = {
      fromSite: true,
      body: {
        userId: "userId",
        newPassword: "newPassword",
        currentPassword: "currentPassword",
      },
      userId: "userId",
    };
    await changePassword(req, res);
    expect(getUserById).toHaveBeenCalledWith("userId", {});
    expect(updateUserInDB).toHaveBeenCalledWith("userId", {
      password: "hashedPassword",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: "token",
      text: "Authentification réussi",
    });
  });

  it("should get user and 500 if it throwe", async () => {
    getUserById.mockRejectedValueOnce(new Error("erreur"));
    const req = {
      fromSite: true,
      body: {
        userId: "userId",
        newPassword: "newPassword",
        currentPassword: "currentPassword",
      },
      userId: "userId",
    };
    await changePassword(req, res);
    expect(getUserById).toHaveBeenCalledWith("userId", {});
    expect(updateUserInDB).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  it("should get user and update user in db", async () => {
    getUserById.mockResolvedValueOnce({ authenticate: () => true });
    updateUserInDB.mockRejectedValueOnce(new Error("erreur"));
    const req = {
      fromSite: true,
      body: {
        userId: "userId",
        newPassword: "newPassword",
        currentPassword: "currentPassword",
      },
      userId: "userId",
    };
    await changePassword(req, res);
    expect(getUserById).toHaveBeenCalledWith("userId", {});
    expect(updateUserInDB).toHaveBeenCalledWith("userId", {
      password: "hashedPassword",
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});
