import {
  TranslationStatus,
  IDispositifTranslation,
} from "../../../../types/interface";

export const filterData = (
  data: IDispositifTranslation[],
  filterStatus: TranslationStatus | "all",
  isExpert: boolean
) => {
  if (filterStatus === "all") {
    if (isExpert) {
      return data;
    }
    return data.filter((trad) =>
      ["À traduire", "Validée"].includes(trad.tradStatus)
    );
  }

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
