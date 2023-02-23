import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { getActiveContents } from "../../../modules/dispositif/dispositif.repository";
import { getTraductionsByLanguage } from "../../../modules/traductions/traductions.repository";
import { getTradStatus } from "../../../modules/traductions/traductions.service";
import { availableLanguages } from "../../../libs/getFormattedLocale";
import { DispositifId, Languages } from "../../../typegoose";
import { ContentType } from "api-types";

interface Query {
  locale: Languages;
}

interface GetDispositifsWithTranslationAvancementResponse {
  _id: DispositifId;
  titreInformatif: string;
  titreMarque: string;
  nbMots: number;
  created_at: Date;
  type: ContentType;
  lastTradUpdatedAt: number | null;
  avancementTrad: number;
  avancementExpert: number;
  tradStatus: string;
}

export const getDispositifsWithTranslationAvancement = async (
  req: RequestFromClient<Query>,
  res: Res,
  // res: Response<Result[]>
  // res: Response<GetDispositifsWithTranslationAvancementResponse[]>
) => {
  try {
    checkRequestIsFromSite(req.fromSite);

    if (!req.query || !req.query.locale || !availableLanguages.includes(req.query.locale)) {
      throw new Error("INVALID_REQUEST");
    }

    const locale = req.query.locale;
    logger.info("[getDispositifsWithTranslationAvancement] received with locale", { locale });

    const activeDispositifs = await getActiveContents({
      created_at: 1,
      nbMots: 1,
      translations: 1,
      typeContenu: 1,
    });

    const traductions = await getTraductionsByLanguage(locale, {
      avancement: 1,
      dispositifId: 1,
      translated: 1,
      updatedAt: 1,
      userId: 1,
      type: 1,
    });

    let results: GetDispositifsWithTranslationAvancementResponse[] = [];

    activeDispositifs.forEach((dispositif) => {
      const correspondingTrads = traductions.filter(
        (trad) => trad.dispositifId && dispositif._id && trad.dispositifId.toString() === dispositif._id.toString(),
      );
      const dispositifData = {
        _id: dispositif._id,
        titreInformatif: dispositif.translations.fr.content.titreInformatif,
        titreMarque: dispositif.translations.fr.content.titreMarque,
        nbMots: dispositif.nbMots,
        created_at: dispositif.created_at,
        type: dispositif.typeContenu,
      };

      if (correspondingTrads.length === 0) {
        return results.push({
          ...dispositifData,
          lastTradUpdatedAt: null,
          avancementTrad: 0,
          avancementExpert: 0,
          tradStatus: "À traduire",
        });
      }
      const lastTradUpdatedAt = Math.max(0, ...correspondingTrads.map((z) => z.updatedAt.getTime() || 0));
      const avancementTrad = Math.max(0, ...correspondingTrads.map((z) => z.avancement || -1));

      const avancementExpert = Math.max(
        0,
        ...correspondingTrads
          .filter((y) => {
            return y.type === "validation";
          })
          .map((z) => z.avancement || -1),
      );

      const tradStatus = getTradStatus(dispositif, correspondingTrads);

      return results.push({
        ...dispositifData,
        lastTradUpdatedAt,
        avancementTrad,
        avancementExpert,
        tradStatus,
      });
    });

    logger.info("[getDispositifsWithTranslationAvancement] got results", { count: results.length });

    res.status(200).json({ data: results });
  } catch (error) {
    logger.error("[getDispositifsWithTranslationAvancement] error", {
      error: error.message,
    });

    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
