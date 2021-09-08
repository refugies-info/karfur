// @ts-nocheck
import { computePossibleNeeds } from "../needs.service";
import { getNeedsFromDB } from "../needs.repository";

jest.mock("../needs.repository", () => ({
  getNeedsFromDB: jest.fn(),
}));

describe("computePossibleNeeds", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const contentTags = [{ name: "name1" }, null];
  it("should return correct value when no need in entry", async () => {
    const actualNeeds = [];
    const res = await computePossibleNeeds(actualNeeds, contentTags);
    expect(getNeedsFromDB).toHaveBeenCalledWith();
    expect(res).toEqual([]);
  });

  const allNeeds = [
    { _id: "id1", tagName: "name1" },
    { _id: "id2", tagName: "name1" },
    { _id: "id3", tagName: "name2" },
  ];
  it("should return correct value when all needs are in tag", async () => {
    getNeedsFromDB.mockResolvedValueOnce(allNeeds);
    const actualNeeds = ["id1", "id2"];
    const res = await computePossibleNeeds(actualNeeds, contentTags);
    expect(getNeedsFromDB).toHaveBeenCalledWith();
    expect(res).toEqual(["id1", "id2"]);
  });

  it("should remove one need", async () => {
    getNeedsFromDB.mockResolvedValueOnce(allNeeds);
    const actualNeeds = ["id1", "id2", "id3"];
    const res = await computePossibleNeeds(actualNeeds, contentTags);
    expect(getNeedsFromDB).toHaveBeenCalledWith();
    expect(res).toEqual(["id1", "id2"]);
  });
});
