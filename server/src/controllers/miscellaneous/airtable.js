var Airtable = require("airtable");
var base = new Airtable({
  apiKey:
    process.env.NODE_ENV === "staging"
      ? process.env.airtableApiKey
      : process.env.AIRTABLE_API_KEY_APPLI,
}).base(
  process.env.NODE_ENV === "staging"
    ? process.env.AIRTABLE_BASE_DIAIR_TEST
    : process.env.AIRTABLE_BASE_TRAD
);
const logger = require("../../logger");
const { getFormattedLocale } = require("../../libs/getFormattedLocale");

const addDispositifInContenusAirtable = (title, link, tagsList, type) => {
  logger.info("[addDispositifInContenusAirtable] adding a new line", {
    title,
    tagsList,
  });

  base("CONTENUS").create(
    [
      {
        fields: {
          "! Titre": title,
          "! Thèmes": tagsList,
          "! Réfugiés.info": link,
          "! À traduire ?": true,
          "! Priorité": ["Normale"],
          "! Type de contenus":
            type === "demarche" ? ["Démarche"] : ["Dispositif"],
        },
      },
    ],
    function (err) {
      if (err) {
        logger.error(
          "[addDispositifInContenusAirtable] error while adding a new line",
          { error: err }
        );
        return;
      }
    }
  );
};

const removeTraductionDispositifInContenusAirtable = (
  recordId,
  title,
  tagsList
) => {
  logger.info(
    "[removeTraductionDispositifInContenusAirtable] update line for record",
    {
      recordId,
    }
  );
  base("CONTENUS").update([
    {
      id: recordId,
      fields: { "! Titre": title, "! Traduits ?": [], "! Thèmes": tagsList },
    },
  ]);
};

const removeDispositifInContenusAirtable = (recordId) => {
  logger.info("[removeDispositifInContenusAirtable] update line for record", {
    recordId,
  });
  base("CONTENUS").update([
    { id: recordId, fields: { "! Traduits ?": [], "! À traduire ?": false } },
  ]);
};

const addTraductionDispositifInContenusAirtable = ({ id, trad }, locale) => {
  const formattedLocale = getFormattedLocale(locale, "short");
  logger.info(
    "[addTraductionDispositifInContenusAirtable] update line for record and locale",
    {
      id,
      locale,
      formattedLocale,
    }
  );

  if (trad) {
    trad.push(formattedLocale);
  }
  base("CONTENUS").update([
    {
      id,
      fields: { "! Traduits ?": trad || [formattedLocale] },
    },
  ]);
};

const addOrUpdateDispositifInContenusAirtable = async (
  titleInformatif,
  titreMarque,
  id,
  tags,
  type,
  locale,
  hasContentBeenDeleted
) => {
  if (process.env.NODE_ENV === "dev") {
    logger.info(
      "[addOrUpdateDispositifInContenusAirtable] env is not production, do not send content to airtable",
      {
        env: process.env.NODE_ENV,
        data: { titleInformatif, titreMarque, id, tags, locale },
      }
    );

    return;
  }

  const title =
    type === "dispositif"
      ? titreMarque + " - " + titleInformatif
      : titleInformatif;
  logger.info("[addOrUpdateDispositifInContenusAirtable] received a new line", {
    title,
  });
  const link = "https://www.refugies.info/" + type + "/" + id;

  const tagsList = tags
    ? tags.filter((tag) => !!tag).map((tag) => tag.short)
    : [];
  const formula = "({! Réfugiés.info} ='" + link + "')";
  const recordsList = [];
  base("CONTENUS")
    .select({
      filterByFormula: formula,
    })
    .firstPage(function (err, records) {
      if (err) {
        logger.error(
          "[addOrUpdateDispositifInContenusAirtable] error while getting dispositif in airtable",
          { error: err }
        );
        return;
      }
      records.forEach(function (record) {
        logger.info(
          "[addOrUpdateDispositifInContenusAirtable] retrieved dispositif",
          { recordId: record.id, title: record.get("! Titre") }
        );
        recordsList.push({ id: record.id, trad: record.get("! Traduits ?") });
      });
      if (recordsList.length === 0) {
        logger.info(
          "[addOrUpdateDispositifInContenusAirtable] no dispositif with the link exists in table contenu",
          { link }
        );
        if (locale) {
          logger.info(
            "[addOrUpdateDispositifInContenusAirtable] no locale so we don't do anything",
            { link }
          );
          return;
        }
        // add content in airtable
        addDispositifInContenusAirtable(title, link, tagsList, type);
        return;
      }
      if (hasContentBeenDeleted) {
        removeDispositifInContenusAirtable(recordsList[0].id);
        return;
      }
      if (!locale) {
        // no locale and a record already in airtable ==> dispositif modified in french
        removeTraductionDispositifInContenusAirtable(
          recordsList[0].id,
          title,
          tagsList
        );
        return;
      }
      // dispositif has been translated
      addTraductionDispositifInContenusAirtable(recordsList[0], locale);
    });
};

exports.addOrUpdateDispositifInContenusAirtable = addOrUpdateDispositifInContenusAirtable;
