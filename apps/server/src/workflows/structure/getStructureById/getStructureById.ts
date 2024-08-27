import {
  DispositifStatus,
  GetStructureResponse,
  Languages,
  StructureMember,
  StructureMemberRole,
} from "@refugies-info/api-types";
import { omit } from "lodash";
import { FilterQuery } from "mongoose";
import { NotFoundError } from "~/errors";
import logger from "~/logger";
import { getStructureDispositifs } from "~/modules/dispositif/dispositif.repository";
import { getStructureById as getStructure } from "~/modules/structure/structure.repository";
import { getUserById } from "~/modules/users/users.repository";
import { Dispositif, Structure, User } from "~/typegoose";
import { Membre } from "~/typegoose/Structure";
import { ResponseWithData } from "~/types/interface";

const getMainRole = (membre: Membre) => {
  if (membre.roles.includes(StructureMemberRole.ADMIN)) return "Responsable";
  if (membre.roles.includes(StructureMemberRole.CONTRIB)) return "Rédacteur";
  return "Exclu";
};

const getMembers = async (structure: Structure) => {
  const structureMembres = structure.membres || [];
  const neededFields = { username: 1, email: 1, picture: 1, last_connected: 1, roles: 1, added_at: 1 };

  const members = await Promise.all(
    structureMembres.map((membre) =>
      getUserById(membre.userId.toString(), neededFields).then((user) => {
        if (!user) return null;
        const res: StructureMember = {
          username: user.username,
          email: user.email,
          picture: user.picture,
          last_connected: user.last_connected,
          roles: membre.roles,
          added_at: membre.added_at,
          userId: membre.userId.toString(),
          mainRole: getMainRole(membre),
        };
        return res;
      }),
    ),
  );
  return members.filter((u) => !!u);
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
    status:
      isAdmin || isMember
        ? {
            $in: [
              DispositifStatus.DRAFT,
              DispositifStatus.OK_STRUCTURE,
              DispositifStatus.WAITING_STRUCTURE,
              DispositifStatus.WAITING_ADMIN,
              DispositifStatus.ACTIVE,
            ],
          }
        : DispositifStatus.ACTIVE,
    mainSponsor: structure._id,
  };

  const structureDispositifs = await getStructureDispositifs(dbQuery, selectedLocale);
  const result: GetStructureResponse = {
    ...structure.toObject(),
    membres: structureMembers,
    dispositifsAssocies: structureDispositifs.map((dispositif) =>
      !isAdmin && !isMember ? omit(dispositif, ["nbMercis", "suggestions"]) : dispositif,
    ),
  };

  return {
    text: "success",
    data: result,
  };
};
