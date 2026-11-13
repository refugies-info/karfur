import { removeInvalidTranslationValues } from "./removeInvalidTranslationValues";

describe("removeInvalidTranslationValues", () => {
  it("leaves out the values of a step that are not texts", () => {
    const content: any = {
      titreInformatif: "Title",
      next: { a: { title: null, text: "" }, b: { title: "Step", text: "Text" } },
    };

    expect(removeInvalidTranslationValues(content)).toEqual({
      titreInformatif: "Title",
      next: { a: { text: "" }, b: { title: "Step", text: "Text" } },
    });
  });

  it("removes a step that has no valid value left", () => {
    const content: any = { how: { a: { title: null } } };

    expect(removeInvalidTranslationValues(content)).toEqual({ how: {} });
  });

  it("keeps titreMarque when it is null, and does not change its input", () => {
    const content: any = { titreMarque: null, why: { a: { title: null, text: "T" } } };

    expect(removeInvalidTranslationValues(content)).toEqual({
      titreMarque: null,
      why: { a: { text: "T" } },
    });
    expect(content.why.a).toEqual({ title: null, text: "T" });
  });

  it("returns a content without steps as it is", () => {
    expect(removeInvalidTranslationValues({ abstract: "Résumé" })).toEqual({ abstract: "Résumé" });
  });
});
