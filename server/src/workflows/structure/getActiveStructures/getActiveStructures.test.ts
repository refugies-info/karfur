// @ts-nocheck
import { getActiveStructures } from "./getActiveStructures";
import { getStructuresFromDB } from "../../../modules/structure/structure.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/structure/structure.repository", () => ({
  getStructuresFromDB: jest.fn().mockResolvedValue([
    {
      _id: "id1",
      nom: "nom1",
      departments: [],
      dispositifsAssocies: [
        {
          contenu: [
            {},
            {
              children: [
                {
                  type: "card",
                  isFakeContent: false,
                  title: "Zone d'action",
                  titleIcon: "pin-outline",
                  typeIcon: "eva",
                  departments: ["All", "68 - Haut-Rhin"],
                  free: true,
                  contentTitle: "Sélectionner",
                  editable: false,
                },
                {},
                {},
                {},
                {},
              ],
            },
          ],
        },
      ],
    },
    {
      _id: "id2",
      nom: "nom2",
      departments: [],
      dispositifsAssocies: [
        {
          contenu: [
            {},
            {
              children: [{}, {}, {}, {}],
            },
          ],
        },
      ],
    },
  ]),
}));

describe("getActiveStructures", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it.only("should call getStructuresFromDB and return a 200", async () => {
    const res = mockResponse();
    await getActiveStructures({}, res);
    expect(getStructuresFromDB).toHaveBeenCalledWith(
      { status: "Actif" },
      { nom: 1, acronyme: 1, picture: 1, departments: 1, structureTypes: 1 },
      true
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [
        {
          _id: "id1",
          departments: [],
          nom: "nom1",
          disposAssociesLocalisation: ["All", "68 - Haut-Rhin"],
          acronyme: undefined,
          picture: undefined,
          structureTypes: undefined,
        },
        {
          _id: "id2",
          departments: [],
          nom: "nom2",
          disposAssociesLocalisation: [],
          acronyme: undefined,
          picture: undefined,
          structureTypes: undefined,
        },
      ],
    });
  });

  it("should return a 500 if getStructuresFromDB throw ", async () => {
    getStructuresFromDB.mockRejectedValueOnce(new Error("error"));
    const res = mockResponse();
    await getActiveStructures({}, res);
    expect(getStructuresFromDB).toHaveBeenCalledWith(
      { status: "Actif" },
      { nom: 1, acronyme: 1, picture: 1, departments: 1, structureTypes: 1 },
      true
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});
