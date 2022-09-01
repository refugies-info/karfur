import { correspondingStatus } from "../data";
import {
  SimplifiedCreator,
  SimplifiedMainSponsor,
  SimplifiedStructureForAdmin,
  SimplifiedUser,
} from "../../../../../types/interface";

export const getUsersToSendMail = (
  status: string,
  creatorId: SimplifiedCreator | null,
  mainSponsor: null | SimplifiedMainSponsor,
  users: SimplifiedUser[],
  structures: SimplifiedStructureForAdmin[]
) => {
  if (status === "En attente" && creatorId) {
    return [{...creatorId, roles: ["Créateur"]}];
  }

  if (["En attente admin", "Accepté structure"].includes(status)) {
    const sponsorId = mainSponsor ? mainSponsor._id : null;
    if (!sponsorId) return [];

    const structureArray = structures.filter(
      (structure) => structure._id === sponsorId
    );

    if (structureArray.length === 0) return [];
    const structure = structureArray[0];

    if (!structure.membres) return [];

    let result: SimplifiedCreator[] = [];

    structure.membres.forEach((membre) => {
      const membreId = membre.userId;
      if (!membreId) return;
      const membreWithDetailsArray = users.filter(
        (user) => user._id === membreId
      );
      if (membreWithDetailsArray.length === 0) return;
      result.push({
        username: membreWithDetailsArray[0].username,
        _id: membreWithDetailsArray[0]._id,
        email: membreWithDetailsArray[0].email,
        picture: membreWithDetailsArray[0].picture,
        roles: membreWithDetailsArray[0].roles
      });
    });

    return result;
  }
  return [];
};

export const getFormattedStatus = (dispoStatus: string) => {
  const corresStatus = correspondingStatus.filter(
    (status) => status.storedStatus === dispoStatus
  );
  return corresStatus[0];
};

export const getTitle = (
  titreInformatif: string,
  typeContenu: string,
  titreMarque: string | undefined
) => {
  if (typeContenu === "dispositif") {
    return titreInformatif + " avec " + titreMarque;
  }
  return titreInformatif;
};
