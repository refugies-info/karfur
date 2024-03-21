import { ObjectId } from "../../typegoose";
import { DemarcheContent, DispositifContent, TranslationContent } from "../../typegoose/Dispositif";
import {
  countWords,
  countWordsForInfoSections,
  countDispositifWords,
  countDispositifWordsForSections
} from "../wordCounter";

describe("countWords", () => {
  it("should count words", () => {
    const res = countWords("Faire une formation DU Passerelle");
    expect(res).toEqual(5);
  });
  it("should count words and remove html tags", () => {
    const res = countWords("<p>Une<strong> formation Passerelle</strong> permet aux personnes en exil (réfugiés, bénéficiaires de la protection subsidiaire et temporaire, apatrides et demandeurs d’asile) d’atteindre le niveau de français demandé pour faire des études à l’université en France.</p><div class='callout callout--important' data-callout='important'>Il existe au total 38 formations Passerelle en France. Chacune est spécifique : le nom de la formation, le niveau de français, la durée et le programme sont différents en fonction des universités.</div>");
    expect(res).toEqual(66);
  });
});

describe("countWordsForInfoSections", () => {
  it("should count words", () => {
    const res = countWordsForInfoSections({
      "1": {
        title: "Titre info",
        text: "<p>text info</p>"
      },
      "2": {
        title: "Titre info plus long",
        text: "<p>text info plus long</p>"
      }
    });
    expect(res).toEqual(12);
  });
});


describe("countDispositifWords", () => {
  it("should count words if dispositif", () => {
    const content: DispositifContent = {
      titreInformatif: "un titre",
      titreMarque: "un titre marque",
      abstract: "résumé de la fiche",
      what: "<p>texte de la fiche</p>",
      how: { "my-uuid-v4-key": { title: "titre de la section", text: "<p>texte de la section</p>" } },
      why: { "my-uuid-v4-key": { title: "titre de la première section", text: "<p>texte de la <strong>première</strong> section</p>" }, "my-uuid-v4-key-2": { title: "titre de la seconde section", text: "<p>texte de la seconde section</p>" } },
    };
    const res = countDispositifWords(content);
    expect(res).toEqual(41);
  });

  it("should count words if demarche", () => {
    const content: DemarcheContent = {
      titreInformatif: "un titre",
      titreMarque: "un titre marque",
      abstract: "résumé de la fiche",
      what: "<p>texte de la fiche</p>",
      how: { "my-uuid-v4-key": { title: "titre de la section", text: "<p>texte de la section</p>" } },
      next: { "my-uuid-v4-key": { title: "titre de la première section", text: "<p>texte de la <strong>première</strong> section</p>" }, "my-uuid-v4-key-2": { title: "titre de la seconde section", text: "<p>texte de la seconde section</p>" } },
    };
    const res = countDispositifWords(content);
    expect(res).toEqual(41);
  });
});

describe("countDispositifWordsForSections", () => {
  it("should count section words", () => {
    const content: TranslationContent = {
      content: {
        titreInformatif: "un titre",
        titreMarque: "un titre marque",
        abstract: "résumé de la fiche",
        what: "<p>texte de la fiche</p>",
        how: { "my-uuid-v4-key": { title: "titre de la section", text: "<p>texte de la section</p>" } },
        next: { "my-uuid-v4-key": { title: "titre de la première section", text: "<p>texte de la <strong>première</strong> section</p>" }, "my-uuid-v4-key-2": { title: "titre de la seconde section", text: "<p>texte de la seconde section</p>" } },
      },
      created_at: new Date(),
      validatorId: new ObjectId("656076dbaf8df7a3f7bceeb4")
    };
    const res = countDispositifWordsForSections(content, ["content.titreInformatif", "content.how.my-uuid-v4-key.title"]);
    expect(res).toEqual(6);
  });
});
