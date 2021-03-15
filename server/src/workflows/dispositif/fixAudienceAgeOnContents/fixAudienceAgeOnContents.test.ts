// @ts-nocheck
import { fixAudienceAgeOnContents } from "./fixAudienceAgeOnContents";
import {
  getAllContentsFromDB,
  updateDispositifInDB,
  removeVariantesInDB,
} from "../../../modules/dispositif/dispositif.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const infocardFranceEntiere = {
  type: "card",
  title: "Zone d'action",
  titleIcon: "pin-outline",
  typeIcon: "eva",
  departments: ["All"],
};
const demarche1 = {
  typeContenu: "demarche",
  _id: "id1",
  status: "Actif",
  contenu: [
    { title: "C'est quoi ?" },
    { title: "C'est pour qui ?", children: [] },
    { title: "La démarche par étapes" },
    { title: "Et après" },
  ],
};

const modifiedDemarche1 = {
  audienceAge: [
    { contentTitle: "Plus de ** ans", bottomValue: -1, topValue: 999 },
  ],
  contenu: [
    { title: "C'est quoi ?" },
    { title: "C'est pour qui ?", children: [infocardFranceEntiere] },
    { title: "La démarche par étapes" },
    { title: "Et après" },
  ],
};

const demarche2 = {
  typeContenu: "demarche",
  _id: "id2",
  status: "Actif",
  contenu: [
    { title: "C'est quoi ?" },
    {
      title: "C'est pour qui ?",
      children: [
        {
          title: "Âge requis",
          contentTitle: "Plus de ** ans",
          bottomValue: "30",
          topValue: "35",
        },
      ],
    },
    { title: "La démarche par étapes" },
    { title: "Et après" },
  ],
};
const modifiedDemarche2 = {
  contenu: [
    { title: "C'est quoi ?" },
    {
      title: "C'est pour qui ?",
      children: [
        infocardFranceEntiere,
        {
          title: "Âge requis",
          contentTitle: "Plus de ** ans",
          bottomValue: "30",
          topValue: "35",
        },
      ],
    },
    { title: "La démarche par étapes" },
    { title: "Et après" },
  ],
  audienceAge: [
    { contentTitle: "Plus de ** ans", bottomValue: 30, topValue: 999 },
  ],
};

const demarche3 = {
  typeContenu: "demarche",
  _id: "id3",
  status: "Actif",
  contenu: [
    { title: "C'est quoi ?" },
    {
      title: "C'est pour qui ?",
      children: [
        {
          title: "Âge requis",
          ageTitle: "Moins de ** ans",
          bottomValue: "30",
          topValue: "35",
        },
        { title: "Localisation" },
      ],
    },
    { title: "La démarche par étapes" },
    { title: "Et après" },
  ],
};
const modifiedDemarche3 = {
  contenu: [
    { title: "C'est quoi ?" },
    {
      title: "C'est pour qui ?",
      children: [
        infocardFranceEntiere,
        {
          title: "Âge requis",
          contentTitle: "Moins de ** ans",
          bottomValue: "30",
          topValue: "35",
        },
      ],
    },
    { title: "La démarche par étapes" },
    { title: "Et après" },
  ],
  audienceAge: [
    { contentTitle: "Moins de ** ans", bottomValue: -1, topValue: 35 },
  ],
};

const demarche4 = {
  typeContenu: "demarche",
  _id: "id4",
  status: "Actif",
  contenu: [
    { title: "C'est quoi ?" },
    {
      title: "C'est pour qui ?",
    },
    { title: "La démarche par étapes" },
    { title: "Et après" },
  ],
};
const modifiedDemarche4 = {
  contenu: [
    { title: "C'est quoi ?" },
    {
      title: "C'est pour qui ?",
      children: [infocardFranceEntiere],
    },
    { title: "La démarche par étapes" },
    { title: "Et après" },
  ],
  audienceAge: [
    { contentTitle: "Plus de ** ans", bottomValue: -1, topValue: 999 },
  ],
};

const demarche5 = {
  typeContenu: "demarche",
  _id: "id5",
  status: "En attente",
  contenu: [
    { title: "C'est quoi ?" },
    {
      title: "C'est pour qui ?",
    },
    { title: "La démarche par étapes" },
    { title: "Et après" },
  ],
};

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getAllContentsFromDB: jest.fn(),
  updateDispositifInDB: jest.fn(),
  removeVariantesInDB: jest.fn(),
}));

