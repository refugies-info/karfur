import logger from "../../../logger";
import { Res, RequestFromClientWithBody, Need } from "../../../types/interface";
import { getDispositifArray } from "../../../modules/dispositif/dispositif.repository";
import { turnToLocalizedTitles } from "../../../controllers/dispositif/functions";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";

var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.airtableApiKey }).base(
  process.env.AIRTABLE_BASE_USERS
);

interface Result {
  "Titre informatif": string;
  "Titre marque": string;
  "Type de contenu": string[];
  Lien: string;
  "Thème principal": string;
  "Thème secondaire 1": string | null;
  "Thème secondaire 2": string | null;
  "Zone d'action": string;
  "Age requis": string | null;
  "Public visé": string | null;
  "Niveau de français": string | null;
  "Combien ça coute": string | null;
  Durée: string | null;
  "Nombre de vues": number;
  "Besoins": string[];
  "Date de dernière mise à jour": string;
}

const getAgeRequis = (infocards: any[]) => {
  const ageRequisIC =
    infocards.filter((card) => card.title === "Âge requis").length > 0
      ? infocards.filter((card) => card.title === "Âge requis")[0]
      : null;
  if (!ageRequisIC) return "";

  if (ageRequisIC.contentTitle === "Plus de ** ans")
    return "Plus de " + ageRequisIC.bottomValue + " ans";
  if (ageRequisIC.contentTitle === "Moins de ** ans")
    return "Moins de " + ageRequisIC.topValue + " ans";

  return (
    "De " + ageRequisIC.bottomValue + " à " + ageRequisIC.topValue + " ans"
  );
};

const getPublicVise = (infocards: any[]) => {
  const publicViseIC =
    infocards.filter((card) => card.title === "Public visé").length > 0
      ? infocards.filter((card) => card.title === "Public visé")[0]
      : null;
  if (!publicViseIC || !publicViseIC.contentTitle) return "";

  return publicViseIC.contentTitle.fr || publicViseIC.contentTitle;
};

const getNiveauFrancais = (infocards: any[]) => {
  const niveauFrIC =
    infocards.filter((card) => card.title === "Niveau de français").length > 0
      ? infocards.filter((card) => card.title === "Niveau de français")[0]
      : null;
  if (!niveauFrIC || !niveauFrIC.contentTitle) return "";

  return niveauFrIC.contentTitle.fr || niveauFrIC.contentTitle;
};

const getDuree = (infocards: any[]) => {
  const dureeIC =
    infocards.filter((card) => card.title === "Durée").length > 0
      ? infocards.filter((card) => card.title === "Durée")[0]
      : null;
  if (!dureeIC || !dureeIC.contentTitle) return "";

  return dureeIC.contentTitle.fr || dureeIC.contentTitle;
};

const getPrice = (infocards: any[]) => {
  const priceIC =
    infocards.filter((card) => card.title === "Combien ça coûte ?").length > 0
      ? infocards.filter((card) => card.title === "Combien ça coûte ?")[0]
      : null;

  if (!priceIC) return "";

  if (priceIC.free) return "Gratuit";
  return "Payant";
};

const getZoneAction = (infocards: any[]) => {
  const zoneIC =
    infocards.filter((card) => card.title === "Zone d'action").length > 0
      ? infocards.filter((card) => card.title === "Zone d'action")[0]
      : null;
  if (!zoneIC || !zoneIC.departments || zoneIC.departments.length === 0)
    return "";
  return zoneIC.departments.join(" / ");
};

const exportFichesInAirtable = (fiches: { fields: Result }[]) => {
  logger.info(
    `[exportFichesInAirtable] export ${fiches.length} fiches in airtable`
  );
  base("Fiches").create(fiches, {typecast: true}, function (err: Error) {
    if (err) {
      logger.error(
        "[exportFichesInAirtable] error while exporting fiches to airtable",
        {
          fichesId: fiches.map((fiche) => fiche.fields.Lien),
          error: err,
        }
      );
      return;
    }

    logger.info(
      `[exportFichesInAirtable] successfully exported ${fiches.length}`
    );
  });
};

const formatFiche = (fiche: any) => {
  turnToLocalizedTitles(fiche, "fr");

  const tag1 =
    fiche.tags && fiche.tags.length > 0 && fiche.tags[0] && fiche.tags[0].name
      ? fiche.tags[0].name
      : "";
  const tag2 =
    fiche.tags && fiche.tags.length > 0 && fiche.tags[1] && fiche.tags[1].name
      ? fiche.tags[1].name
      : "";
  const tag3 =
    fiche.tags && fiche.tags.length > 0 && fiche.tags[2] && fiche.tags[2].name
      ? fiche.tags[2].name
      : "";

  const infocards =
    fiche.contenu &&
    fiche.contenu[1] &&
    fiche.contenu[1].children &&
    fiche.contenu[1].children.length > 0
      ? fiche.contenu[1].children
      : [];

  const ageRequis = getAgeRequis(infocards);
  const publicVise = getPublicVise(infocards);
  const niveauFrancais = getNiveauFrancais(infocards);
  const duree = getDuree(infocards);
  const prix = getPrice(infocards);
  const zoneAction = getZoneAction(infocards);
  const besoins = fiche.needs ? fiche.needs.map((need: Need) => need.fr.text) : [];

  const formattedResult = {
    "Titre informatif": fiche.titreInformatif,
    "Titre marque": fiche.titreMarque,
    "Type de contenu": [fiche.typeContenu],
    Lien: "https://refugies.info/" + fiche.typeContenu + "/" + fiche._id,
    "Thème principal": tag1,
    "Thème secondaire 1": tag2,
    "Thème secondaire 2": tag3,
    "Zone d'action": zoneAction,
    "Age requis": ageRequis,
    "Public visé": publicVise,
    "Niveau de français": niveauFrancais,
    "Combien ça coute": prix,
    Durée: duree,
    "Nombre de vues": fiche.nbVues || 0,
    "Besoins": besoins,
    "Date de dernière mise à jour": fiche.updatedAt,
  };

  return { fields: formattedResult };
};
export const exportFiches = async (
  req: RequestFromClientWithBody<{}>,
  res: Res
) => {
  try {
    logger.info("[exportFiches] received");

    checkRequestIsFromSite(req.fromSite);

    const fiches = await getDispositifArray(
      { status: "Actif" },
      {
        updatedAt: 1,
        needs: 1
      },
      "needs"
    );

    let result: { fields: Result }[] = [];

    // @ts-ignore
    fiches.forEach((fiche) => {
      try {
        const formattedFiche = formatFiche(fiche);
        result.push(formattedFiche);
        if (result.length === 10) {
          exportFichesInAirtable(result);
          result = [];
        }
        return;
      } catch (error) {
        logger.error("error with fiche", {
          _id: fiche._id,
          error: error.message,
        });
      }
    });

    if (result.length > 0) {
      exportFichesInAirtable(result);
    }

    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[exportFiches] error", { error: error.message });
  }
};
