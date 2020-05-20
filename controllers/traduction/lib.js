const Traduction = require("../../schema/schemaTraduction.js");
const Article = require("../../schema/schemaArticle.js");
const Dispositif = require("../../schema/schemaDispositif.js");
const Langue = require("../../schema/schemaLangue.js");
const Role = require("../../schema/schemaRole.js");
const User = require("../../schema/schemaUser.js");
var sanitizeHtml = require("sanitize-html");
var himalaya = require("himalaya");
var h2p = require("html2plaintext");
const axios = require("axios");
const sanitizeOptions = require("../article/lib.js").sanitizeOptions;
const DBEvent = require("../../schema/schemaDBEvent.js");
const _ = require("lodash");
const { turnHTMLtoJSON, turnJSONtoHTML } = require("../dispositif/functions");

const headers = {
  "Content-Type": "application/json",
};

let burl = "https://laser-agir.herokuapp.com";
// if(process.env.NODE_ENV === 'dev'){burl = 'http://localhost:5001' }
const pointeurs = ["titreInformatif", "titreMarque", "abstract"];

const instance = axios.create();
instance.defaults.timeout = 12000000;

async function add_tradForReview(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body || !req.body.langueCible || !req.body.translatedText) {
    return res.status(400).json({ text: "Requête invalide" });
  } else {
    new DBEvent({
      action: JSON.stringify(req.body),
      userId: _.get(req, "userId"),
      roles: _.get(req, "user.roles"),
      api: arguments.callee.name,
    }).save();
    let traduction = req.body;
    if (traduction.avancement >= 1) {
      traduction.status = "En attente";
      await Traduction.updateMany({articleId: traduction.articleId, langueCible: traduction.langueCible }, {status: 'En attente'}, { upsert: false });
    }
    if (!traduction.isExpert) {
      if (traduction.avancement < 1) {
        traduction.status = "À traduire";
      }
    }
    if (traduction.isExpert) {
    }
    let nbMotsTitres = 0;
    nbMotsBody = 0;
    const traductionInitiale = JSON.parse(
      JSON.stringify(traduction.translatedText)
    );
    //On transforme le html en JSON après l'avoir nettoyé

    if (traduction.translatedText.contenu) {
      //le cas des dispositifs
      console.log("before func", traduction);
      traduction.nbMots = turnHTMLtoJSON(traduction.translatedText.contenu);
      console.log("after funct", traduction);
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
    console.log("traduction before update", traduction);

    if (traduction._id) {
      promise = Traduction.findOneAndUpdate(
        { _id: traduction._id },
        traduction,
        { upsert: true, new: true }
      );
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
            { new: true },
            (e) => {
              if (e) {
                console.log(e);
              }
            }
          );
        }
        res.status(200).json({
          text: "Succès",
          data: data,
        });
        //calculateScores(data, traductionInitiale); //On recalcule les scores de la traduction
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ text: "Erreur interne" });
      });
  }
}

function get_tradForReview(req, res) {
  new DBEvent({
    action: JSON.stringify(req.body),
    userId: _.get(req, "userId"),
    roles: _.get(req, "user.roles"),
    api: arguments.callee.name,
  }).save();
  let { query, sort, populate, random, locale } = req.body;
  console.log(query);
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
      console.log(results);
      [].forEach.call(results, (result) => {
        if (result && result.type === "dispositif" && result.translatedText) {
          turnJSONtoHTML(result.translatedText.contenu);
        }
      });
      console.log(results);
      res.status(200).json({
        text: "Succès",
        data: results,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        text: "Erreur interne",
        error: err,
      });
    });
}

