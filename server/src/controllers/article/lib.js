const Article = require("../../schema/schemaArticle.js");
const Traduction = require("../../schema/schemaTraduction.js");
const { Langue } = require("../../schema/schemaLangue");
const Role = require("../../schema/schemaRole.js");
const { User } = require("../../schema/schemaUser");
const traduction = require("../traduction/lib");
const draftToHtml = require("draftjs-to-html");
const sanitizeHtml = require("sanitize-html");
const himalaya = require("himalaya");
const uniqid = require("uniqid");
const h2p = require("html2plaintext");
const { sanitizeOptions } = require("./data");

let elementId = Math.floor(Math.random() * Math.floor(9999999));
let nombreMots = 0;

function add_traduction(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body || !req.body.articleId) {
    res.status(400).json({ text: "Requête invalide" });
  } else if (!req.body.langueCible) {
    res.status(401).json({ text: "La langue n'est pas spécifiée" });
  } else if (!req.body.translatedText) {
    res.status(402).json({ text: "Pas de contenu de traduction" });
  } else {
    let locale = req.body.langueCible; //TODO :S'assurer que ce locale est autorisé

    //On lui donne le rôle de traducteur
    Role.findOne({ nom: "Trad" }).exec((err, result) => {
      if (!err && result && req.userId) {
        User.findByIdAndUpdate(
          { _id: req.userId },
          { $addToSet: { roles: result._id } },
          { new: true },
          (e) => {
            if (e) {
              // eslint-disable-next-line no-console
              console.log(e);
            }
          }
        );
      }
    });

    //On l'insère en prod seulement si l'utilisateur a les droits admin ou expert en traduction
    if (
      req.body.type !== "dispositif" &&
      req.user.roles.find((x) => x.nom === "Admin" || x.nom === "ExpertTrad") &&
      (req.body.avancement === 1 ||
        req.body.avancement === undefined ||
        req.body.avancement === null) &&
      req.body.translationId
    ) {
      let traductionItem = req.body;
      //On transforme le html en JSON après l'avoir nettoyé
      let html = traductionItem.translatedText.body;
      let safeHTML = sanitizeHtml(html, sanitizeOptions);
      let jsonBody = null;
      if (traductionItem.isStructure) {
        traductionItem = {
          ...traductionItem,
          jsonId: traductionItem.articleId,
          articleId: traductionItem.id,
        };
        delete traductionItem.id;
      } else {
        jsonBody = himalaya.parse(safeHTML, {
          ...himalaya.parseDefaults,
          includePositions: false,
        }); //Réactiver les positions si ça devient utile, mais je ne pense pas
      }

      Article.findOne({ _id: traductionItem.articleId }).exec((err, result) => {
        if (!err && result) {
          let succes = true;
          let avancement = { value: 1 };
          if (
            result.title &&
            result.title.constructor === Object &&
            result.title.fr
          ) {
            result.title[locale] = h2p(req.body.translatedText.title);
            result.markModified("title");
          } else if (!traductionItem.isStructure) {
            succes = false;
          }
          if (
            result.body &&
            (result.body.constructor === Array ||
              (traductionItem.isStructure &&
                result.body.constructor === Object))
          ) {
            let errArr = [];
            if (!traductionItem.isStructure) {
              if (
                // eslint-disable-next-line no-use-before-define
                addTranslationRestructure(result, jsonBody, locale, errArr) ||
                (errArr.length > 0 &&
                  // eslint-disable-next-line no-use-before-define
                  _dealWithErrors(result, jsonBody, locale, errArr))
              ) {
                result.markModified("body");
              } else {
                succes = false;
              }
            } else {
              avancement = {
                value:
                  (result.avancement[locale] || 0) * (result.nombreMots || 0),
              };
              if (
                // eslint-disable-next-line no-use-before-define
                _insertStructTranslation(
                  result.body,
                  traductionItem.translatedText.body,
                  locale,
                  traductionItem.jsonId,
                  avancement
                )
              ) {
                result.markModified("body");
                if (avancement.value && result.nombreMots > 0) {
                  avancement.value = avancement.value / result.nombreMots;
                }
              } else {
                succes = false;
              }
            }
          } else {
            succes = false;
          }
          if (req.body.translationId) {
            result.traductions = [
              ...result.traductions,
              req.body.translationId,
            ];
            result.markModified("translations");
            req.body.update = { status: "Validée" };
            Traduction.findByIdAndUpdate(
              { _id: req.body.translationId },
              { status: "Validée", validatorId: req.userId },
              { new: true }
            ).exec();
          }
          if (succes) {
            result.avancement = {
              ...result.avancement,
              [locale]: avancement.value,
            };
            result.markModified("avancement");
            result.save((err, article_saved) => {
              if (err) {
                res.status(500).json({ text: "Erreur interne" });
              } else {
                //En non-bloquant maintenant, je vais aller mettre à jour l'avancement de la langue cible
                // eslint-disable-next-line no-use-before-define
                _updateAvancement(locale);
                res.status(200).json({
                  text: "Succès",
                  data: article_saved,
                });
              }
            });
          } else {
            // eslint-disable-next-line no-console
            console.log("Erreur à l'enregistrement");
            res
              .status(402)
              .json({ text: "Erreur d'enregistrement des modifications" });
          }
        } else {
          res
            .status(400)
            .json({ text: "Erreur d'identification de l'article" });
        }
      });
    } else {
      return traduction.add_tradForReview(req, res);
    }
  }
}

