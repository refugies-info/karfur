import {
  type ContentStructure,
  ContentType,
  type DemarcheContent,
  DispositifStatus,
  type GetDispositifResponse,
  type Id,
  type Languages,
  type SimpleUser,
  type Sponsor,
} from "@refugies-info/api-types";
import type { Dispositif, Role, Structure, User } from "@refugies-info/mongo";
import { isDocument, isDocumentArray } from "@refugies-info/mongo";
import pick from "lodash/pick";
import type { ProjectionType } from "mongoose";
import { NotFoundError } from "~/errors";
import { isUserAuthorizedToModifyDispositif } from "~/libs/checkAuthorizations";
import logger from "~/logger";
import {
  getDispositifMainSponsor,
  isDispositifTranslatedIn,
} from "~/modules/dispositif/dispositif.business";
import {
  getDispositifById,
  getDraftDispositifById,
} from "~/modules/dispositif/dispositif.repository";
import { getRoles } from "~/modules/role/role.repository";
import type { ResponseWithData } from "~/types/interface";

const getRoleName = (id: string, roles: Role[]) =>
  roles.find((r) => r._id.toString() === id.toString())?.nom || "";
const getMetadatas = (
  metadatas: GetDispositifResponse["metadatas"],
): GetDispositifResponse["metadatas"] => {
  // remove empty metas
  const newMetas = { ...metadatas };
  if (Array.isArray(newMetas.frenchLevel) && newMetas.frenchLevel.length === 0)
    delete newMetas.frenchLevel;
  if (Array.isArray(newMetas.publicStatus) && newMetas.publicStatus.length === 0)
    delete newMetas.publicStatus;
  if (Array.isArray(newMetas.location) && newMetas.location.length === 0) delete newMetas.location;
  if (Array.isArray(newMetas.public) && newMetas.public.length === 0) delete newMetas.public;
  if (Array.isArray(newMetas.conditions) && newMetas.conditions.length === 0)
    delete newMetas.conditions;
  if (Array.isArray(newMetas.timeSlots) && newMetas.timeSlots.length === 0)
    delete newMetas.timeSlots;
  return newMetas;
};

const canViewDispositif = (dispositif: Dispositif, user?: User): boolean => {
  if (dispositif.status === DispositifStatus.ACTIVE) return true;
  if (user?.isAdmin()) return true;

  // is part of structure: OK
  const sponsor: Structure | null = dispositif.mainSponsor
    ? getDispositifMainSponsor(dispositif) || null
    : null;
  const isMemberOfStructure =
    user &&
    !!(sponsor?.membres || []).find(
      (membre) => membre.userId && membre.userId.toString() === user._id.toString(),
    );
  if (isMemberOfStructure) return true;

  // if author: OK while the structure has not accepted the dispositif
  const isAuthor = user && dispositif.creatorId.toString() === user._id.toString();
  if (
    isAuthor &&
    [DispositifStatus.DRAFT, DispositifStatus.DELETED, DispositifStatus.WAITING_STRUCTURE].includes(
      dispositif.status,
    )
  )
    return true;

  // if no members yet, user just created the structure: OK
  const noMembersYet = sponsor && (sponsor.membres || []).length === 0;
  if (isAuthor && noMembersYet && dispositif.status === DispositifStatus.WAITING_ADMIN) {
    return true;
  }

  return false;
};

