const { Traduction } = require("../../schema/schemaTraduction");
const Article = require("../../schema/schemaArticle.js");
const Indicator = require("../../schema/schemaIndicators");
const { Dispositif } = require("../../schema/schemaDispositif");
const Error = require("../../schema/schemaError");
const { User } = require("../../schema/schemaUser");
var sanitizeHtml = require("sanitize-html");
var himalaya = require("himalaya");
var h2p = require("html2plaintext");
const axios = require("axios");
const sanitizeOptions = require("../../libs/data");
const _ = require("lodash");
const { turnHTMLtoJSON, turnJSONtoHTML } = require("../dispositif/functions");
const mongoose = require("mongoose");
const {
  addOrUpdateDispositifInContenusAirtable,
} = require("../miscellaneous/airtable");
const logger = require("../../logger");
const { updateLanguagesAvancement } = require("../langues/langues.service");

const pointeurs = ["titreInformatif", "titreMarque", "abstract"];

const instance = axios.create();
instance.defaults.timeout = 12000000;

// we have to convert objectId to string to compare it with other strings
const deduplicateArrayOfObjectIds = (arrayOfObjectIds) =>
  _.uniq(arrayOfObjectIds.map((x) => x.toString()));

const _errorHandler = (error, res) => {
  switch (error) {
    case 500:
      res.status(500).json({
        text: "Erreur interne",
      });
      break;
    case 404:
      res.status(404).json({
        text: "Pas de résultats",
      });
      break;
    default:
      res.status(500).json({
        text: "Erreur interne",
      });
  }
};

const _findNodeAndReplace = (initial, translated, locale, id) => {
  let children = initial.children || initial || [];
  for (var i = 0; i < children.length; i++) {
    let node = children[i];
    let attributes = node.attributes || [];
    for (var j = 0; j < attributes.length; j++) {
      if (attributes[j].key === "id" && attributes[j].value === id) {
        //On passe le correctif
        if (
          node.children.length === 1 &&
          node.children[0].content &&
          translated.length === 1 &&
          translated[0].children.length === 1 &&
          translated[0].children[0].children.length === 1 &&
          translated[0].children[0].children[0].content
        ) {
          node.children[0].content[locale] =
            translated[0].children[0].children[0].content;
          return true;
        }
        return false;
      }
    }
    if ((node.children || []).length > 0) {
      if (!_findNodeAndReplace(node, translated, locale, id)) return false;
    }
  }
  return true;
};

//We insert the information of the validated translation inside the dispositif document
//The way it works is by creating a key for each translation in every part of the dispositif, so this is why we create a 'fr' key and move the original text of the dispositif to that.
const insertInDispositif = (res, traduction, locale) => {
  return Dispositif.findOne({ _id: traduction.articleId }).exec(
    (err, result) => {
      if (!err && result) {
        pointeurs.forEach((x) => {
          if (!result[x] || !traduction.translatedText[x]) {
            return;
          }
          if (!result[x].fr) {
            result[x] = { fr: result[x] };
          }

          result[x][locale] = traduction.translatedText[x];
          result.markModified(x);
        });

        result.contenu.forEach((p, i) => {
          if (p.title) {
            if (!p.title.fr) {
              p.title = { fr: p.title };
            }
            p.title[locale] = traduction.translatedText.contenu[i].title;
          }
          if (p.content) {
            if (!p.content.fr) {
              p.content = { fr: p.content };
            }
            p.content[locale] = traduction.translatedText.contenu[i].content;
          }
          if (p.children && p.children.length > 0) {
            p.children.forEach((c, j) => {
              if (
                c.title &&
                traduction.translatedText.contenu[i] &&
                traduction.translatedText.contenu[i].children &&
                traduction.translatedText.contenu[i].children[j] &&
                traduction.translatedText.contenu[i].children[j].title
              ) {
                if (!c.title.fr) {
                  c.title = { fr: c.title };
                }
                c.title[locale] =
                  traduction.translatedText.contenu[i].children[j].title;
              }
              if (
                c.content &&
                traduction.translatedText.contenu[i] &&
                traduction.translatedText.contenu[i].children &&
                traduction.translatedText.contenu[i].children[j] &&
                traduction.translatedText.contenu[i].children[j].content
              ) {
                if (!c.content.fr) {
                  c.content = { fr: c.content };
                }
                c.content[locale] =
                  traduction.translatedText.contenu[i].children[j].content;
              }
              if (
                c.contentTitle &&
                traduction.translatedText.contenu[i] &&
                traduction.translatedText.contenu[i].children &&
                traduction.translatedText.contenu[i].children[j] &&
                traduction.translatedText.contenu[i].children[j].contentTitle
              ) {
                if (!c.contentTitle.fr) {
                  c.contentTitle = { fr: c.contentTitle };
                }
                c.contentTitle[locale] =
                  traduction.translatedText.contenu[i].children[j].contentTitle;
              }
            });
          }
        });
        result.markModified("contenu");

        const translationsToAdd = traduction.traductions
          ? traduction.traductions.map((x) => x._id)
          : [];

        const translations = (result.traductions || []).concat(
          translationsToAdd
        );

        const deduplicatedTranslations = deduplicateArrayOfObjectIds(
          translations
        );

        result.traductions = deduplicatedTranslations;

        const participantsToAdd = traduction.traductions
          ? traduction.traductions.map((x) => (x.userId || {})._id)
          : [];

        const participants = (result.participants || []).concat(
          participantsToAdd
        );

        const deduplicatedParticipants = deduplicateArrayOfObjectIds(
          participants
        );

        result.participants = deduplicatedParticipants;

        if (result.avancement === 1) {
          result.avancement = { fr: 1 };
        }
        result.avancement = {
          ...result.avancement,
          [locale]: 1,
        };

        return result.save((err, data) => {
          if (err) {
            res.status(500).json({ text: "Erreur interne" });
          } else {
            res.status(200).json({
              text: "Succès",
              data: data,
            });
            try {
              if (result.typeContenu === "dispositif") {
                addOrUpdateDispositifInContenusAirtable(
                  "",
                  "",
                  result.id,
                  [],
                  locale
                );
              }
            } catch (error) {
              logger.error("error while updating contenu in airtable", {
                error,
              });
            }
            try {
              logger.info("[add_Trad] updating avancement");
              updateLanguagesAvancement();
            } catch (error) {
              logger.error("[add_dispositif] error while updating avancement", {
                error,
              });
            }
          }
          return res;
        });
      }
      res.status(400).json({ text: "Erreur d'identification du dispositif" });
      return res;
    }
  );
};

