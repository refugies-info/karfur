import { Res } from "../../../types/interface";
import logger = require("../../../logger");
var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY_APPLI }).base(
  process.env.AIRTABLE_BASE_APPLI
);

export const retrieveNeedsFromAirtable = async (req: {}, res: Res) => {
  try {
    logger.info("[retrieveNeedsFromAirtable]");
    base("Besoins")
      .select({
        // Selecting the first 3 records in Besoins par thèmes:
        maxRecords: 3,
        view: "Besoins par thèmes",
      })
      .eachPage(
        function page(records: any, fetchNextPage: any) {
          // This function (`page`) will get called for each page of records.

          records.forEach(function (record: any) {
            console.log(
              "Retrieved",
              record.get("Nom du besoin ou édito"),
              record.get("Thèmes")
            );
          });

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err: any) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );

    base("Thèmes")
      .select({
        // Selecting the first 3 records in Besoins par thèmes:
        maxRecords: 3,
        // view: "Besoins par thèmes",
      })
      .eachPage(
        function page(records: any, fetchNextPage: any) {
          // This function (`page`) will get called for each page of records.

          records.forEach(function (record: any) {
            console.log(
              "Retrieved theme",
              record.get("Mots-clefs"),
              record.get("Phrases"),
              record.id
            );
          });

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err: any) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );

    return res.status(200).json({ text: "ok" });
  } catch (error) {
    logger.error("[retrieveNeedsFromAirtable] error ", {
      error,
    });

    return res.status(500).json({
      text: "Erreur interne",
    });
  }
};
