// @ts-nocheck
import {
  getAdminUrlParams,
  getInitialTab,
  getInitialFilters
} from "./getAdminUrlParams";

describe("getAdminUrlParams", () => {
  it("should encode filter", () => {
    const res = getAdminUrlParams("structures", "En attente", null, null, null);
    expect(res).toEqual("tab=structures&filter=En%2520attente")
  });
  it("should return default tab", () => {
    const res = getAdminUrlParams(undefined, undefined, null, null, null);
    expect(res).toEqual("tab=contenus")
  });
  it("should return id params", () => {
    const res1 = getAdminUrlParams("utilisateurs", "Admin", "abc", null, null);
    expect(res1).toEqual("tab=utilisateurs&filter=Admin&userId=abc");

    const res2 = getAdminUrlParams("utilisateurs", "Admin", null, "abc", null);
    expect(res2).toEqual("tab=utilisateurs&filter=Admin&contentId=abc");

    const res3 = getAdminUrlParams("utilisateurs", "Admin", null, null, "abc");
    expect(res3).toEqual("tab=utilisateurs&filter=Admin&structureId=abc");
  });
});

describe("getInitialTab", () => {
  it("should return default", () => {
    const res = getInitialTab({ query: {} });
    expect(res).toEqual("contenus")
  });
  it("should return value from localStorage", () => {
    global.Storage.prototype.getItem = jest.fn((key) => "tab=structures&filter=Actif")
    const res = getInitialTab({ query: {} });
    expect(res).toEqual("structures")
  });
  it("should return query param", () => {
    const res = getInitialTab({ query: { tab: "structures" } });
    expect(res).toEqual("structures")
  });
});

describe("getInitialFilters", () => {
  it("should return filters from query", () => {
    const res = getInitialFilters(
      { query: { tab: "structures", filter: "En%2520attente", contentId: "abc" } },
      "structures"
    );
    expect(res).toEqual({
      filter: "En%20attente",
      selectedDispositifId: "abc",
      selectedUserId: null,
      selectedStructureId: null,
    })
  });
  it("should return default if not current tab", () => {
    const res = getInitialFilters(
      { query: { tab: "utilisateurs" } },
      "structures"
    );
    expect(res).toEqual({
      filter: null,
      selectedUserId: null,
      selectedDispositifId: null,
      selectedStructureId: null,
    })
  });
  it("prefer query over localStorage", () => {
    global.Storage.prototype.getItem = jest.fn((key) => "tab=utilisateurs&filter=Actif")
    const res = getInitialFilters(
      { query: { tab: "utilisateurs", filter: "En%2520attente", contentId: "abc" } },
      "utilisateurs"
    );
    expect(res).toEqual({
      filter: "En%20attente",
      selectedUserId: null,
      selectedDispositifId: "abc",
      selectedStructureId: null,
    })
  });
  it("should use localStorage if no query", () => {
    global.Storage.prototype.getItem = jest.fn((key) => "tab=utilisateurs&filter=Actif&contentId=abc")
    const res = getInitialFilters(
      { query: {} },
      "utilisateurs"
    );
    expect(res).toEqual({
      filter: "Actif",
      selectedUserId: null,
      selectedDispositifId: "abc",
      selectedStructureId: null,
    })
  });
});
