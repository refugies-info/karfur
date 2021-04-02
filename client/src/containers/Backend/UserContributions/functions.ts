import { IUserContribution, IDispositif } from "../../../types/interface";
import { FormattedUserContribution } from "./types";

export const formatContributions = (
  userContributions: IUserContribution[],
  userStructureContributions: IDispositif[],
  userStructureName: string | null
): FormattedUserContribution[] => {
  let formattedContribs: FormattedUserContribution[] = [];

  userContributions.forEach((dispositif) => {
    if (
      [
        "Brouillon",
        "En attente",
        "Rejeté structure",
        "En attente non prioritaire",
      ].includes(dispositif.status)
    ) {
      return formattedContribs.push({
        ...dispositif,
        responsabilite: "Moi",
        isAuthorizedToDelete: true,
      });
    }
    return formattedContribs.push({
      ...dispositif,
      responsabilite: dispositif.mainSponsor,
      isAuthorizedToDelete: false,
    });
  });

  userStructureContributions
    .filter((dispositif) => {
      if (
        ["Brouillon", "Supprimé", "Rejeté structure"].includes(
          dispositif.status
        )
      )
        return false;

      const isDispositifInUserContributions =
        userContributions.filter(
          (userDispo) => userDispo._id === dispositif._id
        ).length > 0;
      if (isDispositifInUserContributions) return false;
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
        isAuthorizedToDelete: true,
      });
    });

  return formattedContribs;
};
