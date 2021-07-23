import { Res } from "../../../types/interface";
import logger = require("../../../logger");
var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY_APPLI }).base(
  process.env.AIRTABLE_BASE_APPLI
);

export const retrieveNeedsFromAirtable = async (req: {}, res: Res) => {
  try {
    logger.info("[retrieveNeedsFromAirtable]");
    let needs: any[] = [];
    let themes: any[] = [];

    base("Besoins")
      .select({
        maxRecords: 70,
        view: "Besoins par thèmes",
      })
      .eachPage(
        function page(records: any, fetchNextPage: any) {
          records.forEach(function (record: any) {
            needs.push({
              needName: record.get("Nom du besoin ou édito"),
              tagRecordId: record.get("Thèmes")[0],
            });
          });
          base("Thèmes")
            .select({
              maxRecords: 16,
            })
            .eachPage(
              function page(records: any, fetchNextPage: any) {
                records.forEach(function (record: any) {
                  themes.push({
                    recordId: record.id,
                    tagName: record.get("Phrases"),
                  });
                });

                const formattedNeeds = needs.map((need) => {
                  const correspondingTheme = themes.filter(
                    (theme) => theme.recordId === need.tagRecordId
                  );

                  if (correspondingTheme && correspondingTheme.length > 0) {
                    return {
                      needName: need.needName,
                      tagName: correspondingTheme[0].tagName,
                    };
                  }
                });

                fetchNextPage();
              },
              function done(err: any) {
                if (err) {
                  console.error(err);
                  return;
                }
              }
            );

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
