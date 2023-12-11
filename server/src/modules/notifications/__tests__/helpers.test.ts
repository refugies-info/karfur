import {
  getTitle,
  getAge,
  parseDispositif,
  filterTargets,
  filterTargetsForDemarche,
  getNotificationEmoji,
  Requirements
} from "../helpers";
import cloneDeep from "lodash/cloneDeep";
import { ContentType } from "@refugies-info/api-types";
import { targets } from "../__fixtures__/targets";
import { dispositif, demarche, theme } from "../../../__fixtures__";
import { ThemeModel } from "../../../typegoose";

describe("notification helpers", () => {
  it("should getTitle", () => {
    const res1 = getTitle("Titre", "fr");
    expect(res1).toEqual("Titre");

    const res2 = getTitle(
      {
        "fr": "Titre",
        "en": "Title"
      }, "fr");
    expect(res2).toEqual("Titre");

    const res3 = getTitle(
      {
        "fr": "Titre",
        "en": "Title"
      }, "en");
    expect(res3).toEqual("Title");

    const res4 = getTitle(
      {
        "fr": "Titre",
        "en": "Title"
      }, "pt");
    expect(res4).toEqual("Titre");

    const res5 = getTitle(
      {
        "es": "Titre",
        "en": "Title"
      }, "pt");
    expect(res5).toEqual("");
  });

  it("should getAge", () => {
    const disp1 = cloneDeep(dispositif);

    disp1.metadatas.age = null;
    const res1 = getAge(disp1);
    expect(res1).toEqual({ min: 0, max: 99 });

    disp1.metadatas.age = {
      type: "lessThan",
      ages: [23]
    };
    const res2 = getAge(disp1);
    expect(res2).toEqual({ min: 0, max: 23 });

    disp1.metadatas.age = {
      type: "moreThan",
      ages: [23]
    };
    const res3 = getAge(disp1);
    expect(res3).toEqual({ min: 23, max: 99 });

    disp1.metadatas.age = {
      type: "between",
      ages: [12, 34]
    };
    const res4 = getAge(disp1);
    expect(res4).toEqual({ min: 12, max: 34 });

  });

  it("should parseDispositif", () => {
    const res = parseDispositif(dispositif);
    expect(res).toEqual({
      departments: ["13 - Bouches-du-Rhône"],
      age: {
        max: 99,
        min: 0
      },
      type: ContentType.DISPOSITIF,
      mainThemeId: "63286a015d31b2c0cad9960a"
    });
  });

  it("should filterTargets", () => {
    const req1: Requirements = {
      age: { min: 18, max: 25 },
      departments: "france",
      type: ContentType.DISPOSITIF,
      mainThemeId: "theme1"
    }
    const res1 = filterTargets(targets, req1, "fr");
    expect(res1.map(r => r.uid)).toEqual(["1", "6"]);

    const req2 = {
      age: { min: 18, max: 25 },
      departments: ["Ille-et-Vilaine"],
      type: ContentType.DISPOSITIF,
      mainThemeId: "theme1"
    }
    const res2 = filterTargets(targets, req2, "fr");
    expect(res2.map(r => r.uid)).toEqual(["1"]);
  });

  it("should filterTargetsForDemarche", () => {
    const req1: Requirements = {
      age: { min: 18, max: 25 },
      departments: "france",
      type: ContentType.DEMARCHE,
      mainThemeId: "theme1"
    }
    const res1 = filterTargetsForDemarche(targets, req1, demarche);
    expect(res1.map(r => r.uid)).toEqual(["1", "2", "6"]);
  });

  it("should getNotificationEmoji", () => {
    const disp1 = dispositif;
    disp1.theme = new ThemeModel(theme);
    const res1 = getNotificationEmoji(disp1)
    expect(res1).toEqual("💼");

    const disp2 = dispositif;
    disp2.theme = null;
    const res2 = getNotificationEmoji(disp2)
    expect(res2).toEqual("🔔");
  });


});
