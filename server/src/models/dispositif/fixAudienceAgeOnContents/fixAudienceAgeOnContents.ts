import logger = require("../../../logger");
import { Res, AudienceAge, DispositifContent } from "../../../types/interface";
import {
  getAllContentsFromDB,
  updateDispositifInDB,
} from "../../../controllers/dispositif/dispositif.repository";
import { asyncForEach } from "../../../libs/asyncForEach";
import { ObjectId } from "mongoose";

interface Dispositif {
  _id: ObjectId;
  audienceAge: undefined | AudienceAge[];
  contenu: DispositifContent[];
  typeContenu: "dispositif" | "demarche";
}

const computeNewAudienceAge = (dispositif: Dispositif): AudienceAge[] => {
  const audienceAge =
    dispositif.audienceAge && dispositif.audienceAge[0]
      ? dispositif.audienceAge[0]
      : undefined;

  if (!audienceAge) {
    return [{ contentTitle: "Plus de ** ans", bottomValue: -1, topValue: 999 }];
  }

  if (audienceAge.contentTitle === "De ** à ** ans") {
    return [
      {
        contentTitle: audienceAge.contentTitle,
        // @ts-ignore
        bottomValue: parseInt(audienceAge.bottomValue, 10),
        //@ts-ignore
        topValue: parseInt(audienceAge.topValue, 10),
      },
    ];
  }

  if (audienceAge.contentTitle === "Plus de ** ans") {
    return [
      {
        contentTitle: audienceAge.contentTitle,
        // @ts-ignore
        bottomValue: parseInt(audienceAge.bottomValue, 10),
        topValue: 999,
      },
    ];
  }

  return [
    {
      contentTitle: audienceAge.contentTitle,
      bottomValue: -1,
      // @ts-ignore
      topValue: parseInt(audienceAge.topValue, 10),
    },
  ];
};
export const fixAudienceAgeOnContents = async (_: any, res: Res) => {
  try {
    logger.info("[fixAudienceAgeOnContents] call received");

    // @ts-ignore
    const dispositifs: Dispositif[] = await getAllContentsFromDB();

    await asyncForEach(dispositifs, async (dispositif) => {
      logger.info("[fixAudienceAgeOnContents] id", { id: dispositif._id });

      if (dispositif.typeContenu === "dispositif") {
        const newAudienceAge = computeNewAudienceAge(dispositif);
        await updateDispositifInDB(dispositif._id, {
          audienceAge: newAudienceAge,
        });
        logger.info(
          "[fixAudienceAgeOnContents] successfully modified dispositif with id",
          { id: dispositif._id }
        );
        return;
      }
      return;
    });
    logger.info(
      "[fixAudienceAgeOnContents] successfully modified all dispositifs"
    );

    res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[fixAudienceAgeOnContents] error", { error });
    res.status(500).json({ text: "KO" });
  }
};
