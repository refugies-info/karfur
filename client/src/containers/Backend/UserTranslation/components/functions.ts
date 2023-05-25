import {
  ContentType,
  GetDispositifsWithTranslationAvancementResponse,
  GetNeedResponse,
  TraductionsStatus,
} from "@refugies-info/api-types";
import { colors } from "colors";
import { AvailableLanguageI18nCode } from "types/interface";

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

const compare = (valueA: any, valueB: any, sens: string) => {
  if (valueA > valueB) return sens === "up" ? 1 : -1;

  return sens === "up" ? -1 : 1;
};

export const sortData = (
  data: GetDispositifsWithTranslationAvancementResponse[],
  sortedHeader: { name: string; order: string; sens: string },
) => {
  if (sortedHeader.name === "none") return data;

  const dispositifsToDisplay = data.sort((a, b) => {
    // @ts-ignore
    const valueA = a[sortedHeader.order];
    // @ts-ignore
    const valueB = b[sortedHeader.order];
    if (
      sortedHeader.order === "type" ||
      sortedHeader.order === "titreInformatif" ||
      sortedHeader.order === "tradStatus"
    ) {
      const valueAWithoutAccent = valueA.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const valueBWithoutAccent = valueB.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return compare(valueAWithoutAccent, valueBWithoutAccent, sortedHeader.sens);
    }

    return compare(valueA, valueB, sortedHeader.sens);
  });
  return dispositifsToDisplay;
};

const isNotTranslated = (need: GetNeedResponse, ln: AvailableLanguageI18nCode) => {
  return (
    !need[ln]?.text || // no title translated
    (need.fr.subtitle && !need[ln]?.subtitle)
  ); // or no subtitle if defined in french
};

const isTranslationOutdated = (need: GetNeedResponse, ln: AvailableLanguageI18nCode) => {
  const translationUpdatedAt = need[ln]?.updatedAt;
  if (!need.fr.updatedAt || !translationUpdatedAt) return true;
  return need.fr.updatedAt > translationUpdatedAt;
};

export const getStatusColorAndText = (need: GetNeedResponse, langueI18nCode: AvailableLanguageI18nCode) => {
  if (!langueI18nCode) {
    return { statusColor: colors.darkGrey, statusText: "Erreur" };
  }

  if (isNotTranslated(need, langueI18nCode)) {
    return { statusColor: colors.blue, statusText: "À traduire" };
  }

  if (isTranslationOutdated(need, langueI18nCode)) {
    return { statusColor: colors.rouge, statusText: "À revoir" };
  }

  return { statusColor: colors.green, statusText: "À jour" };
};
