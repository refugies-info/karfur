// @ts-nocheck
import { getFiguresOnUsers } from "./getFiguresOnUsers";
import { UserModel } from "src/typegoose/User";
import logger from "../../../logger";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../logger");

const tradRole = {
  _id: "5ce57c969aadae8734c7aeec",
  nom: "Trad"
};
const expertTradRole = {
  _id: "5ce57c969aadae8734c7aeec",
  nom: "ExpertTrad"
};
const contribRole = {
  _id: "5ce57c969aadae8734c7aeec",
  nom: "Contrib"
};
const userRole = {
  _id: "5ce57c969aadae8734c7aeec",
  nom: "User"
};

const users = [
  {
    _id: "5dbff32e367a343830cd2f49",
    roles: []
  },
  {
    _id: "5dbff89209dee20b18091ec3",
    roles: [userRole]
  },
  {
    _id: "5dbff89209dee20b18091ec3",
    roles: [tradRole]
  },
  {
    _id: "5dbff89209dee20b18091ec3",
    roles: [expertTradRole]
  },
  {
    _id: "5dbff89209dee20b18091ec3",
    roles: [contribRole]
  }
];
const users2 = [
  {
    _id: "5dbff89209dee20b18091ec3",
    roles: [tradRole]
  },
  {
    _id: "5dbff89209dee20b18091ec3",
    roles: [expertTradRole, tradRole]
  }
];

describe("getFiguresOnUsers", () => {
  it("should return correct figures", async () => {
    UserModel.find.mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(users) });
    const res = mockResponse();
    await getFiguresOnUsers({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        nbContributors: 1,
        nbTraductors: 2,
        nbExperts: 1
      }
    });
  });

  it("should return correct figures", async () => {
    UserModel.find.mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(users2) });
    const res = mockResponse();
    await getFiguresOnUsers({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        nbContributors: 0,
        nbTraductors: 2,
        nbExperts: 1
      }
    });
  });

  it("should return zero values if user.find throws", async () => {
    UserModel.find.mockReturnValueOnce({
      populate: jest.fn().mockRejectedValue(new Error("error"))
    });
    const res = mockResponse();
    await getFiguresOnUsers({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        nbContributors: 0,
        nbTraductors: 0,
        nbExperts: 0
      }
    });
    expect(logger.error).toHaveBeenCalledWith("[getFiguresOnUsers] error while getting users", {
      error: "error"
    });
  });
});
