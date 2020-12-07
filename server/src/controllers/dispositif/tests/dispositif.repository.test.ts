// @ts-nocheck
import { Dispositif } from "../../../schema/schemaDispositif";
import {
  getDispositifsFromDB,
  updateDispositifStatusInDB,
  getDispositifArray,
} from "../dispositif.repository";

const dispositifsList = [{ id: "id1" }, { id: "id2" }];
describe("getDispositifsFromDB", () => {
  it("should call Dispositif", async () => {
    Dispositif.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(dispositifsList),
    });
    const neededFields = { status: 1, typeContenu: 1 };
    const res = await getDispositifsFromDB(neededFields);
    expect(Dispositif.find).toHaveBeenCalledWith({}, neededFields);
    expect(Dispositif.find().populate).toHaveBeenCalledWith(
      "mainSponsor creatorId"
    );

    expect(res).toEqual(dispositifsList);
  });
});

describe("updateDispositifStatus", () => {
  it("should call Dispositif", async () => {
    Dispositif.findOneAndUpdate = jest.fn().mockResolvedValue({ id: "id1" });

    const res = await updateDispositifStatusInDB("id1", {
      status: "Actif",
      publishedAt: "01/01/01",
    });
    expect(Dispositif.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "id1" },
      { status: "Actif", publishedAt: "01/01/01" }
    );
    expect(res).toEqual({ id: "id1" });
  });
});

describe("getDispositifArray", () => {
  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    abstract: 1,
    contenu: 1,
    tags: 1,
    created_at: 1,
    publishedAt: 1,
    typeContenu: 1,
    avancement: 1,
    status: 1,
    nbMots: 1,
  };
  it("should call Dispositif when query has no audience age", async () => {
    Dispositif.find = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(dispositifsList),
    });
    const query = { status: "Actif" };

    const res = await getDispositifArray(query);

    expect(Dispositif.find).toHaveBeenCalledWith(query, neededFields);
    expect(res).toEqual(dispositifsList);
  });

  it("should call Dispositif when query has bottom audience age", async () => {
    Dispositif.find = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(dispositifsList),
    });

    const query = { status: "Actif", "audienceAge.bottomValue": 25 };

    const newQuery = {
      $or: [
        query,
        {
          "variantes.bottomValue": 25,

          "variantes.topValue": undefined,
          status: "Actif",
        },
      ],
    };

    const res = await getDispositifArray(query);

    expect(Dispositif.find).toHaveBeenCalledWith(newQuery, neededFields);
    expect(res).toEqual(dispositifsList);
  });

  it("should call Dispositif when query has bottom audience age", async () => {
    Dispositif.find = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(dispositifsList),
    });

    const query = {
      status: "Actif",
      "audienceAge.bottomValue": 25,
      "audienceAge.topValue": 50,
    };

    const newQuery = {
      $or: [
        query,
        {
          "variantes.bottomValue": 25,

          "variantes.topValue": 50,
          status: "Actif",
        },
      ],
    };

    const res = await getDispositifArray(query);

    expect(Dispositif.find).toHaveBeenCalledWith(newQuery, neededFields);
    expect(res).toEqual(dispositifsList);
  });
});