//we add a translation document, everytime a title or paragraph is translated

async function add_tradForReview(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  }
  if (!req.body || !req.body.langueCible || !req.body.translatedText) {
    return res.status(400).json({ text: "Requête invalide" });
  }
  let traduction = req.body;
  const { wordsCount, timeSpent, langueCible, articleId } = traduction;
  //We save a new indicator document to know the number of words translated and the time spent, this is needed for stats in the front
  new Indicator({
    userId: req.userId,
    dispositifId: articleId,
    language: langueCible,
    timeSpent,
    wordsCount,
  }).save();

  //we assign a status depending on wheter the translator is expert or not, and whether the translation has been completed at 100% or not
  if (traduction.avancement >= 1 && traduction.status !== "À revoir") {
    traduction.status = "En attente";
    await Traduction.updateMany(
      {
        articleId: traduction.articleId,
        langueCible: traduction.langueCible,
      },
      { status: "En attente" },
      { upsert: false }
    );
  }
  if (!traduction.isExpert) {
    if (traduction.avancement < 1 && traduction.status !== "À revoir") {
      traduction.status = "À traduire";
    }
  }
  let nbMotsTitres = 0;
  let nbMotsBody = 0;

  JSON.parse(JSON.stringify(traduction.translatedText));
  //On transforme le html en JSON après l'avoir nettoyé
  if (traduction.translatedText.contenu) {
    //le cas des dispositifs
    traduction.nbMots = turnHTMLtoJSON(traduction.translatedText.contenu);
  } else {
    let html = traduction.translatedText.body || traduction.translatedText;
    let safeHTML = sanitizeHtml(html, sanitizeOptions); //On nettoie le html
    if (
      traduction.initialText.body &&
      traduction.initialText.body === h2p(traduction.initialText.body)
    ) {
      //Si le texte initial n'a pas de html, je force le texte traduit à ne pas en avoir non plus
      safeHTML = h2p(html);
    }

    if (!traduction.isStructure) {
      let jsonBody = himalaya.parse(safeHTML, {
        ...himalaya.parseDefaults,
        includePositions: true,
      });
      traduction.translatedText = traduction.translatedText.body
        ? { ...traduction.translatedText, body: jsonBody }
        : jsonBody;
    } else {
      traduction = {
        ...traduction,
        jsonId: traduction.articleId,
        articleId: traduction.id,
      };
      delete traduction.id;
    }
    nbMotsBody = h2p(safeHTML).split(/\s+/).length || 0;

    if (
      traduction.initialText &&
      traduction.initialText.body &&
      !traduction.isStructure
    ) {
      traduction.initialText.body = himalaya.parse(
        sanitizeHtml(traduction.initialText.body, sanitizeOptions),
        { ...himalaya.parseDefaults, includePositions: true }
      );
    }
    if (traduction.initialText && traduction.initialText.title) {
      traduction.initialText.title = h2p(traduction.initialText.title);
    }
    if (traduction.translatedText.title) {
      traduction.translatedText.title = h2p(traduction.translatedText.title);
      nbMotsTitres = traduction.translatedText.title.split(/\s+/).length || 0;
    }
    traduction.nbMots = nbMotsBody + nbMotsTitres;
  }

  traduction.userId = req.userId;
  let promise;
  // if the translation exists we update it, if not we create a new one and the we update the User document by adding the reference of the translation done
  if (traduction._id) {
    promise = Traduction.findOneAndUpdate({ _id: traduction._id }, traduction, {
      upsert: true,
      new: true,
    });
  } else {
    promise = new Traduction(traduction).save();
  }
  promise
    .then((data) => {
      if (req.userId) {
        User.findByIdAndUpdate(
          { _id: req.userId },
          {
            $addToSet: {
              traductionsFaites: data._id,
              roles: ((req.roles || []).find((x) => x.nom === "Trad") || {})
                ._id,
            },
          },
          { new: true }
        );
      }
      res.status(200).json({
        text: "Succès",
        data: data,
      });
      //calculateScores(data, traductionInitiale); //On recalcule les scores de la traduction
    })
    .catch((err) => {
      res.status(500).json({ text: "Erreur interne" });
    });
}