function validate_tradForReview(req, res) {
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
    new DBEvent({
      action: JSON.stringify(req.body),
      userId: _.get(req, "userId"),
      roles: _.get(req, "user.roles"),
      api: arguments.callee.name,
    }).save();
    let traductionUser = req.body || {};
    //Ici il y en a plusieurs: à régler
    console.log("xxxxxxxxxx", traductionUser);
    if (traductionUser.type === "dispositif") {
      if (!traductionUser.traductions.length) {
        console.log("fiiiirst", traductionUser.traductions.length);
        Traduction.findOneAndUpdate(
          { _id: traductionUser._id },
          { status: "Validée", validatorId: req.userId },
          { upsert: true, new: true }
        ).then(() => console.log("updated"));
      } else {
        (traductionUser.traductions || [])
          .slice(0)
          .reverse()
          .map((x) => {
            console.log("secondddd", traductionUser.traductions);
            Traduction.findOneAndUpdate(
              { _id: x._id },
              { status: "Validée", validatorId: req.userId },
              { upsert: true, new: true }
            ).then(() => console.log("updated"));
          });
      }
      console.log("before insert");
      insertInDispositif(res, traductionUser, traductionUser.locale);
    } else {
      Traduction.findOneAndUpdate(
        { _id: traductionUser._id },
        { status: "Validée", validatorId: req.userId },
        { upsert: true, new: true }
      ).then(
        (data_traduction) => {
          let traduction = data_traduction;
          Article.findOne({ _id: traduction.articleId }).exec((err, result) => {
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
                      console.log(err);
                      res.status(500).json({ text: "Erreur interne" });
                    } else {
                      console.log("succes");
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
              console.log(err);
              res
                .status(400)
                .json({ text: "Erreur d'identification de l'article" });
            }
          });
        },
        (err) => {
          console.log(err);
          res.status(500).json({
            text: "Erreur interne",
          });
        }
      );
    }
  }
}

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
                console.log(
                  "check before insertion of childrren:",
                  traduction,
                  traduction.translatedText.contenu[i].children[j]
                );
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
                console.log(
                  "check before insertion of childrren:",
                  traduction,
                  traduction.translatedText.contenu[i].children[j]
                );
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
                console.log(
                  "check before insertion of childrren:",
                  traduction,
                  traduction.translatedText.contenu[i].children[j]
                );
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
            console.log(err);
            res.status(500).json({ text: "Erreur interne" });
          } else {
            console.log("succes");
            res.status(200).json({
              text: "Succès",
              data: data,
            });
          }
          return res;
        });
      } else {
        console.log(err);
        res.status(400).json({ text: "Erreur d'identification du dispositif" });
        return res;
      }
    }
  );
};

// we have to convert objectId to string to compare it with other strings
const deduplicateArrayOfObjectIds = (arrayOfObjectIds) =>
  _.uniq(arrayOfObjectIds.map((x) => x.toString()));

const recalculate_all = () => {
  Traduction.find({}).exec(function (err, result) {
    if (!err && result) {
      result.forEach((x) => {
        let traductionInitiale = { ...x.translatedText };
        traductionInitiale.contenu = turnJSONtoHTML(
          traductionInitiale.contenu || traductionInitiale.body
        );
        console.log("calculating : ", x._id);
        calculateScores(x, traductionInitiale);
      });
    }
  });
};
// recalculate_all();

async function calculateScores(data, traductionInitiale) {
  let newTrad = {
    _id: data._id,
    initialText: data.initialText,
    translatedText: { ...data.translatedText },
  };
  if (!data || !data.initialText) {
    console.log("pas de data.initialText");
    return false;
  }
  if (!traductionInitiale) {
    console.log("pas de traductionInitiale");
    return false;
  }

  if (data.type === "string") {
    const sentences = [
      [h2p(traductionInitiale.body), data.langueCible],
      [h2p(data.initialText.body), "fr"],
    ];
    newTrad.translatedText.scoreBody = await getScore(sentences);
  } else {
    const pointeurs = ["titreInformatif", "titreMarque", "abstract"];
    newTrad.translatedText.scoreHeaders = {};
    await asyncForEach(pointeurs, async (x) => {
      if (traductionInitiale[x]) {
        const sentences = [
          [h2p(traductionInitiale[x]), data.langueCible],
          [h2p(data.initialText[x]), "fr"],
        ];
        newTrad.translatedText.scoreHeaders[x] = await getScore(sentences);
      }
    });
    await asyncForEach(traductionInitiale.contenu, async (x, i) => {
      if (x) {
        if (x.content && x.content !== "") {
          const sentences = [
            [h2p(x.content), data.langueCible],
            [h2p(data.initialText.contenu[i].content), "fr"],
          ];
          newTrad.translatedText.contenu[i].scoreContent = await getScore(
            sentences
          );
        }
        await asyncForEach(x.children, async (y, j) => {
          if (y) {
            if (y.content && y.content !== "") {
              const sentences = [
                [h2p(y.content), data.langueCible],
                [h2p(data.initialText.contenu[i].children[j].content), "fr"],
              ];
              newTrad.translatedText.contenu[i].children[
                j
              ].scoreContent = await getScore(sentences);
            }
            if (y.title && y.title !== "") {
              const sentences = [
                [h2p(y.title), data.langueCible],
                [h2p(data.initialText.contenu[i].children[j].title), "fr"],
              ];
              newTrad.translatedText.contenu[i].children[
                j
              ].scoreTitle = await getScore(sentences);
            }
          }
        });
      }
    });
  }
  return Traduction.findOneAndUpdate({ _id: newTrad._id }, newTrad, {
    upsert: true,
    new: true,
  })
    .then((d) => console.log("succes : ", d._id))
    .catch((e) => console.log(e));
}

