import { /*ExcludeMethods,  Picture, */ ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { getStructure } from "../../../modules/structure/structure.repository";
import { getUserById } from "../../../modules/users/users.repository";
import { availableLanguagesWithFr } from "../../../libs/getFormattedLocale";
import { Structure, User } from "../../../typegoose";
// import { Membre } from "../../../typegoose/Structure";

export type StructureById = any /* FIXME ExcludeMethods<Structure> & {
  membres?: Array<Membre & { username: string; picture: Picture; last_connected: Date }>;
};*/

const addMembresIfNeeded = async (withMembresBoolean: boolean, structure: Structure) => {
  if (withMembresBoolean) {
    const structureMembres = structure.membres || [];
    const neededFields = { username: 1, picture: 1, last_connected: 1 };

    const membres = await Promise.all(
      structureMembres.map((membre) =>
        getUserById(membre.userId.toString(), neededFields).then((user) => ({
          username: user.username,
          picture: user.picture,
          last_connected: user.last_connected,
          roles: membre.roles,
          added_at: membre.added_at,
          userId: membre.userId.toString()
        }))
      )
    );

    return { ...structure, membres };
  }
  const newStructure = { ...structure };
  delete newStructure.membres;
  return newStructure;
};

export const getStructureById = async (
  id: string,
  withDisposAssocies: boolean,
  localeOfLocalizedDispositifsAssocies: string,
  withMembres: boolean,
  user: User
): ResponseWithData<StructureById> => {
  // const withDisposAssociesBoolean = castToBoolean(withDisposAssocies);
  // const withMembresBoolean = castToBoolean(withMembres);

  const withLocalizedDispositifsBoolean = availableLanguagesWithFr.includes(localeOfLocalizedDispositifsAssocies);

  logger.info("[getStructureById] get structure with id", {
    id,
    withDisposAssocies,
    withLocalizedDispositifsBoolean,
    localeOfLocalizedDispositifsAssocies,
    withMembres
  });

  const populateDisposAssocies = withLocalizedDispositifsBoolean ? true : withDisposAssocies ? true : false;

  const fields = {};
  const structure = await getStructure(id, populateDisposAssocies, fields);
  if (!structure) {
    throw new Error("No structure");
  }

  const isAdmin = !!(user ? user.isAdmin() : false);
  const isMember = !!(user.id
    ? (structure.membres || []).find((m) => {
      if (!m.userId) return false;
      return m.userId.toString() === user.id;
    })
    : false);
  const shouldIncludeMembers = (isAdmin || isMember) && withMembres;

  const structureWithMembres = await addMembresIfNeeded(shouldIncludeMembers, structure);

  return {
    text: "success",
    // @ts-ignore
    data: structureWithMembres
  };
};
