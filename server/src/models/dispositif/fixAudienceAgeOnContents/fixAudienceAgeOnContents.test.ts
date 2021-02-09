import { fixAudienceAgeOnContents } from "./fixAudienceAgeOnContents";
import {
  getAllContentsFromDB,
  updateDispositifInDB,
} from "../../../controllers/dispositif/dispositif.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../controllers/dispositif/dispositif.repository", () => ({
  getAllContentsFromDB: jest.fn(),
  updateDispositifInDB: jest.fn(),
}));

describe("fixAudienceAgeOnContents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const dispositifs = [
    { typeContenu: "dispositif", _id: "id1" },
    { typeContenu: "demarche", _id: "id2" },
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
  ];
  it("should get contents and update it for dispositifs", async () => {
    getAllContentsFromDB.mockResolvedValueOnce(dispositifs);
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
    expect(updateDispositifInDB).toHaveBeenCalledTimes(4);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });
});
