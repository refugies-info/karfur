// @ts-nocheck
// import { updateUser } from "./updateUser";
// import { getRoleByName } from "~/controllers/role/role.repository";
/* import {
  getUserById,
  updateUserInDB,
} from "~/modules/users/users.repository";
import { sendResetPhoneNumberMail } from "~/modules/mail/mail.service";
import { requestSMSLogin, verifyCode } from "~/modules/users/login2FA"; */
import { RoleName } from "@refugies-info/api-types";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
jest.mock("twilio");
/* jest.mock("../../../controllers/role/role.repository", () => ({
  getRoleByName: jest.fn(),
}));
jest.mock("./log", () => ({
  log: jest.fn().mockResolvedValue(undefined)
}));
jest.mock("../../../modules/users/users.repository", () => ({
  getUserById: jest.fn(),
  updateUserInDB: jest.fn(),
}));

jest.mock("../../../modules/mail/mail.service", () => ({
  sendResetPhoneNumberMail: jest.fn(),
}));
jest.mock("../../../modules/users/login2FA", () => ({
  requestSMSLogin: jest.fn(),
  verifyCode: jest.fn(),
})); */

describe.skip("updateUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();
  it("should return a 405 if not from site", async () => {
    const req = { notFromSite: true };
    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête bloquée par API" });
  });

  it("should return a 400 if no user", async () => {
    const req = { fromSite: true, body: { query: {} } };
    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return a 400 if no user id", async () => {
    const req = { fromSite: true, body: { query: { user: {} } } };
    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return a 401 if user not admin", async () => {
    const req = {
      fromSite: true,

      body: { query: { user: { _id: "id" }, action: "modify-with-roles" } },
      user: { roles: [{ nom: RoleName.EXPERT_TRAD }] },
    };
    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ text: "Token invalide" });
  });

  const reqRolesEmpty = {
    fromSite: true,
    body: {
      query: {
        user: { _id: "id", email: "email", phone: "0607080910", roles: [] },
        action: "modify-with-roles",
      },
    },
    user: { roles: [{ nom: RoleName.ADMIN }], _id: "userId" },
  };
  it("should return 200 when modify, case new roles empty, actual role other", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "expertRoleId" });
    getRoleByName.mockResolvedValueOnce({ _id: "adminRoleId" });
    getUserById.mockResolvedValueOnce({
      username: "user",
      phone: "0607080910",
      roles: ["autreRoleId"],
    });
    await updateUser(reqRolesEmpty, res);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.EXPERT_TRAD);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.ADMIN);
    expect(getUserById).toHaveBeenCalledWith("id", { username: 1, phone: 1, roles: 1, email: 1 });
    expect(updateUserInDB).toHaveBeenCalledWith("id", {
      email: "email",
      phone: "0607080910",
      roles: ["autreRoleId"],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return 200 when modify, case new roles empty, actual role Expert admin autre null", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "expertRoleId" });
    getRoleByName.mockResolvedValueOnce({ _id: "adminRoleId" });
    getUserById.mockResolvedValueOnce({
      username: "user",
      phone: "0607080910",
      roles: ["autreRoleId", "expertRoleId", "adminRoleId", null],
    });

    await updateUser(reqRolesEmpty, res);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.EXPERT_TRAD);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.ADMIN);
    expect(getUserById).toHaveBeenCalledWith("id", { username: 1, phone: 1, roles: 1, email: 1 });
    expect(updateUserInDB).toHaveBeenCalledWith("id", {
      email: "email",
      phone: "0607080910",
      roles: ["autreRoleId"],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  const reqRolesAdmin = {
    fromSite: true,
    body: {
      query: {
        user: { _id: "id", email: "email", phone: "0607080910", roles: ["Admin"] },
        action: "modify-with-roles",
      },
    },
    user: { roles: [{ nom: RoleName.ADMIN }] },
  };

  it("should return 200 if user himself and type modify-my-details with selectedLanguages and user not trad", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "tradId" });
    getUserById.mockResolvedValueOnce({ roles: ["adminId"] });
    await updateUser(
      {
        fromSite: true,
        body: {
          query: {
            user: {
              _id: "userId",
              selectedLanguages: [{ _id: "langueId", i18nCode: "en" }],
            },
            action: "modify-my-details",
          },
        },
        user: { roles: [{ nom: RoleName.ADMIN }], _id: "userId" },
        userId: "userId",
      },
      res,
    );

    expect(getRoleByName).toHaveBeenCalledWith(RoleName.TRAD);
    expect(getUserById).toHaveBeenCalledWith("userId", { phone: 1, roles: 1, username: 1, email: 1 });
    expect(updateUserInDB).toHaveBeenCalledWith("userId", {
      _id: "userId",
      selectedLanguages: [{ _id: "langueId", i18nCode: "en" }],
      roles: ["adminId", "tradId"],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return 200 if user himself and type modify-my-details with selectedLanguages and user trad", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "tradId" });
    getUserById.mockResolvedValueOnce({ roles: ["tradId"] });
    await updateUser(
      {
        fromSite: true,
        body: {
          query: {
            user: {
              _id: "userId",
              selectedLanguages: [{ _id: "langueId", i18nCode: "en" }],
            },
            action: "modify-my-details",
          },
        },
        user: { roles: [{ nom: RoleName.ADMIN }], _id: "userId" },
        userId: "userId",
      },
      res,
    );

    expect(getRoleByName).toHaveBeenCalledWith(RoleName.TRAD);
    expect(getUserById).toHaveBeenCalledWith("userId", { phone: 1, roles: 1, username: 1, email: 1 });
    expect(updateUserInDB).toHaveBeenCalledWith("userId", {
      _id: "userId",
      selectedLanguages: [{ _id: "langueId", i18nCode: "en" }],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return 501 if user himself and send SMS for phone verification", async () => {
    requestSMSLogin.mockImplementationOnce(() => {
      throw new Error("NO_CODE_SUPPLIED");
    });
    await updateUser(
      {
        fromSite: true,
        body: {
          query: {
            user: {
              _id: "userId",
              phone: "0600000000",
            },
            action: "modify-my-details",
          },
        },
        user: { roles: [{ nom: RoleName.ADMIN }], _id: "userId" },
        userId: "userId",
      },
      res,
    );

    expect(requestSMSLogin).toHaveBeenCalledWith("0600000000");
    expect(updateUserInDB).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(501);
  });
  it("should return 200 if user himself and check code for phone verification", async () => {
    verifyCode.mockResolvedValueOnce(true);
    getUserById.mockResolvedValueOnce({});
    await updateUser(
      {
        fromSite: true,
        body: {
          query: {
            user: {
              _id: "userId",
              phone: "0600000000",
              code: "123456",
            },
            action: "modify-my-details",
          },
        },
        user: { roles: [{ nom: RoleName.ADMIN }], _id: "userId" },
        userId: "userId",
      },
      res,
    );

    expect(verifyCode).toHaveBeenCalledWith("0600000000", "123456");
    expect(updateUserInDB).toHaveBeenCalledWith("userId", {
      _id: "userId",
      phone: "0600000000",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("should return 402 if user himself and check code fails for phone verification", async () => {
    verifyCode.mockImplementationOnce(() => {
      throw new Error("WRONG_CODE");
    });
    await updateUser(
      {
        fromSite: true,
        body: {
          query: {
            user: {
              _id: "userId",
              phone: "0600000000",
              code: "123456",
            },
            action: "modify-my-details",
          },
        },
        user: { roles: [{ nom: RoleName.ADMIN }], _id: "userId" },
        userId: "userId",
      },
      res,
    );

    expect(verifyCode).toHaveBeenCalledWith("0600000000", "123456");
    expect(updateUserInDB).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(402);
  });

  it("should return 200 when modify, case new roles admin, actual role Expert admin autre null", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "expertRoleId" });
    getRoleByName.mockResolvedValueOnce({ _id: "adminRoleId" });
    getUserById.mockResolvedValueOnce({
      username: "user",
      phone: "0607080910",
      roles: ["autreRoleId", "expertRoleId", "adminRoleId", null],
    });

    await updateUser(reqRolesAdmin, res);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.EXPERT_TRAD);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.ADMIN);
    expect(getUserById).toHaveBeenCalledWith("id", { username: 1, phone: 1, roles: 1, email: 1 });
    expect(updateUserInDB).toHaveBeenCalledWith("id", {
      email: "email",
      phone: "0607080910",
      roles: ["autreRoleId", "adminRoleId"],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return 200 when modify, and send mail if phone changed", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "expertRoleId" });
    getRoleByName.mockResolvedValueOnce({ _id: "adminRoleId" });
    getUserById.mockResolvedValueOnce({
      username: "user",
      phone: "phone0",
      roles: ["expertRoleId", "adminRoleId"],
    });

    await updateUser(reqRolesAdmin, res);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.EXPERT_TRAD);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.ADMIN);
    expect(getUserById).toHaveBeenCalledWith("id", { username: 1, phone: 1, roles: 1, email: 1 });
    expect(updateUserInDB).toHaveBeenCalledWith("id", {
      email: "email",
      phone: "0607080910",
      roles: ["adminRoleId"],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
    expect(sendResetPhoneNumberMail).toHaveBeenCalledWith("user", "email");
  });
  it("should return 200 when modify, and not send mail if phone not changed", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "expertRoleId" });
    getRoleByName.mockResolvedValueOnce({ _id: "adminRoleId" });
    getUserById.mockResolvedValueOnce({
      username: "user",
      phone: "0607080910",
      roles: ["adminRoleId"],
    });

    await updateUser(reqRolesAdmin, res);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.EXPERT_TRAD);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.ADMIN);
    expect(getUserById).toHaveBeenCalledWith("id", { username: 1, phone: 1, roles: 1, email: 1 });
    expect(updateUserInDB).toHaveBeenCalledWith("id", {
      email: "email",
      phone: "0607080910",
      roles: ["adminRoleId"],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
    expect(sendResetPhoneNumberMail).not.toHaveBeenCalled();
  });

  it("should return 200 when modify, case new roles admin, actual role  autre null", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "expertRoleId" });
    getRoleByName.mockResolvedValueOnce({ _id: "adminRoleId" });
    getUserById.mockResolvedValueOnce({
      username: "user",
      phone: "0607080910",
      roles: ["autreRoleId", null],
    });

    await updateUser(reqRolesAdmin, res);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.EXPERT_TRAD);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.ADMIN);
    expect(getUserById).toHaveBeenCalledWith("id", { username: 1, phone: 1, roles: 1, email: 1 });
    expect(updateUserInDB).toHaveBeenCalledWith("id", {
      email: "email",
      phone: "0607080910",
      roles: ["autreRoleId", "adminRoleId"],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  const reqRolesExpert = {
    fromSite: true,
    body: {
      query: {
        user: { _id: "id", email: "email", phone: "0607080910", roles: ["ExpertTrad"] },
        action: "modify-with-roles",
      },
    },
    user: { roles: [{ nom: RoleName.ADMIN }] },
  };

  it("should return 200 when modify, case new roles expert, actual role Expert admin autre null", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "expertRoleId" });
    getRoleByName.mockResolvedValueOnce({ _id: "adminRoleId" });
    getUserById.mockResolvedValueOnce({
      username: "user",
      phone: "0607080910",
      roles: ["autreRoleId", "expertRoleId", "adminRoleId", null],
    });

    await updateUser(reqRolesExpert, res);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.EXPERT_TRAD);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.ADMIN);
    expect(getUserById).toHaveBeenCalledWith("id", { username: 1, phone: 1, roles: 1, email: 1 });
    expect(updateUserInDB).toHaveBeenCalledWith("id", {
      email: "email",
      phone: "0607080910",
      roles: ["autreRoleId", "expertRoleId"],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return 200 when modify, case new roles expert, actual role  autre null", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "expertRoleId" });
    getRoleByName.mockResolvedValueOnce({ _id: "adminRoleId" });
    getUserById.mockResolvedValueOnce({
      username: "user",
      phone: "0607080910",
      roles: ["autreRoleId", null],
    });

    await updateUser(reqRolesExpert, res);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.EXPERT_TRAD);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.ADMIN);
    expect(getUserById).toHaveBeenCalledWith("id", { username: 1, phone: 1, roles: 1, email: 1 });
    expect(updateUserInDB).toHaveBeenCalledWith("id", {
      email: "email",
      phone: "0607080910",
      roles: ["autreRoleId", "expertRoleId"],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  const reqRolesExpertAdmin = {
    fromSite: true,
    body: {
      query: {
        user: { _id: "id", email: "email", phone: "0607080910", roles: ["ExpertTrad", "Admin"] },
        action: "modify-with-roles",
      },
    },
    user: { roles: [{ nom: RoleName.ADMIN }] },
  };

  it("should return 200 when modify, case new roles expert and admin, actual role Expert admin autre null", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "expertRoleId" });
    getRoleByName.mockResolvedValueOnce({ _id: "adminRoleId" });
    getUserById.mockResolvedValueOnce({
      phone: "0607080910",
      username: "user",
      roles: ["autreRoleId", "expertRoleId", "adminRoleId", null],
    });

    await updateUser(reqRolesExpertAdmin, res);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.EXPERT_TRAD);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.ADMIN);
    expect(getUserById).toHaveBeenCalledWith("id", { username: 1, phone: 1, roles: 1, email: 1 });
    expect(updateUserInDB).toHaveBeenCalledWith("id", {
      email: "email",
      phone: "0607080910",
      roles: ["autreRoleId", "adminRoleId", "expertRoleId"],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return 200 when modify, case new roles expert, actual role  autre null", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "expertRoleId" });
    getRoleByName.mockResolvedValueOnce({ _id: "adminRoleId" });
    getUserById.mockResolvedValueOnce({
      username: "user",
      phone: "0607080910",
      roles: ["autreRoleId", null],
    });

    await updateUser(reqRolesExpertAdmin, res);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.EXPERT_TRAD);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.ADMIN);
    expect(getUserById).toHaveBeenCalledWith("id", { username: 1, phone: 1, roles: 1, email: 1 });
    expect(updateUserInDB).toHaveBeenCalledWith("id", {
      email: "email",
      phone: "0607080910",
      roles: ["autreRoleId", "adminRoleId", "expertRoleId"],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return 500 when getRoleByName throws", async () => {
    getRoleByName.mockRejectedValueOnce(new Error("error"));

    await updateUser(reqRolesExpertAdmin, res);
    expect(getRoleByName).toHaveBeenCalledWith(RoleName.EXPERT_TRAD);
    expect(getRoleByName).not.toHaveBeenCalledWith("Admin");
    expect(getUserById).toHaveBeenCalledWith("id", { phone: 1, roles: 1, username: 1, email: 1 });
    expect(updateUserInDB).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should return 500 when getUserById throws", async () => {
    getUserById.mockRejectedValueOnce(new Error("error"));
    getRoleByName.mockResolvedValue({ _id: "expertRoleId" });
    await updateUser(reqRolesExpertAdmin, res);
    expect(getUserById).toHaveBeenCalledWith("id", { username: 1, phone: 1, roles: 1, email: 1 });
    expect(getRoleByName).not.toHaveBeenCalled();
    expect(getRoleByName).not.toHaveBeenCalled();
    expect(updateUserInDB).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should return 401 if not user himself and type modify-my-details", async () => {
    await updateUser(
      {
        fromSite: true,
        body: {
          query: {
            user: { _id: "id", email: "email", roles: ["ExpertTrad", "Admin"] },
            action: "modify-my-details",
          },
        },
        user: { roles: [{ nom: RoleName.ADMIN }], _id: "userId" },
        userId: "userId",
      },
      res,
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ text: "Token invalide" });
  });

  it("should return 200 if user himself and type modify-my-details", async () => {
    getUserById.mockResolvedValueOnce({});
    await updateUser(
      {
        fromSite: true,
        body: {
          query: {
            user: { _id: "userId", email: "email" },
            action: "modify-my-details",
          },
        },
        user: { roles: [{ nom: RoleName.ADMIN }], _id: "userId" },
        userId: "userId",
      },
      res,
    );
    expect(updateUserInDB).toHaveBeenCalledWith("userId", {
      _id: "userId",
      email: "email",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return 200 but no role saved if user himself and type modify-my-details", async () => {
    getUserById.mockResolvedValueOnce({});
    await updateUser(
      {
        fromSite: true,
        body: {
          query: {
            user: { _id: "userId", email: "email", roles: ["test"] },
            action: "modify-my-details",
          },
        },
        user: { roles: [{ nom: RoleName.ADMIN }], _id: "userId" },
        userId: "userId",
      },
      res,
    );
    expect(updateUserInDB).toHaveBeenCalledWith("userId", {
      _id: "userId",
      email: "email",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return 401 if user himself but pseudo exists and type modify-my-details", async () => {
    updateUserInDB.mockRejectedValueOnce(new Error("erreur"));
    await updateUser(
      {
        fromSite: true,
        body: {
          query: {
            user: { _id: "userId", username: "newPseudo" },
            action: "modify-my-details",
          },
        },
        user: { username: "pseudo", _id: "userId" },
        userId: "userId",
      },
      res,
    );
    expect(updateUserInDB).toHaveBeenCalledWith("userId", {
      _id: "userId",
      username: "newPseudo",
    });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ text: "Ce pseudo est déjà pris" });
  });

  it("should return 500 if user himself but pseudo not modified and type modify-my-details", async () => {
    updateUserInDB.mockRejectedValueOnce(new Error("erreur"));
    await updateUser(
      {
        fromSite: true,
        body: {
          query: {
            user: { _id: "userId", username: "newPseudo" },
            action: "modify-my-details",
          },
        },
        user: { username: "newPseudo", _id: "userId" },
        userId: "userId",
      },
      res,
    );
    expect(updateUserInDB).toHaveBeenCalledWith("userId", {
      _id: "userId",
      username: "newPseudo",
    });

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });
});
