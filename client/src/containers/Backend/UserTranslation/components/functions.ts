import {
  TranslationStatus,
  IDispositifTranslation,
  ITypeContenu,
} from "../../../../types/interface";

const filterDataExpert = (
  data: IDispositifTranslation[],
  isExpert: boolean
) => {
  if (isExpert) return data;
  return data.filter((trad) =>
    ["À traduire", "Validée"].includes(trad.tradStatus)
  );
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

  return {
    nbARevoir,
    nbATraduire,
    nbAValider,
    nbPubliees,
  };
};

export const getNbTradByTypeContenu = (data: IDispositifTranslation[]) => {
  const nbDispositifs = data.filter((trad) => trad.typeContenu === "dispositif")
    .length;
  const nbDemarches = data.filter((trad) => trad.typeContenu === "demarche")
    .length;

  return {
    nbDispositifs,
    nbDemarches,
  };
};

const filterDataOnStatus = (
  data: IDispositifTranslation[],
  filterStatus: TranslationStatus | "all"
) => {
  if (filterStatus === "all") return data;
  return data.filter((trad) => trad.tradStatus === filterStatus);
};

const filterDataOnTypeContenu = (
  data: IDispositifTranslation[],
  typeContenuFilter: ITypeContenu | "all"
) => {
  if (typeContenuFilter === "all") return data;
  return data.filter((trad) => trad.typeContenu === typeContenuFilter);
};

export const filterData = (
  data: IDispositifTranslation[],
  filterStatus: TranslationStatus | "all",
  isExpert: boolean,
  typeContenuFilter: "dispositif" | "demarche" | "all"
) => {
  const dataFilteredExpert = filterDataExpert(data, isExpert);

  const dataFilteredStatus = filterDataOnStatus(
    dataFilteredExpert,
    filterStatus
  );

  const { nbDemarches, nbDispositifs } = getNbTradByTypeContenu(
    dataFilteredStatus
  );
  const { nbARevoir, nbATraduire, nbAValider, nbPubliees } = getTradAmount(
    dataFilteredStatus
  );

  const dataFilteredOnTypeContenu = filterDataOnTypeContenu(
    dataFilteredStatus,
    typeContenuFilter
  );

  return {
    dataToDisplay: dataFilteredOnTypeContenu,
    nbARevoir,
    nbATraduire,
    nbAValider,
    nbPubliees,
    nbDispositifs,
    nbDemarches,
  };
};
