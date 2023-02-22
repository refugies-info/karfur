import { ContentType, Languages } from "api-types";
import { DispositifId, Theme } from "src/typegoose";

var Airtable = require("airtable");
var base = new Airtable({
  apiKey: process.env.NODE_ENV === "staging" ? process.env.airtableApiKey : process.env.AIRTABLE_API_KEY_APPLI,
}).base(process.env.NODE_ENV === "staging" ? process.env.AIRTABLE_BASE_DIAIR_TEST : process.env.AIRTABLE_BASE_TRAD);
const logger = require("../../logger");
const { getFormattedLocale } = require("../../libs/getFormattedLocale");

const addDispositifInContenusAirtable = async (
  title: string,
  link: string,
  themesList: Theme[],
  type: ContentType,
  departments: string[],
) => {
  try {
    logger.info("[addDispositifInContenusAirtable] adding a new line", {
      title,
      themesList,
    });

    await base("CONTENUS").create(
      [
        {
          fields: {
            "! Titre": title,
            "! Thèmes": themesList.map((t) => t.short.fr),
            "! Réfugiés.info": link,
            "! À traduire ?": true,
            "! Priorité": ["Normale"],
            "! Type de contenus": type === "demarche" ? ["Démarche"] : ["Dispositif"],
            "! Départements": departments,
          },
        },
      ],
      { typecast: true },
    );
  } catch (e) {
    logger.error("[addDispositifInContenusAirtable] error while adding a new line", e);
  }
};

const removeTraductionDispositifInContenusAirtable = async (
  recordId: any,
  title: string,
  themesList: Theme[],
  departments: string[],
) => {
  try {
    logger.info("[removeTraductionDispositifInContenusAirtable] update line for record", {
      recordId,
    });
    await base("CONTENUS").update(
      [
        {
          id: recordId,
          fields: {
            "! Titre": title,
            "! Traduits ?": [],
            "! Thèmes": themesList.map((t) => t.short.fr),
            "! Départements": departments,
          },
        },
      ],
      { typecast: true },
    );
  } catch (e) {
    logger.error("[removeTraductionDispositifInContenusAirtable] error", e);
  }
};

const removeDispositifInContenusAirtable = async (recordId: any) => {
  try {
    logger.info("[removeDispositifInContenusAirtable] remove line", {
      recordId,
    });
    await base("CONTENUS").destroy([recordId]);
  } catch (e) {
    logger.error("[removeDispositifInContenusAirtable] error", e);
  }
};

const addTraductionDispositifInContenusAirtable = async ({ id, trad }: { id: any; trad: any }, locale: any) => {
  try {
    const formattedLocale = getFormattedLocale(locale, "short");
    logger.info("[addTraductionDispositifInContenusAirtable] update line for record and locale", {
      id,
      locale,
      formattedLocale,
    });

    if (trad) {
      trad.push(formattedLocale);
    }
    await base("CONTENUS").update([
      {
        id,
        fields: { "! Traduits ?": trad || [formattedLocale] },
      },
    ]);
  } catch (e) {
    logger.error("[addTraductionDispositifInContenusAirtable] error", e);
  }
};

export const addOrUpdateDispositifInContenusAirtable = async (
  titleInformatif: string,
  titreMarque: string,
  id: DispositifId,
  themesList: Theme[],
  type: ContentType,
  locale: Languages,
  departments: string[],
  hasContentBeenDeleted: boolean,
) => {
  if (process.env.NODE_ENV !== "production") {
    logger.info("[addOrUpdateDispositifInContenusAirtable] env is not production, do not send content to airtable", {
      env: process.env.NODE_ENV,
      data: { titleInformatif, titreMarque, id, themesList, locale, departments },
    });

    return;
  }

  const title = type === "dispositif" ? titreMarque + " - " + titleInformatif : titleInformatif;
  logger.info("[addOrUpdateDispositifInContenusAirtable] received a new line", {
    title,
  });
  const link = "https://www.refugies.info/" + type + "/" + id;

  const formula = "({! Réfugiés.info} ='" + link + "')";
  const recordsList: any[] = [];
  base("CONTENUS")
    .select({
      filterByFormula: formula,
    })
    .firstPage(async function (err: any, records: any) {
      try {
        if (err) {
          logger.error("[addOrUpdateDispositifInContenusAirtable] error while getting dispositif in airtable", {
            error: err,
          });
          return;
        }
        records.forEach(function (record: any) {
          logger.info("[addOrUpdateDispositifInContenusAirtable] retrieved dispositif", {
            recordId: record.id,
            title: record.get("! Titre"),
          });
          recordsList.push({ id: record.id, trad: record.get("! Traduits ?") });
        });
        if (recordsList.length === 0) {
          logger.info("[addOrUpdateDispositifInContenusAirtable] no dispositif with the link exists in table contenu", {
            link,
          });
          if (locale) {
            logger.info("[addOrUpdateDispositifInContenusAirtable] no locale so we don't do anything", { link });
            return;
          }
          // add content in airtable
          await addDispositifInContenusAirtable(title, link, themesList, type, departments);
          return;
        }
        if (hasContentBeenDeleted) {
          await removeDispositifInContenusAirtable(recordsList[0].id);
          return;
        }
        if (!locale) {
          // no locale and a record already in airtable ==> dispositif modified in french
          await removeTraductionDispositifInContenusAirtable(recordsList[0].id, title, themesList, departments);
          return;
        }
        // dispositif has been translated
        await addTraductionDispositifInContenusAirtable(recordsList[0], locale);
      } catch (e) {
        logger.error("[addOrUpdateDispositifInContenusAirtable] error ", e);
      }
    });
};
