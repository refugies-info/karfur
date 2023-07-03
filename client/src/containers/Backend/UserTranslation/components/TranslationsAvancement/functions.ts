import {
  ContentType,
  GetDispositifsWithTranslationAvancementResponse,
  TraductionsStatus,
} from "@refugies-info/api-types";

const filterDataExpert = (data: GetDispositifsWithTranslationAvancementResponse[], isExpert: boolean) => {
  if (isExpert) return data;
  return data.filter((trad) => ["TO_TRANSLATE", "VALIDATED"].includes(trad.tradStatus));
};

const getTradAmount = (data: GetDispositifsWithTranslationAvancementResponse[]) => {
  const nbARevoir = data.filter((trad) => trad.tradStatus === "TO_REVIEW").length;
  const nbATraduire = data.filter((trad) => trad.tradStatus === "TO_TRANSLATE").length;
  const nbAValider = data.filter((trad) => trad.tradStatus === "PENDING").length;
  const nbPubliees = data.filter((trad) => trad.tradStatus === "VALIDATED").length;

  return {
    nbARevoir,
    nbATraduire,
    nbAValider,
    nbPubliees,
  };
};

const getNbTradByTypeContenu = (data: GetDispositifsWithTranslationAvancementResponse[]) => {
  const nbDispositifs = data.filter((trad) => trad.type === "dispositif").length;
  const nbDemarches = data.filter((trad) => trad.type === "demarche").length;

  return {
    nbDispositifs,
    nbDemarches,
  };
};

const filterDataOnStatus = (
  data: GetDispositifsWithTranslationAvancementResponse[],
  filterStatus: TraductionsStatus | "all",
) => {
  if (filterStatus === "all") return data;
  return data.filter((trad) => trad.tradStatus === filterStatus);
};

const filterDataOnTypeContenu = (
  data: GetDispositifsWithTranslationAvancementResponse[],
  typeContenuFilter: ContentType | "all",
) => {
  if (typeContenuFilter === "all") return data;
  return data.filter((trad) => trad.type === typeContenuFilter);
};

const filterDataBySearch = (data: GetDispositifsWithTranslationAvancementResponse[], search: string) => {
  if (!search) {
    return data;
  }
  const text = search
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
  return data.filter(
    (dispo) =>
      (dispo.titreInformatif &&
        dispo.titreInformatif
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(text.toLowerCase())) ||
      (dispo.titreMarque &&
        dispo.titreMarque
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(text.toLowerCase())),
  );
};

export const filterData = (
  data: GetDispositifsWithTranslationAvancementResponse[],
  filterStatus: TraductionsStatus | "all",
  isExpert: boolean,
  typeContenuFilter: ContentType | "all",
  search: string,
) => {
  const dataFilteredExpert = filterDataExpert(data, isExpert);

  const dataFilteredBySearch = filterDataBySearch(dataFilteredExpert, search);

  const { nbARevoir, nbATraduire, nbAValider, nbPubliees } = getTradAmount(dataFilteredBySearch);

  const dataFilteredStatus = filterDataOnStatus(dataFilteredBySearch, filterStatus);

  const { nbDemarches, nbDispositifs } = getNbTradByTypeContenu(dataFilteredStatus);

  const dataFilteredOnTypeContenu = filterDataOnTypeContenu(dataFilteredStatus, typeContenuFilter);

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

