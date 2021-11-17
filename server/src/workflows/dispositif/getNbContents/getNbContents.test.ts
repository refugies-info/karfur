//@ts-nocheck
import { getNbContents } from "./getNbContents";
import { getActiveContents } from "../../../modules/dispositif/dispositif.repository";
import {
  fakeContenuWithZoneDAction,
  fakeContenuWithZoneDActionAll,
} from "../../../__fixtures__/localizedDispositifs";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getActiveContents: jest.fn(),
}));

const dispositifs = [
  {
    _id: "id1",
    contenu: fakeContenuWithZoneDAction,
  },
  {
    _id: "id2",
    contenu: fakeContenuWithZoneDActionAll,
  },
];

describe("getNbContents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call getActiveContents and return correct result", async () => {
    getActiveContents.mockResolvedValue(
      dispositifs
    );
    const res = mockResponse();
    await getNbContents({query: { department: "Haut-Rhin" }}, res);
    expect(getActiveContents).toHaveBeenCalledWith({
      contenu: 1,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        nbLocalizedContent: 1,
        nbGlobalContent: 1
      }
    });
  });

  it("should return a 500 if getActiveContents throws ", async () => {
    getActiveContents.mockRejectedValue(
      new Error("error")
    );

    const res = mockResponse();
    await getNbContents({query: { department: "Haut-Rhin" }}, res);
    expect(getActiveContents).toHaveBeenCalledWith({
      contenu: 1,
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });
});
