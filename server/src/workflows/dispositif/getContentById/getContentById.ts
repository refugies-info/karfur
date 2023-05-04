import { ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { getDispositifById, getDraftDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { NotFoundError } from "../../../errors";
import pick from "lodash/pick";
import { ContentStructure, GetDispositifResponse, Languages, SimpleUser, Sponsor } from "@refugies-info/api-types";
import { getRoles } from "../../../modules/role/role.repository";
import { Role, User } from "../../../typegoose";
import { isUserAuthorizedToModifyDispositif } from "../../../libs/checkAuthorizations";

const getRoleName = (id: string, roles: Role[]) => roles.find((r) => r._id.toString() === id.toString())?.nom || "";
const getMetadatas = (metadatas: GetDispositifResponse["metadatas"]): GetDispositifResponse["metadatas"] => {
  // remove empty metas
  const newMetas = { ...metadatas };
  if (Array.isArray(newMetas.frenchLevel) && newMetas.frenchLevel.length === 0) delete newMetas.frenchLevel;
  if (Array.isArray(newMetas.publicStatus) && newMetas.publicStatus.length === 0) delete newMetas.publicStatus;
  if (Array.isArray(newMetas.location) && newMetas.location.length === 0) delete newMetas.location;
  if (Array.isArray(newMetas.public) && newMetas.public.length === 0) delete newMetas.public;
  if (Array.isArray(newMetas.conditions) && newMetas.conditions.length === 0) delete newMetas.conditions;
  if (Array.isArray(newMetas.timeSlots) && newMetas.timeSlots.length === 0) delete newMetas.timeSlots;
  return newMetas;
};

export const getContentById = async (id: string, locale: Languages, user?: User | undefined): ResponseWithData<GetDispositifResponse> => {
  logger.info("[getContentById] called", {
    locale,
    id,
    user: user?._id
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
    lastModificationDate: 1,
    externalLink: 1,
    creatorId: 1,
    hasDraftVersion: 1
  };
  let draftDispositif = null;
  const originalDispositif = await (
    await getDispositifById(id, fields)
  ).populate<{
    mainSponsor: ContentStructure;
    sponsors: (ContentStructure | Sponsor)[];
    participants: SimpleUser[];
  }>([
    { path: "mainSponsor", select: "_id nom picture membres" },
    { path: "sponsors", select: "_id nom picture" },
    { path: "participants", select: "_id username picture roles" },
  ]);
  if (!originalDispositif) throw new NotFoundError("Dispositif not found");

  // if user logged in, and allowed to edit, load draft version instead
  const dispositifForAccessCheck = await getDispositifById( // TODO: improve that
    id, { mainSponsor: 1, creatorId: 1, status: 1 }, "mainSponsor",
  );
  if (user && isUserAuthorizedToModifyDispositif(dispositifForAccessCheck, user) && !!originalDispositif.hasDraftVersion) {
    draftDispositif = await (
      await getDraftDispositifById(id, fields)
    ).populate<{
      mainSponsor: ContentStructure;
      sponsors: (ContentStructure | Sponsor)[];
      participants: SimpleUser[];
    }>([
      { path: "mainSponsor", select: "_id nom picture" },
      { path: "sponsors", select: "_id nom picture" },
      { path: "participants", select: "_id username picture roles" },
    ]);
  }

  const dispositif = draftDispositif || originalDispositif;
  const dataLanguage = dispositif.isTranslatedIn(locale) ? locale : "fr";

  const allRoles = await getRoles();
  const participantsWithRoles = dispositif.participants.map((p) => ({
    ...pick(p, ["_id", "username", "picture"]),
    roles: p.roles.filter((r) => !!r).map((r) => getRoleName(r, allRoles)),
  }));

  const dispositifObject = dispositif.toObject();
  const response: GetDispositifResponse = {
    _id: dispositifObject._id,
    ...dispositifObject.translations[dataLanguage].content,
    participants: participantsWithRoles,
    metadatas: getMetadatas(dispositifObject.metadatas),
    availableLanguages: Object.keys(dispositifObject.translations),
    date: dispositifObject.translations[dataLanguage].created_at || dispositifObject.lastModificationDate,
    hasDraftVersion: !!draftDispositif,
    ...pick(dispositif, [
      "typeContenu",
      "lastModificationDate",
      "mainSponsor",
      "map",
      "merci",
      "needs",
      "secondaryThemes",
      "sponsors",
      "status",
      "theme",
      "externalLink",
    ]),
  };

  return { text: "success", data: response };
};