function getScore(sentences) {
  return instance
    .post(burl + "/laser", { sentences: sentences }, { headers: headers })
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((e) =>
      console.log(
        (e.config || {}).data,
        (e.response || {}).status,
        (e.response || {}).statusText,
        !e.response && e
      )
    );
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < (array || []).length; index++) {
    await callback(array[index], index, array);
  }
}

function get_laser(req, res) {
  if (!req.body || !req.body.sentences) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    new DBEvent({
      action: JSON.stringify(req.body),
      userId: _.get(req, "userId"),
      roles: _.get(req, "user.roles"),
      api: arguments.callee.name,
    }).save();
    sentences = req.body.sentences;
    axios
      .post(burl + "/laser", { sentences: sentences }, { headers: headers })
      .then((data) => {
        res.status(200).json({
          text: "Succès",
          data: data.data,
        });
      });
  }
}

function get_xlm(req, res) {
  if (!req.body || !req.body.sentences) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    new DBEvent({
      action: JSON.stringify(req.body),
      userId: _.get(req, "userId"),
      roles: _.get(req, "user.roles"),
      api: arguments.callee.name,
    }).save();
    burl = "https://xlm-agir.herokuapp.com";
    if (process.env.NODE_ENV === "dev") {
      burl = "http://localhost:5002";
    }
    sentences = req.body.sentences;
    axios
      .post(burl + "/xlm", { sentences: sentences }, { headers: headers })
      .then((data) => {
        res.status(200).json({
          text: "Succès",
          data: data.data,
        });
      });
  }
}

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
        } else {
          console.log("cas compliqué à retraiter");
          return false;
        }
      }
    }
    if ((node.children || []).length > 0) {
      if (!_findNodeAndReplace(node, translated, locale, id)) return false;
    }
  }
  return true;
};

function update_tradForReview(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (
    !req.user.roles.some(
      (x) => x.nom === "ExpertTrad" || x.nom === "Admin" || x.nom === "Trad"
    )
  ) {
    return res.status(400).json({ text: "Requête invalide" });
  } else {
    new DBEvent({
      action: JSON.stringify(req.body),
      userId: _.get(req, "userId"),
      roles: _.get(req, "user.roles"),
      api: arguments.callee.name,
    }).save();
    let translation = req.body;
    translation.validatorId = req.userId;
    console.log("we are updating the mother", translation);
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
}

function get_progression(req, res) {
  new DBEvent({
    userId: _.get(req, "userId"),
    roles: _.get(req, "user.roles"),
    api: arguments.callee.name,
  }).save();
  var start = new Date();
  start.setHours(0, 0, 0, 0);

  var find = new Promise(function (resolve, reject) {
    Traduction.aggregate([
      {
        $match: {
          userId: req.userId,
          //  'created_at': {$gte: start},
          timeSpent: { $ne: null },
        },
      },
      {
        $group: {
          _id: req.userId,
          nbMots: { $sum: "$nbMots" },
          timeSpent: { $sum: "$timeSpent" },
          count: { $sum: 1 },
        },
      },
    ]).exec(function (err, result) {
      if (err) {
        reject(500);
      } else {
        if (result) {
          resolve(result);
        } else {
          reject(404);
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

const updateRoles = () => {
  Langue.find().exec(function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result) {
        Role.findOne({ nom: "Trad" }).exec((err_role, result_role) => {
          console.log("result_role._id", result_role._id);
          if (!err_role && result_role) {
            result.forEach((x) => {
              const traducteurs = x.participants;
              traducteurs.forEach((y) => {
                User.findByIdAndUpdate(
                  { _id: y },
                  { $addToSet: { roles: result_role._id } },
                  { new: true },
                  (e) => {
                    if (e) {
                      console.log(e);
                    }
                  }
                );
              });
            });
          }
        });
      } else {
        console.log(204);
      }
    }
  });
};

async function delete_trads(req, res) {
  console.log(req);
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body) {
    return res.status(400).json({ text: "Requête invalide" });
  } else {
    console.log(req.body);
  };
}

//On exporte notre fonction
exports.add_tradForReview = add_tradForReview;
exports.get_tradForReview = get_tradForReview;
exports.validate_tradForReview = validate_tradForReview;
exports.update_tradForReview = update_tradForReview;
exports.get_progression = get_progression;
exports.get_xlm = get_xlm;
exports.get_laser = get_laser;
exports.delete_trads = delete_trads;
