import { GetDispositifsWithTranslationAvancementResponse } from "@refugies-info/api-types";

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

    if (sortedHeader.order === "avancementTrad" || sortedHeader.order === "avancementValidation") {
      return compare(a[sortedHeader.order] / a.nbMots, b[sortedHeader.order] / b.nbMots, sortedHeader.sens);
    }

    return compare(valueA, valueB, sortedHeader.sens);
  });
  return dispositifsToDisplay;
};
