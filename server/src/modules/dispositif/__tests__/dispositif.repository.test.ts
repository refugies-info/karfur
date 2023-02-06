// @ts-nocheck
import { DispositifModel } from "../../../typegoose/Dispositif";
import {
  getDispositifsFromDB,
  updateDispositifInDB,
  getDispositifArray,
  getActiveDispositifsFromDBWithoutPopulate
} from "../dispositif.repository";

jest.mock("../../../typegoose/Dispositif", () => ({
  DispositifModel: {
    find: jest.fn(),
    findOneAndUpdate: jest.fn()
  }
}));

const dispositifsList = [{ id: "id1" }, { id: "id2" }];
describe("getDispositifsFromDB", () => {
  it("should call Dispositif", async () => {
    DispositifModel.find.mockReturnValueOnce({
      populate: jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue(dispositifsList)
      })
    });
    const neededFields = { status: 1, typeContenu: 1 };
    const res = await getDispositifsFromDB(neededFields);
    expect(DispositifModel.find).toHaveBeenCalledWith({}, neededFields);

    expect(res).toEqual(dispositifsList);
  });
});

describe("updateDispositifStatus", () => {
  it("should call Dispositif", async () => {
    DispositifModel.findOneAndUpdate.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValue({ id: "id1" })
    });

    const res = await updateDispositifInDB("id1", {
      status: "Actif",
      publishedAt: "01/01/01"
    });
    expect(DispositifModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "id1" },
      { status: "Actif", publishedAt: "01/01/01" },
      {
        upsert: true,
        new: true
      }
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
    theme: 1,
    secondaryThemes: 1,
    created_at: 1,
    publishedAt: 1,
    typeContenu: 1,
    avancement: 1,
    status: 1,
    nbMots: 1,
    nbVues: 1,
    audienceAge: 1,
    niveauFrancais: 1
  };
  it("should call Dispositif when query has no audience age", async () => {
    DispositifModel.find.mockReturnValueOnce({
      sort: jest.fn().mockReturnValueOnce({
        limit: jest.fn().mockReturnValueOnce({
          lean: jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockResolvedValue(dispositifsList)
          })
        })
      })
    });
    const query = { status: "Actif" };

    const res = await getDispositifArray(query);

    expect(DispositifModel.find).toHaveBeenCalledWith(query, neededFields);
    expect(res).toEqual(dispositifsList);
  });
  it("should call Dispositif with extra fields", async () => {
    DispositifModel.find.mockReturnValueOnce({
      sort: jest.fn().mockReturnValueOnce({
        limit: jest.fn().mockReturnValueOnce({
          lean: jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockResolvedValue(dispositifsList)
          })
        })
      })
    });

    const query = { status: "Actif" };

    const res = await getDispositifArray(query, { updatedAt: 1 });

    expect(DispositifModel.find).toHaveBeenCalledWith(query, {
      ...neededFields,
      updatedAt: 1
    });
    expect(res).toEqual(dispositifsList);
  });

  it("should call Dispositif when query has bottom audience age", async () => {
    DispositifModel.find.mockReturnValueOnce({
      sort: jest.fn().mockReturnValueOnce({
        limit: jest.fn().mockReturnValueOnce({
          lean: jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockResolvedValue(dispositifsList)
          })
        })
      })
    });

    const query = { "status": "Actif", "audienceAge.bottomValue": 25 };

    const res = await getDispositifArray(query);

    expect(DispositifModel.find).toHaveBeenCalledWith(query, neededFields);
    expect(res).toEqual(dispositifsList);
  });

  it("should call Dispositif when query has bottom audience age", async () => {
    DispositifModel.find.mockReturnValueOnce({
      sort: jest.fn().mockReturnValueOnce({
        limit: jest.fn().mockReturnValueOnce({
          lean: jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockResolvedValue(dispositifsList)
          })
        })
      })
    });

    const query = {
      "status": "Actif",
      "audienceAge.bottomValue": 25,
      "audienceAge.topValue": 50
    };

    const res = await getDispositifArray(query);

    expect(DispositifModel.find).toHaveBeenCalledWith(query, neededFields);
    expect(res).toEqual(dispositifsList);
  });
});

describe("updateDispositifInDB", () => {
  it("should call Dispositif.findOneAndUpdate", async () => {
    DispositifModel.findOneAndUpdate.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValue(null)
    });
    await updateDispositifInDB("dispositifId", {
      mainSponsor: "sponsorId",
      status: "Actif"
    });
    expect(DispositifModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "dispositifId" },
      {
        mainSponsor: "sponsorId",
        status: "Actif"
      },
      {
        upsert: true,
        new: true
      }
    );
  });
});

describe("getActiveDispositifsFromDBWithoutPopulate", () => {
  it("should call Dispositif.findOneAndUpdate", async () => {
    await getActiveDispositifsFromDBWithoutPopulate({
      contenu: 1
    });
    expect(DispositifModel.find).toHaveBeenCalledWith(
      { status: "Actif", typeContenu: "dispositif" },
      {
        contenu: 1
      }
    );
  });
});
