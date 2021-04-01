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

const getTradAmount = (data: IDispositifTranslation[]) => {
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

const getNbTradByTypeContenu = (data: IDispositifTranslation[]) => {
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

const filterDataBySearch = (data: IDispositifTranslation[], search: string) => {
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
          .includes(text.toLowerCase()))
  );
};

export const filterData = (
  data: IDispositifTranslation[],
  filterStatus: TranslationStatus | "all",
  isExpert: boolean,
  typeContenuFilter: "dispositif" | "demarche" | "all",
  search: string
) => {
  const dataFilteredExpert = filterDataExpert(data, isExpert);

  const dataFilteredBySearch = filterDataBySearch(dataFilteredExpert, search);

  const { nbARevoir, nbATraduire, nbAValider, nbPubliees } = getTradAmount(
    dataFilteredBySearch
  );

  const dataFilteredStatus = filterDataOnStatus(
    dataFilteredBySearch,
    filterStatus
  );

  const { nbDemarches, nbDispositifs } = getNbTradByTypeContenu(
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

const compare = (valueA: any, valueB: any, sens: string) => {
  if (valueA > valueB) return sens === "up" ? 1 : -1;

  return sens === "up" ? -1 : 1;
};

export const sortData = (
  data: IDispositifTranslation[],
  sortedHeader: { name: string; order: string; sens: string }
) => {
  if (sortedHeader.name === "none") return data;

  const dispositifsToDisplay = data.sort((a, b) => {
    // @ts-ignore
    const valueA = a[sortedHeader.order];
    // @ts-ignore
    const valueB = b[sortedHeader.order];
    if (
      sortedHeader.order === "typeContenu" ||
      sortedHeader.order === "titreInformatif" ||
      sortedHeader.order === "tradStatus"
    ) {
      const valueAWithoutAccent = valueA
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const valueBWithoutAccent = valueB
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return compare(
        valueAWithoutAccent,
        valueBWithoutAccent,
        sortedHeader.sens
      );
    }

    return compare(valueA, valueB, sortedHeader.sens);
  });
  return dispositifsToDisplay;
};
