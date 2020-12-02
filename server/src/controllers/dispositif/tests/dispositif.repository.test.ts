// @ts-nocheck
import { Dispositif } from "../../../schema/schemaDispositif";
import {
  getDispositifsFromDB,
  updateDispositifStatusInDB,
} from "../dispositif.repository";

describe("getDispositifsFromDB", () => {
  it("should call Dispositif", async () => {
    Dispositif.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([{ id: "id1" }, { id: "id2" }]),
    });
    const neededFields = { status: 1, typeContenu: 1 };
    const res = await getDispositifsFromDB(neededFields);
    expect(Dispositif.find).toHaveBeenCalledWith({}, neededFields);
    expect(res).toEqual([{ id: "id1" }, { id: "id2" }]);
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