//We retrieve the list of translations
function get_tradForReview(req, res) {
  let { query, sort, populate, random, locale } = req.body;
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
  if (
    query.articleId &&
    typeof query.articleId === "string" &&
    query.articleId.includes("struct_")
  ) {
    res.status(404).json({ text: "Pas de données", data: [] });
    return false;
  }

  let promise;
  if (random) {
    promise = Traduction.aggregate([
      {
        $match: {
          status: "En attente",
          type: "string",
          langueCible: locale,
          avancement: 1,
        },
      },
      { $sample: { size: 1 } },
    ]);
  } else {
    promise = Traduction.find(query).sort(sort).populate(populate);
  }

  promise
    .then((results) => {
      [].forEach.call(results, (result) => {
        if (result && result.type === "dispositif" && result.translatedText) {
          turnJSONtoHTML(result.translatedText.contenu);
        }
      });
      res.status(200).json({
        text: "Succès",
        data: results,
      });
    })
    .catch((err) => {
      res.status(500).json({
        text: "Erreur interne",
        error: err,
      });
    });
}

//This function validates the final translation and call a function to save the content in the dispositif
async function validate_tradForReview(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body || !req.body.articleId || !req.body.translatedText) {
    res.status(400).json({ text: "Requête invalide" });
  } else if (
    !((req.user || {}).roles || {}).some(
      (x) => x.nom === "ExpertTrad" || x.nom === "Admin"
    )
  ) {
    res.status(401).json({ text: "Token invalide" });
  } else {
    try {
      let traductionUser = req.body || {};
      /*       if (traductionUser.translatedText.contenu) {
        //le cas des dispositifs
        traductionUser.nbMots = turnHTMLtoJSON(traductionUser.translatedText.contenu);
      } */
      //Ici il y en a plusieurs: à régler
      // We update the translation for the expert, by changing the status to validated
      if (traductionUser.type === "dispositif") {
        if (!traductionUser.traductions.length) {
          Traduction.findOneAndUpdate(
            { _id: traductionUser._id },
            { status: "Validée", validatorId: req.userId },
            { upsert: true, new: true }
          );
        } else {
          (traductionUser.traductions || [])
            .slice(0)
            .reverse()
            .map((x) => {
              Traduction.findOneAndUpdate(
                { _id: x._id },
                { status: "Validée", validatorId: req.userId },
                { upsert: true, new: true }
              );
            });
        }
        // We delete all translations that are not from experts, since now we only need one official validated version
        await Traduction.deleteMany({
          articleId: req.body.articleId,
          langueCible: req.body.locale,
          isExpert: { $ne: true },
        });
        // !IMPORTANT We insert the validated translation in the dispositif
        insertInDispositif(res, traductionUser, traductionUser.locale);
      } else {
        //Validating a translation in case it's an article
        Traduction.findOneAndUpdate(
          { _id: traductionUser._id },
          { status: "Validée", validatorId: req.userId },
          { upsert: true, new: true }
        ).then(
          (data_traduction) => {
            let traduction = data_traduction;
            Article.findOne({ _id: traduction.articleId }).exec(
              (err, result) => {
                if (!err) {
                  if (result.body && result.body.constructor === Array) {
                    if (
                      !_findNodeAndReplace(
                        result.body,
                        traduction.translatedText,
                        traduction.langueCible,
                        traduction.rightId
                      )
                    ) {
                      res.status(501).json({ text: "Erreur d'insertion" });
                    } else {
                      //console.log(JSON.stringify(result.body));
                      result.markModified("body");
                      result.save((err, article_saved) => {
                        if (err) {
                          res.status(500).json({ text: "Erreur interne" });
                        } else {
                          res.status(200).json({
                            text: "Succès",
                            data: article_saved,
                            data_traduction: data_traduction,
                          });
                        }
                      });
                    }
                  }
                } else {
                  res
                    .status(400)
                    .json({ text: "Erreur d'identification de l'article" });
                }
              }
            );
          },
          () => {
            res.status(500).json({
              text: "Erreur interne",
            });
          }
        );
      }
    } catch (err) {
      new Error({
        name: "validateTradModifications",
        userId: req.userId,
        dataObject: {
          body: req.body,
        },
        error: err,
      }).save();

      res.status(500).json({
        text: "Erreur interne",
      });
    }
  }
}

