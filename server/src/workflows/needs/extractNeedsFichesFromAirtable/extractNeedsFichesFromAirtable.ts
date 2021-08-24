import { Res } from "../../../types/interface";
import logger = require("../../../logger");
import { needsAirtable } from "./data";
var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY_APPLI }).base(
  process.env.AIRTABLE_BASE_APPLI
);

export const extractNeedsFichesFromAirtable = async (req: {}, res: Res) => {
  try {
    logger.info("[extractNeedsFichesFromAirtable]");
    let results: any[] = [];

    base("Fiches (05/05/2021)")
      .select({
        maxRecords: 100,
        view: "Vue pour la synchro",
      })
      .eachPage(
        function page(records: any, fetchNextPage: any) {
          records.forEach(function (record: any) {
            if (record.fields.Lien && record.fields.Besoin) {
              const id = record.fields.Lien.slice(
                record.fields.Lien.length - 24,
                record.fields.Lien.length
              );
              const needsRec = record.fields.Besoin.map((besoin: any) => {
                const corres = needsAirtable.filter(
                  (need) => need.needId === besoin
                );
                const needFr =
                  corres.length > 0 ? corres[0].needName : "no corres";
                return needFr;
              });
              const formattedNeeds = needsRec.filter(
                (need: any) => need !== "no corres"
              );
              if (formattedNeeds.length > 0) {
                results.push({ _id: id, needs: formattedNeeds });
              }
            }
          });
          console.log("result", results);

          fetchNextPage();
        },
        function done(err: any) {
          if (err) {
            // console.error(err);
            return;
          }
        }
      );

    return res.status(200).json({ text: "ok" });
  } catch (error) {
    logger.error("[extractNeedsFichesFromAirtable] error ", {
      error: error.message,
    });

    return res.status(500).json({
      text: "Erreur interne",
    });
  }
};
