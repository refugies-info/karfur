import { GetStructureDispositifResponse, GetStructureResponse, GetUserContributionsResponse, Id, StructureMemberRole } from "@refugies-info/api-types";
import { FormattedUserContribution } from "./types";

// Dispositif deletion
const isUserAuthorizedToDeleteDispositif = (
  userId: Id,
  isAdmin: boolean,
  isAuthor: boolean,
  dispositifSponsorId: Id | null,
  userStructure: GetStructureResponse | null
) => {
  // user is admin
  if (isAdmin) return true;

  if (!dispositifSponsorId && isAuthor) return true; // no sponsor yet, but user is author

  const isUserInStructure = !!dispositifSponsorId && !!userStructure && dispositifSponsorId === userStructure._id;
  if (dispositifSponsorId && !isUserInStructure) return false; // user not in structure

  // user is responsable of structure
  const userInStructure = userStructure && userStructure.membres.find((membre) => membre.userId?.toString() === userId);
  if (userInStructure?.roles.includes(StructureMemberRole.ADMIN)) {
    return true;
  }

  // user is redacteur of structure and author
  if (userInStructure?.roles.includes(StructureMemberRole.CONTRIB) && isAuthor) {
    return true;
  }
  return false;
};

export const formatContributions = (
  userContributions: GetUserContributionsResponse[],
  userStructureContributions: GetStructureDispositifResponse[],
  userStructure: GetStructureResponse | null,
  userId: Id | undefined,
  isAdmin: boolean
): FormattedUserContribution[] => {
  let formattedContribs: FormattedUserContribution[] = [];
  if (!userId) return [];
  // dispositif written by user
  userContributions.forEach((dispositif) => {
    const responsabilite = [
      "Brouillon",
      "En attente",
      "Rejeté structure",
      "En attente non prioritaire",
    ].includes(dispositif.status) ? "Moi" : dispositif.mainSponsor?.nom || "";
    const isAuthorizedToDelete = isUserAuthorizedToDeleteDispositif(userId, isAdmin, true, dispositif.mainSponsor?._id || null, userStructure);
    return formattedContribs.push({
      ...dispositif,
      responsabilite,
      isAuthorizedToDelete
    });
  });

  if (userStructure) {
    // dispositif of structures of user
    userStructureContributions
      .filter((dispositif) => {
        if ( // do not show dispositif with these status
          ["Supprimé", "Rejeté structure"].includes(
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
        const isAuthorizedToDelete = isUserAuthorizedToDeleteDispositif(userId, isAdmin, false, userStructure._id, userStructure);
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
            nom: userStructure.nom || ""
          },
          hasDraftVersion: dispositif.hasDraftVersion
        });
      });
  }

  return formattedContribs;
};
