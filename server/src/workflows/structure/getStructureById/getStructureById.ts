import { Picture, ResponseWithData, SimpleDispositif, Id } from "../../../types/interface";
import logger from "../../../logger";
import { getStructureById as getStructure } from "../../../modules/structure/structure.repository";
import { getUserById } from "../../../modules/users/users.repository";
import { Dispositif, Languages, Structure, User } from "../../../typegoose";
import { NotFoundError } from "src/errors";
import { FilterQuery } from "mongoose";
import { getDispositifArray } from "src/modules/dispositif/dispositif.repository";
import map from "lodash/fp/map";
import omit from "lodash/omit";
import pick from "lodash/pick";

interface Member {
  username: string;
  picture: Picture;
  last_connected: Date;
  roles: string[];
  added_at: Date;
  userId: string;
}

export interface GetStructureResponse {
  _id: Id;
  acronyme?: string;
  administrateur: Id;
  adresse?: string;
  authorBelongs?: Boolean;
  contact?: string;
  createur: Id;
  link?: string;
  mail_contact?: string;
  mail_generique?: string;
  nom: string;
  phone_contact?: string;
  siren?: string;
  siret?: string;
  status?: string;
  picture?: Picture;
  structureTypes?: string[];
  websites?: string[];
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  activities?: string[];
  departments?: string[];
  phonesPublic?: string[];
  mailsPublic?: string[];
  adressPublic?: string;
  // openingHours?: OpeningHours;
  onlyWithRdv?: Boolean;
  description?: string;
  hasResponsibleSeenNotification?: Boolean;
  disposAssociesLocalisation?: string[];
  adminComments?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus: string;

  membres: Member[];
  dispositifsAssocies: SimpleDispositif[];
}

const getMembers = async (structure: Structure) => {
  const structureMembres = structure.membres || [];
  const neededFields = { username: 1, picture: 1, last_connected: 1 };

  const members = await Promise.all(
    structureMembres.map((membre) =>
      getUserById(membre.userId.toString(), neededFields).then((user) => {
        const res: Member = {
          username: user.username,
          picture: user.picture,
          last_connected: user.last_connected,
          roles: membre.roles,
          added_at: membre.added_at,
          userId: membre.userId.toString()
        }
        return res;
      }))
  )
  return members;
};

export const getStructureById = async (
  id: string,
  locale: string,
  user: User
): ResponseWithData<GetStructureResponse> => {
  logger.info("[getStructureById] get structure with id", { id, locale });

  const structure = await getStructure(id);
  if (!structure) throw new NotFoundError("No structure");

  // members
  const isAdmin = !!(user ? user.isAdmin() : false);
  const isMember = !!(user.id
    ? (structure.membres || []).find((m) => {
      if (!m.userId) return false;
      return m.userId.toString() === user.id;
    })
    : false);
  const shouldIncludeMembers = (isAdmin || isMember);
  const structureMembers = shouldIncludeMembers ? await getMembers(structure) : [];

  // dispositifs
  const selectedLocale = (locale || "fr") as Languages;
  const dbQuery: FilterQuery<Dispositif> = {
    status: "Actif",
    mainSponsor: structure._id
  };

  const structureDispositifs = await getDispositifArray(dbQuery, {
    lastModificationDate: 1,
    mainSponsor: 1,
    needs: 1
  })
    .then(map((dispositif) => {
      const resDisp = {
        _id: dispositif._id,
        ...pick(dispositif.translations[selectedLocale].content, ["titreInformatif", "titreMarque", "abstract"]),
        metadatas: { ...dispositif.metadatas, ...dispositif.translations[selectedLocale].metadatas },
        ...omit(dispositif, ["translations"]),
      }
      return resDisp
    }))


  const result = {
    ...omit(structure, ["membres", "dispositifsAssocies"]),
    membres: structureMembers,
    dispositifsAssocies: structureDispositifs
  }

  return {
    text: "success",
    data: result
  };
};
