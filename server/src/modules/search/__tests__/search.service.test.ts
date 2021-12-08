// @ts-nocheck
import { updateAlgoliaIndex } from "../search.service";

jest.mock("../../../connectors/algolia/updateAlgoliaData", () => ({
  addAlgoliaObjects: jest.fn(),
  deleteAlgoliaObjects: jest.fn(),
  updateAlgoliaObjects: jest.fn(),
}));


describe("updateAlgoliaIndex", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return no update", async () => {
    const res = await updateAlgoliaIndex([], []);
    expect(res).toEqual({
      added: 0,
      deleted: 0,
      updated: 0
     });
  });
  it("should return 1 added", async () => {
    const res = await updateAlgoliaIndex(
      [{ objectID: "aaa" }],
      []
    );
    expect(res).toEqual({
      added: 1,
      deleted: 0,
      updated: 0
     });
  });
  it("should return 1 deleted", async () => {
    const res = await updateAlgoliaIndex(
      [],
      [{ objectID: "aaa" }]
    );
    expect(res).toEqual({
      added: 0,
      deleted: 1,
      updated: 0
     });
  });
  it("should return 1 updated", async () => {
    const res = await updateAlgoliaIndex(
      [{ objectID: "aaa", title_fr: "Mon titre" }],
      [{ objectID: "aaa", title_fr: "Mon Titre" }]
    );
    expect(res).toEqual({
      added: 0,
      deleted: 0,
      updated: 1
     });
  });
  it("should return multiple changes", async () => {
    const res = await updateAlgoliaIndex(
      [
        { objectID: "aaa", title_fr: "Mon titre A" },
        { objectID: "bbb", title_fr: "Mon titre B" },
        { objectID: "ccc", title_fr: "Mon titre C" },
        { objectID: "ddd", title_fr: "Mon titre D" },
      ],
      [
        { objectID: "aaa", title_fr: "Mon Titre A" },
        { objectID: "bbb", title_fr: "Mon titre B" },
        { objectID: "ccc", title_fr: "Mon titre C" },
        { objectID: "eee", title_fr: "Mon titre E" },
        { objectID: "fff", title_fr: "Mon titre F" },
      ]
    );
    expect(res).toEqual({
      added: 1,
      deleted: 2,
      updated: 1
     });
  });

});
