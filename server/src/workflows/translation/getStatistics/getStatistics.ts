import { celebrate, Joi, Segments } from "celebrate";
import logger from "../../../logger";
import { getAllUsersFromDB } from "../../../modules/users/users.repository";
import { getNbWordsTranslated } from "../../../modules/traductions/traductions.repository";
import { Res, RequestFromClient } from "../../../types/interface";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { User } from "src/typegoose";

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

type Facets = "nbTranslators" | "nbRedactors" | "nbWordsTranslated" | "nbActiveTranslators";
interface Statistics {
  nbTranslators?: number;
  nbRedactors?: number;
  nbWordsTranslated?: number;
  nbActiveTranslators?: {
    languageId: string;
    count: number;
  }[];
}

const validator = celebrate({
  [Segments.QUERY]: Joi.object({
    facets: Joi.array().items(
      Joi.string().valid("nbTranslators", "nbRedactors", "nbWordsTranslated", "nbActiveTranslators")
    )
  })
});

interface Query {
  facets?: Facets[];
}

export const handler = async (req: RequestFromClient<Query>, res: Res) => {
  try {
    logger.info("[getStatistics] get translations statistics");

    const noFacet = !req.query.facets?.length;
    const facets = req.query.facets || [];
    const data: Statistics = {};

    const languages = await getActiveLanguagesFromDB();
    const users = await getAllUsersFromDB({ roles: 1, last_connected: 1, selectedLanguages: 1 }, "roles");

    // nbTranslators
    let translators: User[] = [];
    if (noFacet || facets.includes("nbTranslators") || facets.includes("nbActiveTranslators")) {
      translators = users.filter((x: any) => (x.roles || []).some((role: any) => role.nom === "Trad"));
      data.nbTranslators = translators.length;
    }

    // nbRedactors
    if (noFacet || facets.includes("nbRedactors")) {
      const redactors = users.filter((x: any) => (x.roles || []).some((role: any) => role.nom === "Contrib"));
      data.nbRedactors = redactors.length;
    }

    // nbWordsTranslated
    if (noFacet || facets.includes("nbWordsTranslated")) {
      const nbWordsTranslated = await getNbWordsTranslated();
      data.nbWordsTranslated = nbWordsTranslated?.[0]?.wordsCount || 0;
    }

    // nbActiveTranslators
    if (noFacet || facets.includes("nbActiveTranslators")) {
      const now = Date.now();
      const activeTranslators = translators.filter(
        (user) => now - new Date(user.last_connected).getTime() <= ONE_MONTH
      );
      const nbActiveTranslators = languages
        .filter((ln) => ln.i18nCode !== "fr")
        .map((language) => {
          const languageId = language._id.toString();
          const count = activeTranslators.filter((user) =>
            user.selectedLanguages.map((l) => l._id.toString()).includes(languageId)
          ).length;
          return { languageId, count };
        });
      data.nbActiveTranslators = nbActiveTranslators;
    }

    return res.status(200).json({
      text: "OK",
      data
    });
  } catch (error) {
    logger.error("[getStatistics] translations error", { error: error.message });
    return res.status(500).json({ text: "Erreur" });
  }
};

export default [validator, handler];
