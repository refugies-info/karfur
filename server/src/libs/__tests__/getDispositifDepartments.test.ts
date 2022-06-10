// @ts-nocheck
import { getDispositifDepartments } from "../getDispositifDepartments";

describe("getDispositifDepartments", () => {
  it("returns null if no departements", () => {
    const disp1 = {};
    const disp2 = {contenu: []};
    const disp3 = {
      contenu: [
      {_id: "child1"},
      {_id: "child2"}
    ]};
    const disp4 = {
      contenu: [
        {
          _id: "child1"
        },
        {
          _id: "child2",
          children: [
            {title: "Prix"},
            {title: "Age"}
          ]
        },
      ]
    };
    const disp5 = {
      contenu: [
        {
          _id: "child1"
        },
        {
          _id: "child2",
          children: [
            {title: "Prix"},
            { title: "Zone d'action" }
          ]
        },
      ]
    };

    const res1 = getDispositifDepartments(disp1);
    expect(res1).toEqual([]);
    const res2 = getDispositifDepartments(disp2);
    expect(res2).toEqual([]);
    const res3 = getDispositifDepartments(disp3);
    expect(res3).toEqual([]);
    const res4 = getDispositifDepartments(disp4);
    expect(res4).toEqual([]);
    const res5 = getDispositifDepartments(disp5);
    expect(res5).toEqual([]);
  });

  it("returns departements", () => {
    const disp = {
      contenu: [
        {
          _id: "child1"
        },
        {
          _id: "child2",
          children: [
            {title: "Prix"},
            {
              title: "Zone d'action",
              departments: ["All", "35 - Ille-et-Vilaine"]
            }
          ]
        },
      ]
    };

    const res = getDispositifDepartments(disp);
    expect(res).toEqual(["All", "35 - Ille-et-Vilaine"]);
  });
});
