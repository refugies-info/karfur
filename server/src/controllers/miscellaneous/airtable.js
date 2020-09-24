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

const updateDispositifInContenusAirtable = (recordId) => {
  logger.info("[updateDispositifInContenusAirtable] update line for record", {
    recordId,
  });
  base("CONTENUS").update([{ id: recordId, fields: { "Traduits ?": [] } }]);
};

const addOrUpdateDispositifInContenusAirtable = async (
  titleInformatif,
  titreMarque,
  id,
  tags
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
        recordsList.push(record.id);
      });
      if (recordsList.length === 0) {
        logger.info(
          "[addOrUpdateDispositifInContenusAirtable] no dispositif with the link exists in table contenu",
          { link }
        );
        addDispositifInContenusAirtable(title, link, tagsList);
        return;
      }
      updateDispositifInContenusAirtable(recordsList[0]);
    });
};

exports.addOrUpdateDispositifInContenusAirtable = addOrUpdateDispositifInContenusAirtable;
