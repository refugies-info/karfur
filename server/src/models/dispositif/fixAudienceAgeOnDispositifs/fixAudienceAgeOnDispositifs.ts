import logger = require("../../../logger");
import { Res } from "../../../types/interface";
import {
  getAllDispositifsFromDB,
  updateDispositifInDB,
} from "../../../controllers/dispositif/dispositif.repository";
import { asyncForEach } from "../../../libs/asyncForEach";
import { ObjectId } from "mongoose";

interface AudienceAge {
  contentTitle: "Plus de ** ans" | "De ** à ** ans" | "Moins de ** ans";
  bottomValue: number | string;
  topValue: number | string;
}
interface Dispositif {
  _id: ObjectId;
  audienceAge: undefined | AudienceAge[];
}

export const fixAudienceAgeOnDispositifs = async (_: any, res: Res) => {
  try {
    logger.info("[fixAudienceAgeOnDispositifs] call received");

    // @ts-ignore
    const dispositifs: Dispositif[] = await getAllDispositifsFromDB();
    await asyncForEach(dispositifs, async (dispositif) => {
      logger.info("[fixAudienceAgeOnDispositifs] id", { id: dispositif._id });
      const audienceAge =
        dispositif.audienceAge && dispositif.audienceAge[0]
          ? dispositif.audienceAge[0]
          : undefined;
      let newAudienceAge;

      if (!audienceAge) {
        newAudienceAge = [
          { contentTitle: "Plus de ** ans", bottomValue: -1, topValue: 999 },
        ];
      } else if (audienceAge.contentTitle === "De ** à ** ans") {
        newAudienceAge = [
          {
            contentTitle: audienceAge.contentTitle,
            // @ts-ignore
            bottomValue: parseInt(audienceAge.bottomValue, 10),
            //@ts-ignore
            topValue: parseInt(audienceAge.topValue, 10),
          },
        ];
      } else if (audienceAge.contentTitle === "Plus de ** ans") {
        newAudienceAge = [
          {
            contentTitle: audienceAge.contentTitle,
            // @ts-ignore
            bottomValue: parseInt(audienceAge.bottomValue, 10),
            topValue: 999,
          },
        ];
      } else {
        newAudienceAge = [
          {
            contentTitle: audienceAge.contentTitle,
            bottomValue: -1,
            // @ts-ignore
            topValue: parseInt(audienceAge.topValue, 10),
          },
        ];
      }

      await updateDispositifInDB(dispositif._id, {
        //@ts-ignore
        audienceAge: newAudienceAge,
      });
      logger.info(
        "[fixAudienceAgeOnDispositifs] successfully modified dispositif with id",
        { id: dispositif._id }
      );
    });
    logger.info(
      "[fixAudienceAgeOnDispositifs] successfully modified all dispositifs"
    );

    res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[fixAudienceAgeOnDispositifs] error", { error });
    res.status(500).json({ text: "KO" });
  }
};
