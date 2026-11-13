import type { TranslationContent } from "@refugies-info/mongo";
import { removeOrphanSteps } from "./traductions.business";

const frTranslation = {
  content: {
    titreInformatif: "Titre",
    next: { kept: { title: "Étape", text: "Texte" } },
    how: {},
  },
} as unknown as TranslationContent;

describe("removeOrphanSteps", () => {
  it("removes the steps that no longer exist in the French content", () => {
    const translation = {
      content: {
        titreInformatif: "Title",
        next: {
          kept: { title: "Step", text: "Text" },
          removed: { title: null, text: "" },
        },
      },
    } as unknown as TranslationContent;

    expect(removeOrphanSteps(translation, frTranslation).content).toEqual({
      titreInformatif: "Title",
      next: { kept: { title: "Step", text: "Text" } },
    });
  });

  it("drops the values that are not texts, and the steps left empty", () => {
    const translation = {
      content: { next: { kept: { title: null, text: "Text" } }, how: { gone: {} } },
    } as unknown as TranslationContent;

    expect(removeOrphanSteps(translation, frTranslation).content).toEqual({
      next: { kept: { text: "Text" } },
      how: {},
    });
  });

  it("leaves the other fields and the input untouched", () => {
    const translation = {
      content: { abstract: "Résumé", next: { removed: { title: "A", text: "B" } } },
    } as unknown as TranslationContent;

    const result = removeOrphanSteps(translation, frTranslation);

    expect(result.content).toEqual({ abstract: "Résumé", next: {} });
    expect(translation.content.next).toEqual({ removed: { title: "A", text: "B" } });
  });

  it("returns a translation without content as it is", () => {
    const translation = {} as TranslationContent;
    expect(removeOrphanSteps(translation, frTranslation)).toBe(translation);
  });
});
