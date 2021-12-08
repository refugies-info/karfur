// @ts-nocheck
import { dispositifAlgolia } from "../__fixtures__/dispositif";
import { getDiffAlgoliaObject } from "../getDiffAlgoliaObject";

describe("getDiffAlgoliaObject", () => {
  it("find no diff", () => {
    const res = getDiffAlgoliaObject(dispositifAlgolia, dispositifAlgolia);
    expect(res).toEqual(null);
  });

  it("find diff in string", () => {
    const dispositifAlgoliaCopy = { ...dispositifAlgolia };
    dispositifAlgoliaCopy.title_fr = "Parrainer deux réfugiés";
    const res = getDiffAlgoliaObject(dispositifAlgolia, dispositifAlgoliaCopy);
    expect(res).toEqual({
      objectID: "5ce7ab7383983700167bc9da",
      title_fr: "Parrainer un réfugié"
    });
  });

  it("find diff in array", () => {
    const dispositifAlgoliaCopy = { ...dispositifAlgolia };
    dispositifAlgoliaCopy.needs = ["aaa", "ccc"];
    const res = getDiffAlgoliaObject(dispositifAlgolia, dispositifAlgoliaCopy);
    expect(res).toEqual({
      objectID: "5ce7ab7383983700167bc9da",
      needs: ["aaa", "bbb"]
    });
  });

  it("find multiple diffs", () => {
    const dispositifAlgoliaCopy = { ...dispositifAlgolia };
    dispositifAlgoliaCopy.needs = ["aaa", "ccc"];
    dispositifAlgoliaCopy.title_fr = "Parrainer deux réfugiés";
    const res = getDiffAlgoliaObject(dispositifAlgolia, dispositifAlgoliaCopy);
    expect(res).toEqual({
      objectID: "5ce7ab7383983700167bc9da",
      title_fr: "Parrainer un réfugié",
      needs: ["aaa", "bbb"]
    });
  });
});
