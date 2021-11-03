import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import { getActiveContentsFiltered } from "../../../modules/dispositif/dispositif.repository";

interface Query {
}

const extractValuesPerLanguage = (object: any, keyPrefix: string) => {
  if (!object) return {};
  const normalizedObject: any = {};
  for (const [ln, value] of Object.entries(object)) {
    normalizedObject[`${keyPrefix}_${ln}`] = value;
  }
  return normalizedObject;
}

export const getContent = async (
  req: RequestFromClient<Query>,
  res: Res
) => {
  try {
    logger.info("[getContent] received");

    const neededFields = {
      titreInformatif: 1,
      titreMarque: 1,
      abstract: 1,
      tags: 1,
      needs: 1,
      typeContenu: 1,
      nbVues: 1,
    };

    const initialQuery = { status: "Actif" };

    const contentsArray = await getActiveContentsFiltered(
      neededFields,
      initialQuery
    );

    const contentsArrayNormalized = contentsArray.map((content: any) => {
      const tags = content.tags.map((t: any) => t ? t.name : "").filter((t: any) => t !== "");
      const tagsShort = content.tags.map((t: any) => t ? t.short : "").filter((t: any) => t !== "");

      return {
        objectID: content._id,
        ...extractValuesPerLanguage(content.titreInformatif, "title"),
        ...extractValuesPerLanguage(content.titreMarque, "titreMarque"),
        ...extractValuesPerLanguage(content.abstract, "abstract"),
        tags,
        tagsShort,
        needs: content.needs,
        nbVues: content.nbVues,
        typeContenu: content.typeContenu,
        sponsorUrl: content?.mainSponsor?.picture?.secure_url,
      }
    });

    res.status(200).json({
      text: "Succès",
      data: contentsArrayNormalized
    });
  } catch (error) {
    logger.error("[getContent] error", {
      error: error.message,
    });
    res.status(500).json({ text: "KO" });
  }
};
