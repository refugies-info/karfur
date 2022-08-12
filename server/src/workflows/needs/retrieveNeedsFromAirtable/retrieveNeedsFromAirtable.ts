import { Res } from "../../../types/interface";
import logger = require("../../../logger");
import { createNeedInDB } from "../../../modules/needs/needs.repository";
var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY_APPLI }).base(
  process.env.AIRTABLE_BASE_APPLI
);
/* NOT USED: REPLACE TAGS BY THEMES BEFORE USE */
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
                  if (record.get("Statut") === "Implémenté") {
                    themes.push({
                      recordId: record.id,
                      tagName: record.get("Phrases"),
                    });
                  }
                });

                needs.forEach((need) => {
                  const correspondingTheme = themes.filter(
                    (theme) => theme.recordId === need.tagRecordId
                  );

                  if (correspondingTheme && correspondingTheme.length > 0) {
                    const needDB = {
                      fr: { text: need.needName, updatedAt: Date.now() },
                      tagName: correspondingTheme[0].tagName.toLowerCase(),
                    };
                    logger.info("[retrieveNeedsFromAirtable] creating need", {
                      need: needDB.fr.text,
                    });
                    // @ts-ignore
                    await createNeedInDB(needDB);
                    return;
                  }
                });

                fetchNextPage();
              },
              function done(err: any) {
                if (err) {
                  logger.error("[retrieveNeedsFromAirtable] error", {
                    err: err.message,
                  });
                  return;
                }
              }
            );

          fetchNextPage();
        },
        function done(err: any) {
          if (err) {
            logger.error("[retrieveNeedsFromAirtable] error 2", {
              err: err.message,
            });
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
