import logger from "../../logger";
import { getActiveLanguagesFromDB, updateLanguageAvancementInDB } from "./langues.repository";
import { getActiveContents, getCountDispositifs } from "../dispositif/dispositif.repository";
import { Langue } from "../../typegoose";
import { DispositifStatus } from "@refugies-info/api-types";

export const updateLanguagesAvancement = async () => {
  logger.info("[updateLanguagesAvancement] received a call");
  const activeLanguages = await getActiveLanguagesFromDB();

  const activesContents = await getActiveContents({ _id: 1 });
  const nbActivesContents = activesContents.length;

  await activeLanguages.map(async (langue: Langue) => {
    const nbPublishedTrad = await getCountDispositifs({
      status: DispositifStatus.ACTIVE,
      [`translations.${langue.i18nCode}`]: { $exists: true },
    });

    logger.info("[updateLanguagesAvancement] before update avancement", {
      language: langue.i18nCode,
      nbActivesContents,
      nbPublishedTrad,
    });

    const tradRatio = nbPublishedTrad / nbActivesContents;

    await updateLanguageAvancementInDB(langue._id, tradRatio);
  });

  logger.info("[updateLanguagesAvancement] successfully updated avancement");
  return;
};

/*
AGGREGATION MONGO

[
  {
    $facet:
      /**
       * outputFieldN: The first output field.
       * stageN: The first aggregation stage.
       * /
      {
        actives: [
          {
            $match: {
              status: "Actif",
            },
          },
          {
            $count: "count",
          },
        ],
        activesAndTranslated: [
          {
            $match: {
              "translations.fa": {
                $exists: true,
              },
            },
          },
          {
            $count: "count",
          },
        ],
      },
  },
  {
    $addFields:
      /**
       * newField: The new field name.
       * expression: The new field expression.
       * /
      {
        total: {
          $arrayElemAt: ["$actives", 0],
        },
        totalTranslated: {
          $arrayElemAt: [
            "$activesAndTranslated",
            0,
          ],
        },
      },
  },
  {
    $addFields:
      /**
       * newField: The new field name.
       * expression: The new field expression.
       * /
      {
        avancement: {
          $divide: [
            "$total.count",
            "$totalTranslated.count",
          ],
        },
      },
  },
]

*/
