import { ContentType, GetDispositifsWithTranslationAvancementResponse, TraductionsStatus } from "@refugies-info/api-types";

export const data1: GetDispositifsWithTranslationAvancementResponse = {
  tradStatus: TraductionsStatus.TO_TRANSLATE,
  type: ContentType.DISPOSITIF,
  _id: "id1",
  titreInformatif: "titreInformatif1",
  titreMarque: "titreMarque1",
  nbMots: 1,
  created_at: new Date(),
  lastTradUpdatedAt: null,
  avancementTrad: 1,
  avancementValidation: 1
};

export const data2: GetDispositifsWithTranslationAvancementResponse = {
  tradStatus: TraductionsStatus.TO_TRANSLATE,
  type: ContentType.DEMARCHE,
  _id: "id2",
  titreInformatif: "titreInformatif2",
  titreMarque: "",
  nbMots: 2,
  created_at: new Date(),
  lastTradUpdatedAt: null,
  avancementTrad: 1,
  avancementValidation: 1
};
export const data3: GetDispositifsWithTranslationAvancementResponse = {
  tradStatus: TraductionsStatus.TO_REVIEW,
  type: ContentType.DISPOSITIF,
  _id: "id3",
  titreInformatif: "titreInformatif3",
  titreMarque: "titreMarque3",
  nbMots: 3,
  created_at: new Date(),
  lastTradUpdatedAt: null,
  avancementTrad: 1,
  avancementValidation: 1
};

export const data4: GetDispositifsWithTranslationAvancementResponse = {
  tradStatus: TraductionsStatus.TO_REVIEW,
  type: ContentType.DEMARCHE,
  _id: "id4",
  titreInformatif: "titreInformatif4",
  titreMarque: "",
  nbMots: 4,
  created_at: new Date(),
  lastTradUpdatedAt: null,
  avancementTrad: 1,
  avancementValidation: 1
};

export const data8: GetDispositifsWithTranslationAvancementResponse = {
  tradStatus: TraductionsStatus.PENDING,
  type: ContentType.DISPOSITIF,
  _id: "id8",
  titreInformatif: "titreInformatif8",
  titreMarque: "titreMarqué8",
  nbMots: 8,
  created_at: new Date(),
  lastTradUpdatedAt: null,
  avancementTrad: 1,
  avancementValidation: 1
};

export const data5: GetDispositifsWithTranslationAvancementResponse = {
  tradStatus: TraductionsStatus.PENDING,
  type: ContentType.DEMARCHE,
  _id: "id5",
  titreInformatif: "titreInformatif5",
  titreMarque: "",
  nbMots: 5,
  created_at: new Date(),
  lastTradUpdatedAt: null,
  avancementTrad: 1,
  avancementValidation: 1
};

export const data6: GetDispositifsWithTranslationAvancementResponse = {
  tradStatus: TraductionsStatus.VALIDATED,
  type: ContentType.DISPOSITIF,
  _id: "id6",
  titreInformatif: "titreInformatif6",
  titreMarque: "titreMarqué6",
  nbMots: 6,
  created_at: new Date(),
  lastTradUpdatedAt: null,
  avancementTrad: 1,
  avancementValidation: 1
};

export const data7: GetDispositifsWithTranslationAvancementResponse = {
  tradStatus: TraductionsStatus.VALIDATED,
  type: ContentType.DEMARCHE,
  _id: "id7",
  titreInformatif: "titreInformatif7",
  titreMarque: "",
  nbMots: 7,
  created_at: new Date(),
  lastTradUpdatedAt: null,
  avancementTrad: 1,
  avancementValidation: 1
};

export const data: GetDispositifsWithTranslationAvancementResponse[] = [data1, data2, data3, data4, data5, data6, data7, data8];
