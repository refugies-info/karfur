// @ts-nocheck
import { getAllDispositifs } from "./getAllDispositifs";
import { getDispositifsFromDB } from "../../../modules/dispositif/dispositif.repository";
import { turnToLocalizedTitles } from "../../../controllers/dispositif/functions";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/structure/structure.repository", () => ({
  updateAssociatedDispositifsInStructure: jest.fn(),
}));
jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getDispositifsFromDB: jest.fn(),
}));
jest.mock("../../../controllers/dispositif/functions", () => ({
  turnToLocalizedTitles: jest.fn(),
}));

describe("getAllispositifs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    updatedAt: 1,
    status: 1,
    typeContenu: 1,
    created_at: 1,
    publishedAt: 1,
    publishedAtAuthor: 1,
    adminComments: 1,
    adminProgressionStatus: 1,
    adminPercentageProgressionStatus: 1,
    lastAdminUpdate: 1,
    draftReminderMailSentDate: 1,
    draftSecondReminderMailSentDate: 1,
    lastReminderMailSentToUpdateContentDate: 1,
    merci: 1,
    nbVues: 1,
    lastModificationDate: 1,
    lastModificationAuthor: 1,
    needs: 1,
    tags: 1,
  };

  const dispositifsToJson = [
    {
      toJSON: () => ({
        _id: "id1",
        mainSponsor: {
          _id: "id",
          nom: "nom",
          status: "Actif",
          email: "email",
          picture: { secure_url: "secure_url_sponsor" },
        },
        creatorId: {
          username: "creator",
          _id: "creatorId",
          picture: { secure_url: "secure_url" },
          password: "test",
        },
      }),
    },
    { toJSON: () => ({ _id: "id2" }) },
  ];

  const adaptedDispositif1 = {
    _id: "id1",
    mainSponsor: {
      _id: "id",
      nom: "nom",
      status: "Actif",
      picture: { secure_url: "secure_url_sponsor" },
    },
    creatorId: {
      username: "creator",
      _id: "creatorId",
      picture: { secure_url: "secure_url" },
    },
    nbMercis: 0
  };
  const adaptedDispositif2 = {
    _id: "id2",
    mainSponsor: "",
    creatorId: null,
    nbMercis: 0
  };
  it("should call getDispositifsFromDB", async () => {
    getDispositifsFromDB.mockResolvedValue(dispositifsToJson);
    const res = mockResponse();
    await getAllDispositifs({}, res);
    expect(getDispositifsFromDB).toHaveBeenCalledWith(neededFields);
    expect(turnToLocalizedTitles).toHaveBeenCalledWith(
      adaptedDispositif1,
      "fr"
    );
    expect(turnToLocalizedTitles).toHaveBeenCalledWith(
      adaptedDispositif2,
      "fr"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: [adaptedDispositif1, adaptedDispositif2],
    });
  });

  it("should call getDispositifsFromDB and return a 500 if getDispositifsFromDB throws", async () => {
    getDispositifsFromDB.mockRejectedValue(new Error("error"));
    const res = mockResponse();
    await getAllDispositifs({}, res);
    expect(getDispositifsFromDB).toHaveBeenCalledWith(neededFields);
    expect(turnToLocalizedTitles).not.toHaveBeenCalled();
    expect(turnToLocalizedTitles).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  it("should call getDispositifsFromDB and return a 500 if dispositif has no json", async () => {
    getDispositifsFromDB.mockResolvedValue([{ id: "id1" }, { id: "id2" }]);
    const res = mockResponse();
    await getAllDispositifs({}, res);
    expect(getDispositifsFromDB).toHaveBeenCalledWith(neededFields);
    expect(turnToLocalizedTitles).not.toHaveBeenCalled();
    expect(turnToLocalizedTitles).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  it("should call getDispositifsFromDB and return a 500 if dispositif has no json", async () => {
    getDispositifsFromDB.mockResolvedValue(dispositifsToJson);
    turnToLocalizedTitles.mockImplementationOnce(() => {
      throw new Error("TEST");
    });
    const res = mockResponse();
    await getAllDispositifs({}, res);
    expect(getDispositifsFromDB).toHaveBeenCalledWith(neededFields);
    expect(turnToLocalizedTitles).toHaveBeenCalledWith(
      adaptedDispositif1,
      "fr"
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});