const make_nodes_unique_and_local = (object, uid) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [].forEach.call(object, (el, i) => {
    if (el.attributes) {
      el.attributes.push({ key: "id", value: uid + "_" + elementId });
      elementId++;
    }
    if (el.content) {
      nombreMots += el.content.length;
      el.content = { fr: el.content }; //On le transforme en contenu localisé
    }
    if ((el.children || []).length > 0) {
      make_nodes_unique_and_local(el.children, uid);
    }
  });
};

const returnLocalizedContent = (object, locale) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [].forEach.call(object, (el, i) => {
    if (el.content) {
      el.content = el.content[locale] || el.content.fr;
    }
    if ((el.children || []).length > 0) {
      returnLocalizedContent(el.children, locale);
    }
  });
};

const addTranslationRestructure = (
  initial,
  translated,
  locale,
  errArr = []
) => {
  let children = initial.children || initial.body || [];
  let isSucces = true;
  for (var i = 0; i < children.length; i++) {
    let node = children[i];
    if (
      node.content &&
      node.content.fr &&
      node.content.fr.replace(/\s/g, "").length
    ) {
      //On enlève le cas où le string contient seulement des espaces ou des saunts de ligne, pas besoin de traduire
      let attributes = initial.attributes || [];
      for (var j = 0; j < attributes.length; j++) {
        if (attributes[j].key === "id") {
          let id = attributes[j].value;
          //On va chercher cet identifiant dans le JSON traduit
          let translatedJSON = translated.children
            ? translated
            : { children: translated };
          // eslint-disable-next-line no-use-before-define
          let right_node = _findId(translatedJSON, id);
          // eslint-disable-next-line no-use-before-define
          if (!_correctNodewithLocale(right_node, node, id, locale, i, errArr))
            isSucces = false;
        }
      }
    } else if ((node.children || []).length > 0) {
      if (!addTranslationRestructure(node, translated, locale, errArr))
        isSucces = false;
    }
  }
  return isSucces;
};

const _insertStructTranslation = (
  initial,
  translated,
  locale,
  id,
  avancement
) => {
  let succes = false;
  Object.keys(initial).forEach((key) => {
    if (initial[key] && initial[key].id) {
      if (initial[key].id === id) {
        initial[key][locale] =
          initial[key].fr && initial[key].fr === h2p(initial[key].fr)
            ? h2p(translated)
            : sanitizeHtml(translated, sanitizeOptions);
        avancement.value += initial[key].fr.trim().split(/\s+/).length;
        succes = true;
        return true;
      }
    } else if (initial[key].constructor === Object && !succes) {
      succes = _insertStructTranslation(
        initial[key],
        translated,
        locale,
        id,
        avancement
      );
      if (succes) {
        return true;
      }
    }
  });
  return succes;
};

