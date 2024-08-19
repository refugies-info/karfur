import {
  ContentForApp,
  GetContentsForAppRequest,
  GetContentsForAppResponse,
  Languages,
} from "@refugies-info/api-types";

import { Dispositif } from "../../../typegoose";
import logger from "../../../logger";
import getFilteredContentsForApp from "../getFilteredContentsForApp";

const present =
  (locale: Languages) =>
  (dispositif: Dispositif): ContentForApp => {
    let realLocale: Languages = locale;
    let translation = dispositif.translations[locale];
    if (!translation) {
      translation = dispositif.translations.fr;
      realLocale = "fr";
    }
    const sponsorUrl = dispositif.getMainSponsor().picture?.secure_url || null;

    return {
      _id: dispositif._id.toString(),
      titreInformatif: translation.content.titreInformatif,
      titreMarque: translation.content.titreMarque,
      theme: dispositif.theme,
      secondaryThemes: dispositif.secondaryThemes,
      needs: dispositif.needs,
      nbVues: dispositif.nbVues,
      nbVuesMobile: dispositif.nbVuesMobile,
      typeContenu: dispositif.typeContenu,
      sponsorUrl,
      locale: realLocale,
    };
  };

export const getContentsForApp = async (req: GetContentsForAppRequest): Promise<GetContentsForAppResponse> => {
  logger.info("[getContentsForApp] called", req);

  const dispositifs = await getFilteredContentsForApp(req);

  const contentsArrayFr = dispositifs.map(present("fr"));

  if (req.locale === "fr") {
    return {
      dataFr: contentsArrayFr,
    };
  }

  const contentsArrayLocale = dispositifs.map(present(req.locale));

  return {
    data: contentsArrayLocale,
    dataFr: contentsArrayFr,
  };
};
