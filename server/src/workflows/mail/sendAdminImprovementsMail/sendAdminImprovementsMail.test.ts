// @ts-nocheck
import { sendAdminImprovementsMail } from "./sendAdminImprovementsMail";
import { sendAdminImprovementsMailService } from "../../../modules/mail/mail.service";

jest.mock("../../../modules/mail/mail.service", () => ({
  sendAdminImprovementsMailService: jest.fn(),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("sendAdminImprovementsMail", () => {
  const res = mockResponse();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if not admin", async () => {
    const req = { user: { roles: ["Contrib"] } };
    await sendAdminImprovementsMail(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 405 if not from site", async () => {
    const req = { user: { roles: [{ nom: "Admin" }] } };
    await sendAdminImprovementsMail(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  const user1 = {
    username: "u1",
    _id: "_id1",
    email: "email1",
  };

  const user2 = {
    username: "u2",
    _id: "_id2",
    email: "email2",
  };
  it("should return 200 with section quoi and qui", async () => {
    const body = {
      dispositifId: "dispoId",
      users: [user1, user2],
      titreInformatif: "TI",
      titreMarque: "TM",
      sections: ["C'est quoi ?", "C'est pour qui ?"],
    };
    const req = { user: { roles: [{ nom: "Admin" }] }, fromSite: true, body };

    const data = {
      dispositifId: "dispoId",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien: "https://refugies.info/dispositif/dispoId",
      sectionsToModify: {
        quoi: true,
        qui: true,
        interessant: false,
        engagement: false,
        carte: false,
      },
    };

    const data1 = { ...data, userId: "_id1", email: "email1", pseudo: "u1" };
    const data2 = { ...data, userId: "_id2", email: "email2", pseudo: "u2" };

    await sendAdminImprovementsMail(req, res);
    expect(sendAdminImprovementsMailService).toHaveBeenCalledWith(data1);
    expect(sendAdminImprovementsMailService).toHaveBeenCalledWith(data2);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 with section engagement interessant and carte", async () => {
    const body = {
      dispositifId: "dispoId",
      users: [user1, user2],
      titreInformatif: "TI",
      titreMarque: "TM",
      sections: [
        "Pourquoi c'est intéressant ?",
        "Comment je m'engage ?",
        "Carte interactive",
      ],
    };
    const req = { user: { roles: [{ nom: "Admin" }] }, fromSite: true, body };

    const data = {
      dispositifId: "dispoId",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien: "https://refugies.info/dispositif/dispoId",
      sectionsToModify: {
        quoi: false,
        qui: false,
        interessant: true,
        engagement: true,
        carte: true,
      },
    };

    const data1 = { ...data, userId: "_id1", email: "email1", pseudo: "u1" };
    const data2 = { ...data, userId: "_id2", email: "email2", pseudo: "u2" };

    await sendAdminImprovementsMail(req, res);
    expect(sendAdminImprovementsMailService).toHaveBeenCalledWith(data1);
    expect(sendAdminImprovementsMailService).toHaveBeenCalledWith(data2);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
