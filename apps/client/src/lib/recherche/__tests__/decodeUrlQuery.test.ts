import decodeQuery from "~/lib/recherche/decodeUrlQuery";

describe("decodeQuery", () => {
  const noThemes: any[] = [];

  it("does not throw on an already-decoded value containing a lone '%'", () => {
    // Next.js hands over decoded values: "?search=100%25" arrives as "100%"
    expect(() => decodeQuery({ search: "100%" }, noThemes)).not.toThrow();
    expect(decodeQuery({ search: "100%" }, noThemes).search).toBe("100%");
  });

  it("does not throw on the sqlmap payload and falls back to the default type", () => {
    const query = {
      search: "1",
      sort: "default",
      type: "demarche%' AND 2*3*8=6*8 AND 'Y4EU'!='Y4EU%",
    };

    expect(() => decodeQuery(query, noThemes)).not.toThrow();
    expect(decodeQuery(query, noThemes).type).toBe("all");
  });

  it("keeps values as-is instead of decoding them twice", () => {
    const query = decodeQuery({ cities: "Lyon", departments: "Rhône" }, noThemes);

    expect(query.cities).toEqual(["Lyon"]);
    expect(query.departments).toEqual(["Rhône"]);
  });

  it("handles repeated params arriving as arrays", () => {
    const query = decodeQuery({ cities: ["Lyon", "Paris"] }, noThemes);

    expect(query.cities).toEqual(["Lyon", "Paris"]);
  });

  it("rejects an unknown sort value", () => {
    expect(decodeQuery({ sort: "'; drop" }, noThemes).sort).toBe("default");
  });

  it("still maps the legacy 'view' sort to 'views'", () => {
    expect(decodeQuery({ sort: "view" }, noThemes).sort).toBe("views");
  });

  it("keeps the backward compatible params working", () => {
    expect(decodeQuery({ dep: "Rhône" }, noThemes).departments).toEqual(["Rhône"]);
    expect(decodeQuery({ tri: "nbVues" }, noThemes).sort).toBe("views");
    expect(decodeQuery({ filter: "demarches" }, noThemes).type).toBe("demarche");
  });

  it("does not throw on a lone '%' in a backward compatible param", () => {
    expect(() => decodeQuery({ dep: "100%" }, noThemes)).not.toThrow();
  });
});
