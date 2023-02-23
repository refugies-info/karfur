import { getDispositifById } from "../../modules/dispositif/dispositif.repository";
import { DispositifId, ObjectId, IndicatorModel, Languages, Traductions, TraductionsModel } from "../../typegoose";
import { TranslationContent } from "../../typegoose/Dispositif";
import { Request, RequestFromClient, RequestFromClientWithBody, Res } from "../../types/interface";

const axios = require("axios");
const { turnHTMLtoJSON } = require("../dispositif/functions");
const mongoose = require("mongoose");

const logger = require("../../logger");

const instance = axios.create();
instance.defaults.timeout = 12000000;

const _errorHandler = (error: Error | number, res: Res) => {
  switch (error) {
    case 500:
      res.status(500).json({
        text: "Erreur interne"
      });
      break;
    case 404:
      res.status(404).json({
        text: "Pas de résultats"
      });
      break;
    default:
      res.status(500).json({
        text: "Erreur interne"
      });
  }
};

interface AddTraductionForReviewRequest {
  locale: Languages;
  timeSpent: number;
  dispositifId: DispositifId;
  translated: Partial<TranslationContent>;
}

//we add a translation document, everytime a title or paragraph is translated
async function add_tradForReview(req: RequestFromClientWithBody<AddTraductionForReviewRequest>, res: Res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  }
  if (!req.body || !req.body.locale) {
    return res.status(400).json({ text: "Requête invalide" });
  }
  let traduction = req.body;
  const { timeSpent, locale, dispositifId, translated } = traduction;

  const dispositif = await getDispositifById(dispositifId);

  const _traduction = new Traductions();
  _traduction.dispositifId = new ObjectId(dispositifId);
  _traduction.language = locale;
  _traduction.timeSpent = timeSpent;
  _traduction.translated = translated;
  _traduction.type = req.user.isExpert() ? "validation" : "suggestion";
  _traduction.userId = req.user._id;

  _traduction.avancement = Traductions.computeAvancement(dispositif, _traduction); // TODO
  if (req.user.isExpert()) _traduction.validatorId = req.user._id;

  const wordsCount = _traduction.countWords();

  //We save a new indicator document to know the number of words translated and the time spent, this is needed for stats in the front
  await IndicatorModel.create({
    userId: req.userId,
    dispositifId,
    language: locale,
    timeSpent,
    wordsCount
  });

  // // if the translation exists we update it, if not we create a new one and the we update the User document by adding the reference of the translation done
  // if (traduction._id) {
  //   promise = TraductionsModel.findOneAndUpdate({ _id: traduction._id }, traduction, {
  //     upsert: true,
  //     new: true
  //   });
  // } else {
  //   promise = TraductionsModel.create(traduction);
  // }

  /* TODO
   * - Ajouter la "traductionFaites" au user (? faire une jointure plutôt)
   *    - Pourquoi cela existe ??
   * - Ajouter le rôle traducteur ?!? => à faire au moment où il ajoute une langue plutôt non ? Encore mieux => la calculer
   *
   */

  return res.status(200).json({ text: "TODO finish implementation", data: _traduction });
  // //we assign a status depending on wheter the translator is expert or not, and whether the translation has been completed at 100% or not
  // if (traduction.avancement >= 1 && traduction.status !== "À revoir") {
  //   traduction.status = "En attente";
  //   await TraductionsModel.updateMany(
  //     {
  //       articleId: dispositifId,
  //       locale: traduction.locale
  //     },
  //     { status: "En attente" },
  //     { upsert: false }
  //   );
  // }
  // if (!req.user.isExpert()) {
  //   if (traduction.avancement < 1 && traduction.status !== "À revoir") {
  //     traduction.status = "À traduire";
  //   }
  // }

  // let promise;
  // // if the translation exists we update it, if not we create a new one and the we update the User document by adding the reference of the translation done
  // if (traduction._id) {
  //   promise = TraductionsModel.findOneAndUpdate({ _id: traduction._id }, traduction, {
  //     upsert: true,
  //     new: true
  //   });
  // } else {
  //   promise = TraductionsModel.create(traduction);
  // }
  // promise
  //   .then(async (data) => {
  //     try {
  //       if (req.userId) {
  //         await UserModel.findByIdAndUpdate(
  //           { _id: req.userId },
  //           {
  //             $addToSet: {
  //               traductionsFaites: data._id,
  //               roles: ((req.roles || []).find((x) => x.nom === "Trad") || {})._id
  //             }
  //           },
  //           { new: true }
  //         );
  //       }
  //     } catch (e) {
  //       logger.error("[addTradForReview] error", e);
  //     }
  //     res.status(200).json({
  //       text: "Succès",
  //       data: data
  //     });
  //     //calculateScores(data, traductionInitiale); //On recalcule les scores de la traduction
  //   })
  //   .catch(() => {
  //     res.status(500).json({ text: "Erreur interne" });
  //   });
}

interface GetTraductionForReviewRequest { }
type GetTraductionForReviewResponse = Traductions[];

