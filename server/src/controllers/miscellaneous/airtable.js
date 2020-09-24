var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.airtableApiKey }).base(
  process.env.airtableBase
);
const logger = require("../../logger");

const addDispositifInContenusAirtable = (title, link, tagsList) => {
  logger.info("[addDispositifInContenusAirtable] adding a new line", {
    title,
  });

  base("CONTENUS").create(
    [
      {
        fields: {
          Titre: title,
          Thèmes: tagsList,
          "Réfugiés.info": link,
          "À traduire ?": true,
          "Statut trad": ["À traduire"],
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

const removeTraductionDispositifInContenusAirtable = (recordId) => {
  logger.info(
    "[removeTraductionDispositifInContenusAirtable] update line for record",
    {
      recordId,
    }
  );
  base("CONTENUS").update([{ id: recordId, fields: { "Traduits ?": [] } }]);
};

const getFormattedLocale = (locale) => {
  if (locale === "en") return "Anglais";
  if (locale === "ar") return "Arabe";
  if (locale === "ru") return "Russe";
  if (locale === "ti-ER") return "Tigrynia";
  if (locale === "ps") return "Pachto";
  if (locale === "fa") return "Persan";
  return "locale not found";
};
const addTraductionDispositifInContenusAirtable = ({ id, trad }, locale) => {
  const formattedLocale = getFormattedLocale(locale);
  logger.info(
    "[addTraductionDispositifInContenusAirtable] update line for record and locale",
    {
      id,
      locale,
      formattedLocale,
    }
  );
  trad.push(formattedLocale);
  base("CONTENUS").update([
    {
      id,
      fields: { "Traduits ?": trad },
    },
  ]);
};

const addOrUpdateDispositifInContenusAirtable = async (
  titleInformatif,
  titreMarque,
  id,
  tags,
  locale
) => {
  const title = titreMarque + " - " + titleInformatif;
  logger.info("[addOrUpdateDispositifInContenusAirtable] received a new line", {
    title,
  });
  const link = "https://www.refugies.info/dispositif/" + id;
  const tagsList = tags ? tags.map((tag) => tag && tag.short) : [];
  const formula = "({Réfugiés.info} ='" + link + "')";
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
          { recordId: record.id, title: record.get("Title") }
        );
        recordsList.push({ id: record.id, trad: record.get("Traduits ?") });
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
        addDispositifInContenusAirtable(title, link, tagsList);
        return;
      }
      if (!locale) {
        // no locale and a record with the link ==> dispositif modified in french
        removeTraductionDispositifInContenusAirtable(recordsList[0].id);
        return;
      }
      addTraductionDispositifInContenusAirtable(recordsList[0], locale);
    });
};

exports.addOrUpdateDispositifInContenusAirtable = addOrUpdateDispositifInContenusAirtable;