//We update the trad for the expert in case it already exists
function update_tradForReview(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (
    !req.user.roles.some(
      (x) => x.nom === "ExpertTrad" || x.nom === "Admin" || x.nom === "Trad"
    )
  ) {
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
  new Indicator({
    userId: req.userId,
    dispositifId: articleId,
    language,
    timeSpent,
    wordsCount,
  }).save();

  const find = new Promise(function (resolve, reject) {
    Traduction.findByIdAndUpdate({ _id: translation._id }, translation, {
      new: true,
      upsert: true,
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
        data: result,
      });
    },
    (e) => _errorHandler(e, res)
  );
}

export const computeIndicator = async (userId, start, end) =>
  await Indicator.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: end, $lt: start },
      },
    },
    {
      $group: {
        _id: null,
        wordsCount: { $sum: "$wordsCount" },
        timeSpent: { $sum: "$timeSpent" },
      },
    },
  ]);

export const computeGlobalIndicator = async (userId) =>
  await Indicator.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        wordsCount: { $sum: "$wordsCount" },
        timeSpent: { $sum: "$timeSpent" },
      },
    },
  ]);

export const computeAllIndicators = async (userId) => {
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
  const threeMonthsIndicator = await computeIndicator(userId, start, end3);

  const sixMonthsIndicator = await computeIndicator(userId, start, end6);
  const twelveMonthsIndicator = await computeIndicator(userId, start, end12);

  const totalIndicator = await computeGlobalIndicator(userId);

  return {
    twelveMonthsIndicator,
    sixMonthsIndicator,
    threeMonthsIndicator,
    totalIndicator,
  };
};
//Fetching the progression from the indicators collection
async function get_progression(req, res) {
  try {
    const {
      twelveMonthsIndicator,
      sixMonthsIndicator,
      threeMonthsIndicator,
      totalIndicator,
    } = await computeAllIndicators(req.body.userId || req.userId);

    res.send({
      twelveMonthsIndicator,
      sixMonthsIndicator,
      threeMonthsIndicator,
      totalIndicator,
    });
  } catch (e) {
    res.status(500).json({ text: "Erreur interne", err: e });
  }
}

//call to delete the trads for a specific dispositif and language, only available for admin
async function delete_trads(req, res) {
  try {
    if (!req.fromSite) {
      return res.status(405).json({ text: "Requête bloquée par API" });
    } else if (!req.body) {
      return res.status(400).json({ text: "Requête invalide" });
    } else if (!req.user.roles.some((x) => x.nom === "Admin")) {
      logger.info("[delete_trads] user in not admin", { user: req.user.roles });
      return res.status(400).json({ text: "Requête invalide" });
    }
    logger.info("[delete_trads] received", { data: req.body });
    await Traduction.deleteMany({
      articleId: req.body.articleId,
      langueCible: req.body.langueCible,
    });
    res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[delete_trads] error", { error: error.message });
    return res.status(400).json({ text: "Requête invalide" });
  }
}

//On exporte notre fonction
exports.add_tradForReview = add_tradForReview;
exports.get_tradForReview = get_tradForReview;
exports.validate_tradForReview = validate_tradForReview;
exports.update_tradForReview = update_tradForReview;
exports.get_progression = get_progression;
exports.delete_trads = delete_trads;