//We retrieve the list of translations
function get_tradForReview(
  req: RequestFromClient<GetTraductionForReviewRequest>,
  // res: Response<GetTraductionForReviewResponse>
  res: Res
) {
  let { query, sort, populate } = req.body;
  if (!req.fromSite) {
    //On n'autorise pas les populate en API externe
    populate = "";
  } else if (populate && populate.constructor === Object) {
    populate.select = "-password";
  } else if (populate) {
    populate = { path: populate, select: "-password" };
  } else {
    populate = "";
  }

  TraductionsModel.find(query)
    .sort(sort)
    .populate(populate)
    .then((results) => {
      res.status(200).json({
        text: "Succès",
        data: results
      });
    })
    .catch((err) => {
      res.status(500).json({
        text: "Erreur interne",
        error: err
      });
    });
}

//We update the trad for the expert in case it already exists
async function update_tradForReview(req: Request, res: Res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!(req.user.hasRole("ExpertTrad") || req.user.isAdmin() || req.user.hasRole("Trad"))) {
    return res.status(400).json({ text: "Requête invalide" });
  }
  let translation = req.body;
  translation.validatorId = req.userId;
  if (translation.translatedText.contenu) {
    //le cas des dispositifs
    translation.nbMots = turnHTMLtoJSON(translation.translatedText.contenu);
  }

  const { wordsCount, timeSpent, language, articleId } = translation;

  //We save a new indicator document to know the number of words translated and the time spent, this is needed for stats in the front
  await IndicatorModel.create({
    userId: req.userId,
    dispositifId: articleId,
    language,
    timeSpent,
    wordsCount
  });

  const find = new Promise(function (resolve, reject) {
    TraductionsModel.findByIdAndUpdate({ _id: translation._id }, translation, {
      new: true,
      upsert: true
    }).exec(function (err, result) {
      if (err) {
        reject(500);
      } else {
        if (result) {
          resolve(result);
        } else {
          reject(204);
        }
      }
    });
  });

  find.then(
    function (result) {
      res.status(200).json({
        text: "Succès",
        data: result
      });
    },
    (e) => _errorHandler(e, res)
  );
}

export const computeIndicator = async (userId: string, start: Date, end: Date) => {
  logger.info("[computeIndicator] received", { userId, start, end });

  return await IndicatorModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: end, $lt: start }
      }
    },
    {
      $group: {
        _id: null,
        wordsCount: { $sum: "$wordsCount" },
        timeSpent: { $sum: "$timeSpent" }
      }
    }
  ]);
};

export interface GlobalIndicator {
  _id: null;
  wordsCount: number;
  timeSpent: number;
}
export const computeGlobalIndicator = async (userId: string): Promise<GlobalIndicator[]> => {
  logger.info("[computeGlobalIndicator] received for userId", userId);

  return IndicatorModel.aggregate<GlobalIndicator>([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $group: {
        _id: null,
        wordsCount: { $sum: "$wordsCount" },
        timeSpent: { $sum: "$timeSpent" }
      }
    }
  ]);
};

export const computeAllIndicators = async (userId: string) => {
  logger.info("[computeAllIndicators] received for userId", userId);
  var start = new Date();
  var end3 = new Date();
  var end6 = new Date();
  var end12 = new Date();
  //we define the different time periods 3/6/12 months
  end3.setMonth(end3.getMonth() - 3);
  end6.setMonth(end6.getMonth() - 6);
  end12.setMonth(end12.getMonth() - 12);
  //start.setHours(0, 0, 0, 0);

  //we aggregate the number of words and time spent in these periods
  try {
    logger.info("[computeAllIndicators] computing indicators");
    const threeMonthsIndicator = await computeIndicator(userId, start, end3);

    const sixMonthsIndicator = await computeIndicator(userId, start, end6);
    const twelveMonthsIndicator = await computeIndicator(userId, start, end12);

    const totalIndicator = await computeGlobalIndicator(userId);

    return {
      twelveMonthsIndicator,
      sixMonthsIndicator,
      threeMonthsIndicator,
      totalIndicator
    };
  } catch (e) {
    logger.error("[computeAllIndicators] error", e);
    return {
      twelveMonthsIndicator: null,
      sixMonthsIndicator: null,
      threeMonthsIndicator: null,
      totalIndicator: null
    };
  }
};
//Fetching the progression from the indicators collection
async function get_progression(req: Request, res: Res) {
  try {
    logger.info("[get_progression] received");
    const { twelveMonthsIndicator, sixMonthsIndicator, threeMonthsIndicator, totalIndicator } =
      await computeAllIndicators(req.body.userId || req.userId);

    logger.info("[get_progression] values calculated");
    res.send({
      twelveMonthsIndicator,
      sixMonthsIndicator,
      threeMonthsIndicator,
      totalIndicator
    });
  } catch (e) {
    res.status(500).json({ text: "Erreur interne", err: e });
  }
}

//call to delete the trads for a specific dispositif and language, only available for admin
async function delete_trads(req: Request, res: Res) {
  try {
    if (!req.fromSite) {
      return res.status(405).json({ text: "Requête bloquée par API" });
    } else if (!req.body) {
      return res.status(400).json({ text: "Requête invalide" });
    } else if (!req.user.isAdmin()) {
      logger.info("[delete_trads] user in not admin", { user: req.user.roles });
      return res.status(400).json({ text: "Requête invalide" });
    }
    logger.info("[delete_trads] received", { data: req.body });
    await TraductionsModel.deleteMany({
      articleId: req.body.articleId,
      langueCible: req.body.langueCible
    });
    res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[delete_trads] error", { error: error.message });
    return res.status(400).json({ text: "Requête invalide" });
  }
}

export { add_tradForReview, delete_trads, get_progression, get_tradForReview, update_tradForReview };
