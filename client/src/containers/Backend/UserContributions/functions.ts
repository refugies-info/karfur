import { IUserContribution, IDispositif } from "../../../types/interface";
import { FormattedUserContribution } from "./types";

export const formatContributions = (
  userContributions: IUserContribution[],
  userStructureContributions: IDispositif[],
  userStructureName: string | null
): FormattedUserContribution[] => {
  let formattedContribs: FormattedUserContribution[] = [];

  userContributions.forEach((dispositif) => {
    if (["Brouillon", "En attente"].includes(dispositif.status)) {
      return formattedContribs.push({ ...dispositif, responsabilite: "Moi" });
    }
    return formattedContribs.push({
      ...dispositif,
      responsabilite: dispositif.mainSponsor,
    });
  });

  userStructureContributions
    .filter((dispositif) => {
      if (["Brouillon", "Supprimé"].includes(dispositif.status)) return false;

      if (dispositif.status === "En attente") {
        const isDispositifInUserContributions =
          userContributions.filter(
            (userDispo) => userDispo._id === dispositif._id
          ).length > 0;
        if (isDispositifInUserContributions) return false;
      }
      return true;
    })
    .forEach((dispositif) => {
      return formattedContribs.push({
        titreInformatif: dispositif.titreInformatif,
        titreMarque: dispositif.titreMarque,
        typeContenu: dispositif.typeContenu,
        nbMercis: dispositif.nbMercis,
        nbVues: dispositif.nbVues,
        _id: dispositif._id,
        status: dispositif.status,
        responsabilite: userStructureName,
      });
    });

  return formattedContribs;
};
