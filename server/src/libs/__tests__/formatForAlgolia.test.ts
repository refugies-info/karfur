// @ts-nocheck
import { formatForAlgolia } from "../formatForAlgolia";
import { demarche } from "../__fixtures__/demarche";
import { dispositif } from "../__fixtures__/dispositif";
import { besoin } from "../__fixtures__/besoin";
import { activeLanguages } from "../__fixtures__/activeLanguages";

describe("formatForAlgolia", () => {
  it("should format a dispositif", () => {
    const res = formatForAlgolia(dispositif);
    expect(res).toEqual({
      objectID: "5ce7ab7383983700167bc9da",
      title_fr: "Parrainer un réfugié",
      title_ar: "رعاية لاجىء",
      title_ps: "یو کډوال حمایت کول",
      title_fa: "حمایت از یک پناهنده",
      title_ru: "Стать компаньоном для беженца",
      abstract_fr: "Rencontrer et accompagner un réfugié dans son intégration en France.",
      abstract_ar: "التعرّف الى لاجىء و مساعدته في مسار حياته في فرنسا.",
      abstract_ps: "په فرانسه کې د ادغام او په تولنه کې د شمولیت په موخه له یو کډوال سره ووینئ او ملاتړ یې وکړئ.",
      abstract_fa: "ملاقات و حمایت از یک پناهنده در ادغام وی در فرانسه.",
      abstract_ru: "Познакомьтесь и поддержите беженца в его интеграции во Франции.",
      titreMarque_fr: "MAINtenant",
      titreMarque_ar: "MAINtenant",
      titreMarque_ps: "له MAINtenant سره",
      titreMarque_fa: "MAINtenant",
      titreMarque_ru: "MAINtenant",
      tags: [ "aider une association" ],
      needs: [],
      nbVues: 685,
      typeContenu: "dispositif",
      sponsorUrl: "https://image.com/logo2.jpg",
      sponsorName: "Coallia",
      priority: 30
    });
  });
  it("should format a demarche", () => {
    const res = formatForAlgolia(demarche);
    expect(res).toEqual({
      objectID: "5dd7cf3b6f0ac0004c87c8b6",
      title_fr: "Comprendre le Droit du Travail",
      abstract_fr: "Connaître et comprendre les bases du droit du travail en France",
      tags: [ "trouver un travail", "gérer mes papiers" ],
      needs: ["613721a409c5190dfa70d053","614d8fb095b9b700142ee846"],
      nbVues: 383,
      typeContenu: "demarche",
      sponsorUrl: "https://image.com/logo.jpg",
      sponsorName: "France Terre d'Asile",
      priority: 40
    });
  });
  it("should format a besoin", () => {
    const res = formatForAlgolia(besoin, activeLanguages);
    expect(res).toEqual({
      objectID: "613721a409c5190dfa70d052",
      title_fr: "Obtenir des aides financières (RSA, CAF)",
      title_ps: undefined,
      title_fa: undefined,
      title_en: "Get financial aids",
      "title_ti-ER": undefined,
      title_ru: undefined,
      title_ar: undefined,
      tagName: "trouver un travail",
      typeContenu: "besoin",
      priority: 20
    });
  });
});
