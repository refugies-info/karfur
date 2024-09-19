import {
  ContentType,
  GetDispositifsWithTranslationAvancementResponse,
  TraductionsStatus,
} from "@refugies-info/api-types";

const content1 = {
  avancementTrad: 700,
  avancementValidation: 0,
  created_at: new Date("2019-11-08T10:53:52.398Z"),
  lastTradUpdatedAt: 1612514769665,
  nbMots: 812,
  titreInformatif: "Demander un logement social (HLM)",
  titreMarque: "",
  tradStatus: TraductionsStatus.TO_REVIEW,
  type: ContentType.DEMARCHE,
  _id: "id1",
};

const content2 = {
  avancementTrad: 812,
  avancementValidation: 406,
  created_at: new Date("2019-11-08T10:53:52.398Z"),
  lastTradUpdatedAt: 1612514769665,
  nbMots: 812,
  titreInformatif: "T2",
  titreMarque: "TM2",
  tradStatus: TraductionsStatus.PENDING,
  type: ContentType.DISPOSITIF,
  _id: "id2",
};
const content3 = {
  avancementTrad: 0,
  avancementValidation: 0,
  created_at: new Date("2019-11-08T10:53:52.398Z"),
  lastTradUpdatedAt: 1612514769665,
  nbMots: 812,
  titreInformatif: "T3",
  titreMarque: "TM3",
  tradStatus: TraductionsStatus.TO_TRANSLATE,
  type: ContentType.DISPOSITIF,
  _id: "id3",
};

const content4 = {
  avancementTrad: 812,
  avancementValidation: 0,
  created_at: new Date("2019-11-08T10:53:52.398Z"),
  lastTradUpdatedAt: 1612514769665,
  nbMots: 812,
  titreInformatif: "T4",
  titreMarque: "TM4",
  tradStatus: TraductionsStatus.VALIDATED,
  type: ContentType.DEMARCHE,
  _id: "id4",
};

const content5 = {
  avancementTrad: 812,
  avancementValidation: 0,
  created_at: new Date("2019-11-08T10:53:52.398Z"),
  lastTradUpdatedAt: 1612514769665,
  nbMots: 812,
  titreInformatif: "T5",
  titreMarque: "TM5",
  tradStatus: TraductionsStatus.TO_TRANSLATE,
  type: ContentType.DEMARCHE,
  _id: "id5",
};

const content6 = {
  avancementTrad: 700,
  avancementValidation: 0,
  created_at: new Date("2019-11-08T10:53:52.398Z"),
  lastTradUpdatedAt: 1612514769665,
  nbMots: 812,
  titreInformatif: "TI6",
  titreMarque: "TM6",
  tradStatus: TraductionsStatus.TO_REVIEW,
  type: ContentType.DISPOSITIF,
  _id: "id6",
};

export const dispositifsWithTranslations: GetDispositifsWithTranslationAvancementResponse[] = [
  content1,
  content2,
  content3,
  content4,
  content5,
  content6,
];
