import { ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { NotFoundError } from "../../../errors";
import pick from "lodash/pick";
import { ContentStructure, GetDispositifResponse, Languages, SimpleUser, Sponsor } from "api-types";
import { getRoles } from "../../../modules/role/role.repository";
import { Role } from "src/typegoose";

const getRoleName = (id: string, roles: Role[]) => roles.find(r => r._id.toString() === id.toString())?.nom || ""

export const getContentById = async (id: string, locale: Languages): ResponseWithData<GetDispositifResponse> => {
  logger.info("[getContentById] called", {
    locale,
    id,
  });

  const fields = {
    typeContenu: 1,
    status: 1,
    mainSponsor: 1,
    theme: 1,
    secondaryThemes: 1,
    needs: 1,
    sponsors: 1,
    participants: 1,
    merci: 1,
    translations: 1,
    metadatas: 1,
    map: 1,
  };

  const dispositif = await (
    await getDispositifById(id, fields)
  ).populate<{
    mainSponsor: ContentStructure;
    sponsors: (ContentStructure | Sponsor)[];
    participants: SimpleUser[];
  }>([
    { path: "mainSponsor", select: "_id nom picture" },
    { path: "sponsors", select: "_id nom picture" }, // TODO: why not sent?
    { path: "participants", select: "_id username picture roles" },
  ]);
  if (!dispositif) throw new NotFoundError("Dispositif not found");
  const dataLanguage = dispositif.isTranslatedIn(locale) ? locale : "fr";

  const allRoles = await getRoles();
  const participantsWithRoles = dispositif.participants.map(p => ({
    ...pick(p, ["_id", "username", "picture"]),
    roles: p.roles.filter(r => !!r).map(r => getRoleName(r, allRoles))
  }))

  const dispositifObject = dispositif.toObject();
  const response: GetDispositifResponse = {
    _id: dispositifObject._id,
    ...dispositifObject.translations[dataLanguage].content,
    participants: participantsWithRoles,
    metadatas: { ...dispositifObject.metadatas, ...dispositifObject.translations[dataLanguage].metadatas },
    availableLanguages: Object.keys(dispositifObject.translations),
    date: dispositifObject.translations[dataLanguage].created_at,
    ...pick(dispositif, [
      "typeContenu",
      "status",
      "mainSponsor",
      "theme",
      "secondaryThemes",
      "needs",
      "sponsors",
      "merci",
      "map",
    ]),
  };

  return { text: "success", data: response };
};
