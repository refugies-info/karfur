import {
  deleteLineBreaks,
  deleteLineBreaksInInfosections,
} from "~/modules/dispositif/dispositif.service";

describe("deleteLineBreaks", () => {
  it("ne crash pas sur undefined (régression migration Zod — accordéon vide)", () => {
    expect(deleteLineBreaks(undefined)).toBe("");
  });

  it("ne crash pas sur une chaîne vide", () => {
    expect(deleteLineBreaks("")).toBe("");
  });

  it("supprime les sauts de ligne parasites ltr/rtl", () => {
    expect(deleteLineBreaks('<p dir="ltr"><br></p>')).toBe("");
    expect(deleteLineBreaks('<p dir="rtl"><br></p>')).toBe("");
  });

  it("laisse le HTML valide intact", () => {
    expect(deleteLineBreaks("<p>Contenu normal</p>")).toBe("<p>Contenu normal</p>");
  });
});

describe("deleteLineBreaksInInfosections", () => {
  it("ne crash pas sur une section vide {} (régression migration Zod)", () => {
    const sections = {
      "02aef1a8-2bd7-48c6-8682-9962b3fb3957": {},
      "ed833b0d-7bcb-4f98-b012-9c4c33ada289": {
        title: "Titre",
        text: "<p>Texte</p>",
      },
    };
    expect(() => deleteLineBreaksInInfosections(sections as any)).not.toThrow();
  });

  it("retourne undefined si sections est undefined", () => {
    expect(deleteLineBreaksInInfosections(undefined)).toEqual({});
  });

  it("traite correctement les sections avec contenu", () => {
    const sections = {
      abc123: {
        title: "Mon titre",
        text: '<p dir="ltr"><br></p><p>Contenu</p>',
      },
    };
    const result = deleteLineBreaksInInfosections(sections);
    expect(result["abc123"].text).toBe("<p>Contenu</p>");
    expect(result["abc123"].title).toBe("Mon titre");
  });
});