const _correctNodewithLocale = (
  right_node,
  node,
  id,
  locale,
  i,
  errArr = []
) => {
  if (right_node) {
    if (
      right_node.children.length === 1 &&
      right_node.children[0].content.replace(/\s/g, "").length
    ) {
      node.content[locale] = right_node.children[0].content;
      right_node.children[0].inserted = true;
    } else if (right_node.children.length === 0) {
      errArr.push({ right_node: right_node, node: node, id: id, i: i });
      return false;
    } else {
      let nbWithContent = 0;
      let idArray = [];
      for (var k = 0; k < right_node.children.length; k++) {
        if (
          right_node.children[k].content &&
          right_node.children[k].content.replace(/\s/g, "").length
        ) {
          nbWithContent++;
          idArray.push(k);
        }
      }
      if (nbWithContent === 1) {
        //Cas simple où y a qu'un seul des noeuds enfants qui a du contenu
        node.content[locale] = right_node.children[idArray[0]].content;
        right_node.children[idArray[0]].inserted = true;
      } else {
        if (right_node.children.length >= i && right_node.children[i].content) {
          if (right_node.children[i].content.replace(/\s/g, "").length) {
            //A défaut je me dis qu'il est sûrement situé au même endroit
            node.content[locale] = right_node.children[i].content;
            right_node.children[i].inserted = true;
          } else if (idArray.length === 2 && idArray.indexOf(i) !== -1) {
            //Si le string traduit est vide et qu'il y en a juste deux, je prend l'autre
            idArray.splice(idArray.indexOf(i), 1);
            node.content[locale] = right_node.children[idArray[0]].content;
            right_node.children[idArray[0]].inserted = true;
          } else if (
            idArray.length === 0 &&
            right_node.children.length > 0 &&
            right_node.children.filter(
              (x) =>
                x.children &&
                x.children.length === 1 &&
                x.children[0].content.replace(/\s/g, "").length
            ).length === 1
          ) {
            //S'il y a aucun noeud avec du contenu j'essaie de descendre une maille en dessous
            let noeudFils = right_node.children.filter(
              (x) =>
                x.children &&
                x.children.length === 1 &&
                x.children[0].content.replace(/\s/g, "")
            )[0].children[0];
            node.content[locale] = noeudFils.content;
            noeudFils.inserted = true;
          } else {
            return false;
          }
        } else {
          //On garde en mémoire qu'on n'a pas réussi à traiter ce bout de phrase et on y reviendra après
          errArr.push({ right_node: right_node, node: node, id: id, i: i });
          return false;
        }
      }
    }
    //Je réconcilie les espaces au début et à la fin :
    // eslint-disable-next-line no-use-before-define
    _reconcilieEspaces(node, locale);
  } else {
    return false;
  }
  return true;
};

