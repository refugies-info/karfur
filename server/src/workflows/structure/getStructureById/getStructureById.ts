import { FilterQuery } from "mongoose";
import { ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { getStructureById as getStructure } from "../../../modules/structure/structure.repository";
import { getUserById } from "../../../modules/users/users.repository";
import { Dispositif, Structure, User } from "../../../typegoose";
import { NotFoundError } from "../../../errors";
import { getSimpleDispositifs } from "../../../modules/dispositif/dispositif.repository";
import { GetStructureResponse, Languages, StructureMember } from "@refugies-info/api-types";
import { Membre } from "../../../typegoose/Structure";

const getMainRole = (membre: Membre) => {
  if (membre.roles.includes("administrateur")) return "Responsable";
  if (membre.roles.includes("contributeur")) return "Rédacteur";
  return "Exclu";
}

const getMembers = async (structure: Structure) => {
  const structureMembres = structure.membres || [];
  const neededFields = { username: 1, picture: 1, last_connected: 1, roles: 1, added_at: 1 };

  const members = await Promise.all(
    structureMembres.map((membre) =>
      getUserById(membre.userId.toString(), neededFields).then((user) => {
        const res: StructureMember = {
          username: user.username,
          picture: user.picture,
          last_connected: user.last_connected,
          roles: membre.roles,
          added_at: membre.added_at,
          userId: membre.userId.toString(),
          mainRole: getMainRole(membre)
        };
        return res;
      }),
    ),
  );
  return members;
};

export const getStructureById = async (
  id: string,
  locale: string,
  user: User,
): ResponseWithData<GetStructureResponse> => {
  logger.info("[getStructureById] get structure with id", { id, locale });

  const structure = await getStructure(id);
  if (!structure) throw new NotFoundError("No structure");

  // members
  const isAdmin = !!(user ? user.isAdmin() : false);
  const isMember = !!(user?._id
    ? (structure.membres || []).find((m) => {
      if (!m.userId) return false;
      return m.userId.toString() === user._id.toString();
    })
    : false);
  const shouldIncludeMembers = isAdmin || isMember;
  const structureMembers = shouldIncludeMembers ? await getMembers(structure) : [];

  // dispositifs
  const selectedLocale = (locale || "fr") as Languages;
  const dbQuery: FilterQuery<Dispositif> = {
    status: "Actif",
    mainSponsor: structure._id,
  };

  const structureDispositifs = await getSimpleDispositifs(dbQuery, selectedLocale);
  const result: GetStructureResponse = {
    ...structure.toObject(),
    membres: structureMembers,
    dispositifsAssocies: structureDispositifs,
  };

  return {
    text: "success",
    data: result,
  };
};
