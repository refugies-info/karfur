// @ts-nocheck
import {
  getTitle,
  parseDispositif,
  filterTargets,
  filterTargetsForDemarche,
  getNotificationEmoji
} from "../helpers";
import { fakeContenuWithZoneDAction } from "../../../__fixtures__/dispositifs";
import { targets } from "../__fixtures__/targets";

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

  it("should parseDispositif", () => {
    const res = parseDispositif({
      _id: "id",
      typeContenu: "dispositif",
      theme: {_id: "theme1"},
      contenu: fakeContenuWithZoneDAction
    });
    expect(res).toEqual({
      departments: ["All", "Haut-Rhin"],
      age: {
        max: 56,
        min: 18
      },
      type: "dispositif",
      mainThemeId: "theme1"
    });
  });

  it("should filterTargets", () => {
    const req1 = {
      age: { min: 18, max: 25 },
      departments: ["All"],
      type: "dispositif",
      mainThemeId: "theme1"
    }
    const res1 = filterTargets(targets, req1);
    expect(res1.map(r => r.uid)).toEqual(["1", "2", "4", "6"]);

    const req2 = {
      age: { min: 18, max: 25 },
      departments: ["Ille-et-Vilaine"],
      type: "dispositif",
      mainThemeId: "theme1"
    }
    const res2 = filterTargets(targets, req2);
    expect(res2.map(r => r.uid)).toEqual(["1", "6"]);
  });

  it("should filterTargetsForDemarche", () => {
    const req1 = {
      age: { min: 18, max: 25 },
      departments: ["All"],
      type: "demarche",
      mainThemeId: "theme1"
    }
    const res1 = filterTargetsForDemarche(targets, req1);
    expect(res1.map(r => r.uid)).toEqual(["1", "2", "6"]);
  });

  it("should getNotificationEmoji", () => {
    const disp1 = {
      _id: "id",
      typeContenu: "dispositif",
      theme: {
        notificationEmoji: "💼"
      }
    }
    const res1 = getNotificationEmoji(disp1)
    expect(res1).toEqual("💼");

    const disp2 = {
      _id: "id",
      typeContenu: "dispositif",
      theme: {}
    }
    const res2 = getNotificationEmoji(disp2)
    expect(res2).toEqual("🔔");
  });


});