const _reconcilieEspaces = (node, locale) => {
  if (node.content[locale]) {
    try {
      if (
        node.content.fr.substring(0, 1) === " " &&
        node.content[locale].substring(0, 1) !== " "
      )
        node.content[locale] = " " + node.content[locale];
      if (
        node.content.fr.substring(0, 1) !== " " &&
        node.content[locale].substring(0, 1) === " "
      )
        node.content[locale] = node.content[locale].substring(1);

      if (
        node.content.fr.substring(
          node.content.fr.length - 1,
          node.content.fr.length
        ) === " " &&
        node.content[locale].substring(
          node.content[locale].length - 1,
          node.content[locale].length
        ) !== " "
      )
        node.content[locale] = node.content[locale] + " ";
      if (
        node.content.fr.substring(
          node.content.fr.length - 1,
          node.content.fr.length
        ) !== " " &&
        node.content[locale].substring(
          node.content[locale].length - 1,
          node.content[locale].length
        ) === " "
      )
        node.content[locale] = node.content[locale].substring(
          0,
          node.content[locale].length - 1
        );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
};

const _dealWithErrors = (initial, translated, locale, errArr) => {
  //On va d'abord compter le nombre de noeuds qui ont pas été insérés dans l'article en français
  let failArr = [];
  // eslint-disable-next-line no-use-before-define
  let nbFailed = _countFailedInserts({ children: translated }, 0, failArr);

  if (nbFailed === 0) {
    return true;
  } else if (nbFailed === 1 && errArr.length === 1) {
    try {
      let failId = failArr[0].translated.attributes
        .find((x) => x.key === "id")
        .value.split("_")[2];
      let errId = errArr[0].id.split("_")[2];
      if (Math.abs(failId - errId) < 3) {
        //Si le teste en anglais est à moins de 3 noeuds du texte en français qui n'a pas trouvé de traduction, on considère que c'est le même
        errArr[0].node.content[locale] = failArr[0].node.content;
        _reconcilieEspaces(errArr[0].node, locale);
        return true;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }
  return false;
};

const _countFailedInserts = (translated, nombre, failArr) => {
  let children = translated.children;
  for (var i = 0; i < children.length; i++) {
    let node = children[i];
    if (
      node.content &&
      node.content.replace(/\s/g, "").length &&
      !node.inserted
    ) {
      //On enlève le cas où le string contient seulement des espaces ou des saunts de ligne, pas besoin de traduire
      nombre++;
      failArr.push({ node: node, translated: translated, i: i });
    } else if ((node.children || []).length > 0) {
      nombre = _countFailedInserts(node, nombre, failArr);
    }
  }
  return nombre;
};

const _findId = (translated, idToFind) => {
  let children = translated.children || [];
  let right_node = null;
  for (var i = 0; i < children.length; i++) {
    let node = children[i];
    if (node.content) {
      let attributes = translated.attributes || [];
      for (var j = 0; j < attributes.length; j++) {
        if (attributes[j].key === "id") {
          if (attributes[j].value === idToFind.replace("initial_", "target_")) {
            right_node = translated;
            break;
          }
        }
      }
    }
    if (!right_node && (node.children || []).length > 0) {
      right_node = _findId(node, idToFind);
    }
  }
  return right_node;
};

const _removeLocale = (initial, locale) => {
  let children = initial.children || [];
  for (var i = 0; i < children.length; i++) {
    let node = children[i];
    if (node.content) {
      delete node.content[locale];
    }
    if ((node.children || []).length > 0) {
      _removeLocale(initial, locale);
    }
  }
};

const _updateAvancement = (locale) => {
  Article.aggregate([
    { $match: { status: "Actif", nombreMots: { $ne: null } } },
    {
      $group: {
        _id: locale,
        nbMots: { $sum: "$nombreMots" },
        sommeprod: {
          $sum: { $multiply: ["$nombreMots", "$avancement." + locale] },
        },
        count: { $sum: 1 },
        countTraduits: { $sum: "$avancement." + locale },
      },
    },
  ]).exec(function (err, result) {
    if (err || !result || result.length === 0 || !result[0].nbMots) {
      // eslint-disable-next-line no-console
      console.log(
        "erreur à la récupération des données d'avancement dans la traduction"
      );
    } else {
      let resultat = { ...result[0] };
      let newAvancement = resultat.sommeprod / resultat.nbMots;
      if (
        newAvancement > 1 ||
        newAvancement < 0 ||
        Number.isNaN(newAvancement)
      ) {
        return false;
      }
      Langue.findOne({ i18nCode: locale }).exec((err, resultLangue) => {
        if (err || !resultLangue) {
          // eslint-disable-next-line no-console
          console.log(
            "erreur à la mise à jour de l'avancement de la langue cible"
          );
        } else {
          resultLangue.avancement = newAvancement || 0;
          resultLangue.save();
        }
      });
    }
  });
};

const _createFromNested = (
  structJson,
  locale,
  query = {},
  status = "Actif",
  created_at,
  updatedAt,
  articles = [],
  path = []
) => {
  Object.keys(structJson).forEach((key) => {
    if (structJson[key] && typeof structJson[key].fr === "string") {
      let newArticle = {
        title: structJson[key].fr,
        body: structJson[key].fr,
        nombreMots: structJson[key].fr.trim().split(/\s+/).length,
        avancement: structJson[key][locale] ? 1 : 0,
        status: status,
        isStructure: true,
        path: [...path, key],
        created_at: created_at,
        updatedAt: updatedAt,
        _id: structJson[key].id,
      };
      path.pop();
      // console.log("newArticle: ")
      if (
        !(
          query["$or"] &&
          query["$or"].length > 0 &&
          query["$or"][0] &&
          query["$or"][0]["avancement." + locale] &&
          query["$or"][0]["avancement." + locale]["$lt"] &&
          newArticle.avancement === 1
        )
      ) {
        articles.push(newArticle);
      }
    } else if (structJson.constructor === Object) {
      path.push(key);
      // console.log(locale, query, status, created_at, articles, path)
      articles = _createFromNested(
        structJson[key],
        locale,
        query,
        status,
        created_at,
        updatedAt,
        articles,
        path
      );
    }
  });
  path.pop();
  return articles;
};

//On exporte notre fonction
exports.add_traduction = add_traduction;

//Utilisés dans d'autres controllers
exports.addTranslationRestructure = addTranslationRestructure;
exports.sanitizeOptions = sanitizeOptions;
