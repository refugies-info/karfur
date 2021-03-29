import {
  TranslationStatus,
  IDispositifTranslation,
} from "../../../../types/interface";

export const filterData = (
  data: IDispositifTranslation[],
  filterStatus: TranslationStatus | "all"
) => {
  if (filterStatus === "all") return data;

  return data.filter((trad) => trad.tradStatus === filterStatus);
};

export const getTradAmount = (data: IDispositifTranslation[]) => {
  const nbARevoir = data.filter((trad) => trad.tradStatus === "À revoir")
    .length;
  const nbATraduire = data.filter((trad) => trad.tradStatus === "À traduire")
    .length;
  const nbAValider = data.filter((trad) => trad.tradStatus === "En attente")
    .length;
  const nbPubliees = data.filter((trad) => trad.tradStatus === "Validée")
    .length;

  return { nbARevoir, nbATraduire, nbAValider, nbPubliees };
};
