import { ObjectId } from "mongodb";
import { IUserContribution, SearchDispositif, UserStructure } from "../../../types/interface";
import { FormattedUserContribution } from "./types";

export const formatContributions = (
  userContributions: IUserContribution[],
  userStructureContributions: SearchDispositif[],
  userStructure: UserStructure | null,
  userId: ObjectId | undefined
): FormattedUserContribution[] => {
  let formattedContribs: FormattedUserContribution[] = [];

  // dispositif written by user
  userContributions.forEach((dispositif) => {
    const responsabilite = [
      "Brouillon",
      "En attente",
      "Rejeté structure",
      "En attente non prioritaire",
    ].includes(dispositif.status) ? "Moi" : dispositif.mainSponsor;
    return formattedContribs.push({
      ...dispositif,
      responsabilite,
      isAuthorizedToDelete: true,
    });
  });

  // dispositif of structures of user
  const isResponsableOfStructure = (userStructure?.membres || [])
    .find(m => m._id === userId)?.roles.includes("administrateur") || false;
  userStructureContributions
    .filter((dispositif) => {
      if ( // do not show dispositif with these status
        ["Brouillon", "Supprimé", "Rejeté structure"].includes(
          dispositif.status
        )
      )
        return false;

      // and those already included before
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
        nbMercis: dispositif.nbMercis || 0,
        nbVues: dispositif.nbVues,
        _id: dispositif._id,
        status: dispositif.status,
        responsabilite: userStructure?.nom || "",
        isAuthorizedToDelete: isResponsableOfStructure
      });
    });

  return formattedContribs;
};
