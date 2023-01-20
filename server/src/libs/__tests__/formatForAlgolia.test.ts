// @ts-nocheck
import { formatForAlgolia } from "../formatForAlgolia";
import { demarche } from "../__fixtures__/demarche";
import { dispositif } from "../__fixtures__/dispositif";
import { besoin } from "../__fixtures__/besoin";
import { theme } from "../__fixtures__/theme";
import { activeLanguages } from "../__fixtures__/activeLanguages";

describe("formatForAlgolia", () => {
  it("should format a dispositif", () => {
    const res = formatForAlgolia(dispositif, [], "dispositif");
    expect(res).toEqual({
      objectID: "5ce7ab7383983700167bc9da",
      title_fr: "Parrainer un réfugié",
      title_ar: "رعاية لاجىء",
      title_ps: "یو کډوال حمایت کول",
      title_fa: "حمایت از یک پناهنده",
      title_ru: "Стать компаньоном для беженца",
      title_uk: "Спонсуйте біженця",
      abstract_fr: "Rencontrer et accompagner un réfugié dans son intégration en France.",
      abstract_ar: "التعرّف الى لاجىء و مساعدته في مسار حياته في فرنسا.",
      abstract_ps: "په فرانسه کې د ادغام او په تولنه کې د شمولیت په موخه له یو کډوال سره ووینئ او ملاتړ یې وکړئ.",
      abstract_fa: "ملاقات و حمایت از یک پناهنده در ادغام وی در فرانسه.",
      abstract_ru: "Познакомьтесь и поддержите беженца в его интеграции во Франции.",
      abstract_uk: "Зустрічайте та супроводжуйте біженця під час його інтеграції у Франції.",
      titreMarque_fr: "MAINtenant",
      titreMarque_ar: "MAINtenant",
      titreMarque_ps: "له MAINtenant سره",
      titreMarque_fa: "MAINtenant",
      titreMarque_ru: "MAINtenant",
      titreMarque_uk: "MAINtenant",
      theme: "themeId1",
      secondaryThemes: [],
      needs: [],
      nbVues: 685,
      typeContenu: "dispositif",
      sponsorUrl: "https://image.com/logo2.jpg",
      sponsorName: "Coallia",
      priority: 30,
      webOnly: false
    });
  });
  it("should format a demarche", () => {
    const res = formatForAlgolia(demarche, [], "dispositif");
    expect(res).toEqual({
      objectID: "5dd7cf3b6f0ac0004c87c8b6",
      title_fr: "Comprendre le Droit du Travail",
      abstract_fr: "Connaître et comprendre les bases du droit du travail en France",
      theme: "themeId1",
      secondaryThemes: ["themeId2"],
      needs: ["613721a409c5190dfa70d053", "614d8fb095b9b700142ee846"],
      nbVues: 383,
      typeContenu: "demarche",
      sponsorUrl: "https://image.com/logo.jpg",
      sponsorName: "France Terre d'Asile",
      priority: 40,
      webOnly: false
    });
  });
  it("should format a besoin", () => {
    const res = formatForAlgolia(besoin, activeLanguages, "need");
    expect(res).toEqual({
      objectID: "613721a409c5190dfa70d052",
      title_fr: "Obtenir des aides financières (RSA, CAF)",
      title_ps: undefined,
      title_fa: undefined,
      title_en: "Get financial aids",
      title_ti: undefined,
      title_ru: undefined,
      title_ar: undefined,
      theme: "themeId",
      typeContenu: "besoin",
      priority: 20,
      webOnly: false
    });
  });
  it("should format a theme", () => {
    const res = formatForAlgolia(theme, activeLanguages, "theme");
    expect(res).toEqual({
      objectID: "theme1",
      title_fr: "Court",
      title_ps: undefined,
      title_fa: undefined,
      title_en: "Short",
      title_ti: undefined,
      title_ru: undefined,
      title_ar: undefined,
      name_fr: "Titre theme",
      name_ps: undefined,
      name_fa: undefined,
      name_en: "Theme title",
      name_ti: undefined,
      name_ru: undefined,
      name_ar: undefined,
      typeContenu: "theme",
      priority: 10,
      webOnly: false
    });
  });
});
