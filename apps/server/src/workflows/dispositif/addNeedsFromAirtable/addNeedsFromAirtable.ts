import mongoose from "mongoose";
import { asyncForEach } from "~/libs/asyncForEach";
import logger from "~/logger";
import { getDispositifById, updateDispositifInDB } from "~/modules/dispositif/dispositif.repository";
import { getNeedsFromDB } from "~/modules/needs/needs.repository";
import { Res } from "~/types/interface";
import { data } from "./data";

// REPLACE TAGS BY THEMES BEFORE USE
export const addNeedsFromAirtable = async (req: {}, res: Res) => {
  try {
    logger.info("[addNeedsFromAirtable]");
    const needsFromDB = await getNeedsFromDB();
    let nbDispoUpdated = 0;

    await asyncForEach(data, async (el) => {
      try {
        let needs: mongoose.Types.ObjectId[] = [];
        // @ts-ignore
        const ficheFromDB = await getDispositifById(el._id, { tags: 1 });
        if (!ficheFromDB) {
          return;
        }
        el.needs.forEach((need) => {
          const needWithDetailsArray = needsFromDB.filter((needDB) => needDB.fr.text === need);
          const needWithDetails = needWithDetailsArray.length > 0 ? needWithDetailsArray[0] : null;
          let isTagOk = false;
          //@ts-ignore
          if (ficheFromDB.tags && ficheFromDB.tags.length > 0) {
            //@ts-ignore
            ficheFromDB.tags.forEach((tag: any) => {
              if (tag && tag.name && tag.name === needWithDetails.tagName) {
                isTagOk = true;
              }
            });
          }
          if (isTagOk) {
            needs.push(needWithDetails._id);
          }
        });

        if (needs.length > 0) {
          // @ts-ignore
          await updateDispositifInDB(el._id, { needs });
          logger.info("[addNeedsFromAirtable] successfully updated dispositif with id", { _id: el._id });
          nbDispoUpdated++;
        }
      } catch (error) {
        logger.error("[addNeedsFromAirtable] error ", {
          error: error.message,
          id: el._id,
        });
      }
    });

    logger.info(`[addNeedsFromAirtable] successfully updated ${nbDispoUpdated} contents`);
    return res.status(200).json({ text: "ok", nbContentsUpdated: nbDispoUpdated });
  } catch (error) {
    logger.error("[addNeedsFromAirtable] error ", {
      error: error.message,
    });

    return res.status(500).json({
      text: "Erreur interne",
    });
  }
};