export const getContentById = async (
  id: string,
  locale: Languages,
  user?: User | undefined,
): ResponseWithData<GetDispositifResponse> => {
  logger.info("[getContentById] called", {
    locale,
    id,
    user: user?._id,
  });

  const fields: ProjectionType<Dispositif> = {
    typeContenu: 1,
    status: 1,
    mainSponsor: 1,
    theme: 1,
    secondaryThemes: 1,
    needs: 1,
    sponsors: 1,
    participants: 1,
    merci: 1,
    avis: 1,
    translations: 1,
    metadatas: 1,
    map: 1,
    lastModificationDate: 1,
    externalLink: 1,
    creatorId: 1,
    hasDraftVersion: 1,
    administrationLogo: 1,
    origin: 1,
  };
  let draftDispositif = null;
  const originalDispositif = await (await getDispositifById(id, fields))?.populate<{
    mainSponsor: ContentStructure;
    sponsors: (ContentStructure | Sponsor)[];
    participants: SimpleUser[];
    creatorId: { _id: Id; username: string };
  }>([
    { path: "mainSponsor", select: "_id nom picture membres link acronyme" },
    { path: "sponsors", select: "_id nom picture" },
    { path: "participants", select: "_id username picture roles" },
    { path: "creatorId", select: "_id username" },
  ]);
  if (!originalDispositif) throw new NotFoundError("Dispositif not found");

  // if user logged in, and allowed to edit, load draft version instead
  const dispositifForAccessCheck = await getDispositifById(
    id,
    { mainSponsor: 1, creatorId: 1, status: 1 },
    "mainSponsor",
  );
  if (!canViewDispositif(dispositifForAccessCheck, user))
    throw new NotFoundError("Dispositif not found");
  if (
    user &&
    isUserAuthorizedToModifyDispositif(
      dispositifForAccessCheck,
      user,
      !!originalDispositif.hasDraftVersion,
    ) &&
    !!originalDispositif.hasDraftVersion
  ) {
    draftDispositif = await (await getDraftDispositifById(id, fields))?.populate<{
      mainSponsor: ContentStructure;
      sponsors: (ContentStructure | Sponsor)[];
      participants: SimpleUser[];
      creatorId: { _id: Id; username: string };
    }>([
      { path: "mainSponsor", select: "_id nom picture link acronyme" },
      { path: "sponsors", select: "_id nom picture" },
      { path: "participants", select: "_id username picture roles" },
      { path: "creatorId", select: "_id username" },
    ]);
  }

  const dispositif = draftDispositif || originalDispositif;
  const dataLanguage = isDispositifTranslatedIn(originalDispositif as any, locale) ? locale : "fr"; // find translation in published version only

  const allRoles = await getRoles();
  const participantsWithRoles = dispositif.participants.map((p) => ({
    ...pick(p, ["_id", "username", "picture"]),
    roles: p.roles.filter((r) => !!r).map((r) => getRoleName(r, allRoles)),
  }));

  const originalDispositifObject = originalDispositif.toObject();
  const dispositifObject = dispositif.toObject();

  const translation =
    dataLanguage === "fr"
      ? dispositifObject.translations?.[dataLanguage]
      : originalDispositifObject.translations?.[dataLanguage];

  if (!translation) {
    logger.error("[getContentById] translation missing", {
      id,
      dataLanguage,
      hasTranslations: !!(dispositifObject.translations || originalDispositifObject.translations),
    });
    throw new NotFoundError("Translation not found");
  }

  const response: any = {
    _id: dispositifObject._id,
    ...translation.content,
    participants: participantsWithRoles,
    metadatas: getMetadatas(dispositifObject.metadatas as any),
    availableLanguages: Object.keys(originalDispositifObject.translations || {}), // show available languages of published version only
    date: translation.created_at || dispositifObject.lastModificationDate,
    hasDraftVersion: !!draftDispositif,
    ...pick(dispositif, [
      "typeContenu",
      "lastModificationDate",
      "mainSponsor",
      "map",
      "merci",
      "avis",
      "needs",
      "secondaryThemes",
      "sponsors",
      "status",
      "theme",
      "externalLink",
      "creatorId",
      "origin",
    ]),
  } as unknown as GetDispositifResponse;

  if (dispositif.typeContenu === ContentType.DEMARCHE) {
    response.administration = {
      name: (translation.content as DemarcheContent).administrationName,
      logo: dispositif.administrationLogo,
    };
  }

  return { text: "success", data: response };
};
