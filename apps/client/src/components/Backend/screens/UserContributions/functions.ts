import {
  GetStructureDispositifResponse,
  GetStructureResponse,
  GetUserContributionsResponse,
  Id,
} from "@refugies-info/api-types";
import { FormattedUserContribution } from "./types";

// Dispositif deletion
const isUserAuthorizedToDeleteDispositif = (
  userId: Id,
  isAdmin: boolean,
  isAuthor: boolean,
  dispositifSponsorId: Id | null,
  userStructure: GetStructureResponse | null,
) => {
  // user is admin
  if (isAdmin) return true;

  // user haven't been associated with a structure yet
  if (!userStructure) return true;

  // no sponsor yet, but user is author
  if (!dispositifSponsorId && isAuthor) return true;

  // user not in structure
  const isUserInStructure = !!dispositifSponsorId && !!userStructure && dispositifSponsorId === userStructure._id;
  if (dispositifSponsorId && !isUserInStructure) return false;

  // user is member of structure, they have the same rights as the admin
  return true;
};

export const formatContributions = (
  userContributions: GetUserContributionsResponse[],
  userStructureContributions: GetStructureDispositifResponse[],
  userStructure: GetStructureResponse | null,
  userId: Id | undefined,
  isAdmin: boolean,
): FormattedUserContribution[] => {
  let formattedContribs: FormattedUserContribution[] = [];
  if (!userId) return [];
  // dispositif written by user
  userContributions.forEach((dispositif) => {
    const responsabilite = ["Brouillon", "En attente", "Rejeté structure", "En attente non prioritaire"].includes(
      dispositif.status,
    )
      ? "Moi"
      : dispositif.mainSponsor?.nom || "";

    const isAuthorizedToDelete = isUserAuthorizedToDeleteDispositif(
      userId,
      isAdmin,
      true,
      dispositif.mainSponsor?._id || null,
      userStructure,
    );

    // If the user ins't authorized to delete we don't show the dispositif
    if (!isAuthorizedToDelete) return;

    return formattedContribs.push({
      ...dispositif,
      responsabilite,
      isAuthorizedToDelete,
    });
  });

  if (userStructure) {
    // dispositif of structures of user
    userStructureContributions
      .filter((dispositif) => {
        if (
          // do not show dispositif with these status
          ["Supprimé", "Rejeté structure"].includes(dispositif.status)
        )
          return false;

        // and those already included before
        const isDispositifInUserContributions =
          userContributions.filter((userDispo) => userDispo._id === dispositif._id).length > 0;
        if (isDispositifInUserContributions) return false;

        return true;
      })
      .forEach((dispositif) => {
        const isAuthorizedToDelete = isUserAuthorizedToDeleteDispositif(
          userId,
          isAdmin,
          false,
          userStructure._id,
          userStructure,
        );
        return formattedContribs.push({
          titreInformatif: dispositif.titreInformatif || "",
          titreMarque: dispositif.titreMarque || "",
          typeContenu: dispositif.typeContenu,
          nbMercis: dispositif.nbMercis || 0,
          nbVues: dispositif.nbVues,
          _id: dispositif._id,
          status: dispositif.status,
          responsabilite: userStructure?.nom || "",
          isAuthorizedToDelete,
          mainSponsor: {
            _id: userStructure._id,
            nom: userStructure.nom || "",
          },
          hasDraftVersion: dispositif.hasDraftVersion,
        });
      });
  }

  return formattedContribs;
};
