import { ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { NotFoundError } from "../../../errors";
import pick from "lodash/pick";
import { ContentStructure, GetDispositifResponse, Languages, SimpleUser, Sponsor } from "api-types";

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
    { path: "participants", select: "_id username picture" },
  ]);
  if (!dispositif) throw new NotFoundError("Dispositif not found");
  const dataLanguage = dispositif.isTranslatedIn(locale) ? locale : "fr";

  const dispositifObject = dispositif.toObject();
  const response: GetDispositifResponse = {
    _id: dispositifObject._id,
    ...dispositifObject.translations[dataLanguage].content,
    metadatas: { ...dispositifObject.metadatas, ...dispositifObject.translations[dataLanguage].metadatas },
    ...pick(dispositif, [
      "typeContenu",
      "status",
      "mainSponsor",
      "theme",
      "secondaryThemes",
      "needs",
      "sponsors",
      "participants",
      "merci",
      "map",
    ]),
  };

  return { text: "success", data: response };
};