describe("fixAudienceAgeOnContents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const contents = [
    { typeContenu: "dispositif", _id: "id1" },
    {
      typeContenu: "dispositif",
      _id: "id3",
      audienceAge: [
        { contentTitle: "De ** à ** ans", bottomValue: "35", topValue: 50 },
      ],
    },
    {
      typeContenu: "dispositif",
      _id: "id4",
      audienceAge: [
        { contentTitle: "Plus de ** ans", bottomValue: "35", topValue: 50 },
      ],
    },
    {
      typeContenu: "dispositif",
      _id: "id5",
      audienceAge: [
        { contentTitle: "Moins de ** ans", bottomValue: "35", topValue: "50" },
      ],
    },
    demarche1,
    demarche2,
    demarche3,
    demarche4,
    demarche5,
  ];
  it("should get contents and update it for contents", async () => {
    getAllContentsFromDB.mockResolvedValueOnce(contents);
    const res = mockResponse();
    await fixAudienceAgeOnContents(null, res);

    expect(getAllContentsFromDB).toHaveBeenCalledWith();
    expect(updateDispositifInDB).toHaveBeenCalledWith("id1", {
      audienceAge: [
        { contentTitle: "Plus de ** ans", bottomValue: -1, topValue: 999 },
      ],
    });
    expect(updateDispositifInDB).toHaveBeenCalledWith("id3", {
      audienceAge: [
        { contentTitle: "De ** à ** ans", bottomValue: 35, topValue: 50 },
      ],
    });
    expect(updateDispositifInDB).toHaveBeenCalledWith("id4", {
      audienceAge: [
        { contentTitle: "Plus de ** ans", bottomValue: 35, topValue: 999 },
      ],
    });
    expect(updateDispositifInDB).toHaveBeenCalledWith("id5", {
      audienceAge: [
        { contentTitle: "Moins de ** ans", bottomValue: -1, topValue: 50 },
      ],
    });
    expect(updateDispositifInDB).toHaveBeenCalledWith("id1", modifiedDemarche1);
    expect(updateDispositifInDB).toHaveBeenCalledWith("id2", modifiedDemarche2);
    expect(updateDispositifInDB).toHaveBeenCalledWith("id3", modifiedDemarche3);
    expect(updateDispositifInDB).toHaveBeenCalledWith("id4", modifiedDemarche4);
    expect(removeVariantesInDB).toHaveBeenCalledWith("id1");
    expect(removeVariantesInDB).toHaveBeenCalledWith("id2");
    expect(removeVariantesInDB).toHaveBeenCalledWith("id3");
    expect(removeVariantesInDB).toHaveBeenCalledWith("id4");
    expect(removeVariantesInDB).toHaveBeenCalledWith("id5");

    expect(updateDispositifInDB).toHaveBeenCalledTimes(8);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should get contents and update it for contents even if updateDispositifInDB throws once", async () => {
    getAllContentsFromDB.mockResolvedValueOnce([demarche1, demarche2]);
    updateDispositifInDB.mockRejectedValueOnce(new Error("erreur"));
    const res = mockResponse();
    await fixAudienceAgeOnContents(null, res);

    expect(getAllContentsFromDB).toHaveBeenCalledWith();

    expect(updateDispositifInDB).toHaveBeenCalledWith("id1", modifiedDemarche1);
    expect(updateDispositifInDB).toHaveBeenCalledWith("id2", modifiedDemarche2);
    expect(removeVariantesInDB).not.toHaveBeenCalledWith("id1");
    expect(removeVariantesInDB).toHaveBeenCalledWith("id2");
    expect(updateDispositifInDB).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should get contents and update it for contents even if removeVariantesInDB throws once", async () => {
    getAllContentsFromDB.mockResolvedValueOnce([demarche1, demarche2]);
    removeVariantesInDB.mockRejectedValueOnce(new Error("erreur"));
    const res = mockResponse();
    await fixAudienceAgeOnContents(null, res);

    expect(getAllContentsFromDB).toHaveBeenCalledWith();

    expect(updateDispositifInDB).toHaveBeenCalledWith("id1", modifiedDemarche1);
    expect(updateDispositifInDB).toHaveBeenCalledWith("id2", modifiedDemarche2);
    expect(removeVariantesInDB).toHaveBeenCalledWith("id1");
    expect(removeVariantesInDB).toHaveBeenCalledWith("id2");
    expect(updateDispositifInDB).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should get contents and update it for contents even if removeVariantesInDB throws once", async () => {
    getAllContentsFromDB.mockRejectedValueOnce(new Error("erreur"));
    const res = mockResponse();
    await fixAudienceAgeOnContents(null, res);

    expect(getAllContentsFromDB).toHaveBeenCalledWith();

    expect(updateDispositifInDB).not.toHaveBeenCalled();
    expect(removeVariantesInDB).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "KO" });
  });
});
