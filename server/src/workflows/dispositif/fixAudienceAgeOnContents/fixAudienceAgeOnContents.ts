import logger from "../../../logger";
import { Res, AudienceAge, DispositifContent } from "../../../types/interface";
// import {
//   getAllContentsFromDB,
//   updateDispositifInDB,
//   removeVariantesInDB,
// } from "../../../modules/dispositif/dispositif.repository";
import { asyncForEach } from "../../../libs/asyncForEach";
import { DispositifId } from "src/typegoose";

// TODO: delete
interface Dispositif {
  _id: DispositifId;
  audienceAge: undefined | AudienceAge[];
  contenu: DispositifContent[];
  typeContenu: "dispositif" | "demarche";
  status: string;
}
const infocardFranceEntiere = {
  type: "card",
  title: "Zone d'action",
  titleIcon: "pin-outline",
  typeIcon: "eva",
  departments: ["All"],
};

const allAges: AudienceAge[] = [{ contentTitle: "Plus de ** ans", bottomValue: -1, topValue: 999 }];

const computeNewAudienceAge = (dispositif: { audienceAge: AudienceAge[] }): AudienceAge[] => {
  const audienceAge = dispositif.audienceAge && dispositif.audienceAge[0] ? dispositif.audienceAge[0] : undefined;

  if (!audienceAge) {
    return allAges;
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

const computeModifiedDemarche = (dispositif: Dispositif) => {
  const infocards =
    dispositif.contenu && dispositif.contenu[1] && dispositif.contenu[1].children ? dispositif.contenu[1].children : [];

  const infocardAge =
    infocards.filter((infocard) => infocard.title === "Âge requis").length > 0
      ? infocards.filter((infocard) => infocard.title === "Âge requis")[0]
      : null;

  if (!infocardAge)
    return {
      contenu: [
        dispositif.contenu[0],
        { ...dispositif.contenu[1], children: [infocardFranceEntiere] },
        dispositif.contenu[2],
        dispositif.contenu[3],
      ],
      // @ts-ignore : type of contentTitle not compatible (enum and string)
      audienceAge: computeNewAudienceAge({ audienceAge: [infocardAge] }),
    };

  if (infocardAge.contentTitle) {
    return {
      contenu: [
        dispositif.contenu[0],
        {
          ...dispositif.contenu[1],
          children: [infocardFranceEntiere, infocardAge],
        },
        dispositif.contenu[2],
        dispositif.contenu[3],
      ],
      // @ts-ignore : type of contentTitle not compatible (enum and string)
      audienceAge: computeNewAudienceAge({ audienceAge: [infocardAge] }),
    };
  }

  const newInfocardAge = { ...infocardAge, contentTitle: infocardAge.ageTitle };
  delete newInfocardAge.ageTitle;
  return {
    contenu: [
      dispositif.contenu[0],
      {
        ...dispositif.contenu[1],
        children: [infocardFranceEntiere, newInfocardAge],
      },
      dispositif.contenu[2],
      dispositif.contenu[3],
    ],
    // @ts-ignore : type of contentTitle not compatible (enum and string)
    audienceAge: computeNewAudienceAge({ audienceAge: [newInfocardAge] }),
  };
};

const fixAudienceAgeOnContent = async (dispositif: Dispositif) => {
  try {
    logger.info("[fixAudienceAgeOnContents] id", { id: dispositif._id });

    if (dispositif.typeContenu === "dispositif") {
      const newAudienceAge = computeNewAudienceAge(dispositif);
      // await updateDispositifInDB(dispositif._id, {
      //   // FIXMEaudienceAge: newAudienceAge
      // });
      logger.info("[fixAudienceAgeOnContents] successfully modified audience age of dispositif with id", {
        id: dispositif._id,
      });
      return;
    }

    if (dispositif.typeContenu === "demarche") {
      if (dispositif.status === "Actif") {
        const modifiedDispositif = computeModifiedDemarche(dispositif);
        // FIXME await updateDispositifInDB(dispositif._id, modifiedDispositif);
        logger.info("[fixAudienceAgeOnContents] successfully modified infocards of demarche with id", {
          id: dispositif._id,
        });
      }

      // await removeVariantesInDB(dispositif._id);
      logger.info("[fixAudienceAgeOnContents] successfully remove variantes from demarche with id", {
        id: dispositif._id,
      });
      return;
    }
  } catch (error) {
    logger.error("[fixAudienceAgeOnContents] error while modifying content with id", { id: dispositif._id });
  }
};
export const fixAudienceAgeOnContents = async (_: any, res: Res) => {
  try {
    logger.info("[fixAudienceAgeOnContents] received a call");

    // @ts-ignore
    // const dispositifs: Dispositif[] = await getAllContentsFromDB();
    // await asyncForEach(dispositifs, async (dispositif) => {
    //   await fixAudienceAgeOnContent(dispositif);
    // });
    logger.info("[fixAudienceAgeOnContents] successfully modified all contents");

    res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[fixAudienceAgeOnContents] error", { error: error.message });
    res.status(500).json({ text: "KO" });
  }
};
