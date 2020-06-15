const Dispositif = require("../../schema/schemaDispositif.js");
const Role = require("../../schema/schemaRole.js");
const User = require("../../schema/schemaUser.js");
const Traduction = require("../../schema/schemaTraduction");
const Structure = require("../../schema/schemaStructure.js");
var uniqid = require("uniqid");
const nodemailer = require("nodemailer");
const DBEvent = require("../../schema/schemaDBEvent.js");
const _ = require("lodash");
const {
  turnToLocalized,
  turnHTMLtoJSON,
  turnJSONtoHTML,
  turnToLocalizedNew,
  markTradModifications,
  countContents,
  countValidated,
} = require("./functions");
const logger = require("../../logger");

// const gmail_auth = require('./gmail_auth');

// const transporter = nodemailer.createTransport({
//   // service: 'gmail',
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'diairagir@gmail.com',
//     pass: process.env.GMAIL_PASS
//   },
// });

const transporter = nodemailer.createTransport({
  host: "pro2.mail.ovh.net",
  port: 587,
  auth: {
    user: "nour@refugies.info",
    pass: process.env.OVH_PASS,
  },
});

var mailOptions = {
  from: "nour@refugies.info",
  to:
    process.env.NODE_ENV === "dev"
      ? "agathe.kieny@lamednum.coop"
      : "diairagir@gmail.com",
  subject: "Administration Réfugiés.info",
};

const url =
  process.env.NODE_ENV === "dev"
    ? "http://localhost:3000/"
    : process.env.NODE_ENV === "quality"
    ? "https://agir-qa.herokuapp.com/"
    : "https://www.refugies.info/";

async function add_dispositif(req, res) {
  try {
    var dispResult = {};
    if (!req.fromSite) {
      return res.status(405).json({ text: "Requête bloquée par API" });
    } else if (
      !req.body ||
      (!req.body.titreInformatif && !req.body.dispositifId)
    ) {
      return res.status(400).json({ text: "Requête invalide" });
    }
    new DBEvent({
      action: JSON.stringify(req.body),
      userId: _.get(req, "userId"),
      roles: _.get(req, "user.roles"),
      api: arguments.callee.name,
    }).save();
    let dispositif = req.body;
    dispositif.status = dispositif.status || "En attente";
    if (dispositif.contenu) {
      dispositif.nbMots = turnHTMLtoJSON(dispositif.contenu);
    }
    //Si le dispositif existe déjà on fait juste un update
    if (dispositif.dispositifId) {
      //delocalize we can do it

      if (dispositif.contenu) {
        const originalDis = await Dispositif.findOne({
          _id: dispositif.dispositifId,
        });
        const originalTrads = {};
        // eslint-disable-next-line no-undef
        dispositifFr = await turnToLocalizedNew(originalDis, "fr");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (let [key, value] of Object.entries(originalDis.avancement)) {
          if (key !== "fr") {
            originalTrads[key] = await Traduction.find(
              {
                articleId: originalDis._id,
                langueCible: key,
                isExpert: true,
              },
              {},
              { sort: { updatedAt: -1 } }
            );
            for (let tradExpert of originalTrads[key]) {
              tradExpert = markTradModifications(
                dispositif,
                // eslint-disable-next-line no-undef
                dispositifFr,
                tradExpert
              );
              if (tradExpert.status === "À revoir") {
                const contentsTotal = countContents(dispositif.contenu) - 5;
                const validatedTotal = countValidated([
                  tradExpert.translatedText,
                ]);
                const newAvancement = validatedTotal / contentsTotal;
                tradExpert.avancement = newAvancement;
                await Traduction.updateMany(
                  { articleId: originalDis._id, langueCible: key },
                  { status: "À revoir", avancement: newAvancement },
                  { upsert: false }
                );
              }
              await Traduction.findOneAndUpdate(
                { _id: tradExpert._id },
                tradExpert,
                { upsert: true, new: true }
              );
            }
          }
        }
        dispositif.avancement = originalDis.avancement;
      }

      //now I need to save the dispositif and the translation
      dispResult = await Dispositif.findOneAndUpdate(
        { _id: dispositif.dispositifId },
        dispositif,
        { upsert: true, new: true }
      );
    } else {
      dispositif.creatorId = req.userId;
      dispResult = await new Dispositif(dispositif).save();
    }

    /*     return promise.then(data => {
      //Je rajoute le statut de contributeur à l'utilisateur */
    if (!dispositif.dispositifId) {
      await Role.findOne({ nom: "Contrib" }).exec((err, result) => {
        if (!err && result && req.userId) {
          User.findByIdAndUpdate(
            { _id: req.userId },
            {
              $addToSet: { roles: result._id, contributions: dispResult._id },
            },
            { new: true },
            () => {}
          );
        }
      });
    }
    //J'associe la structure principale à ce dispositif
    if (dispositif.mainSponsor) {
      await Structure.findByIdAndUpdate(
        { _id: dispositif.mainSponsor },
        { $addToSet: { dispositifsAssocies: dispResult._id } },
        { new: true },
        () => {}
      );
    }

    // eslint-disable-next-line no-use-before-define
    _handleMailNotification(dispResult);
    return res.status(200).json({
      text: "Succès",
      data: dispResult,
    });
    //  })
    /* .catch(err => {
      console.log(err);
      return res.status(500).json({"text": "Erreur interne", data: err})
    }) */
    // }
  } catch (err) {
    return res.status(500).json({ text: "Erreur interne", data: err });
  }
}

function get_dispositif(req, res) {
  if (!req.body || !req.body.query) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    logger.info("Calling get dispositif");
    console.log("Calling get dispositif console");
    new DBEvent({
      action: JSON.stringify(req.body),
      userId: _.get(req, "userId"),
      roles: _.get(req, "user.roles"),
      api: arguments.callee.name,
    }).save();
    let { query, sort, populate, limit, random, locale } = req.body;
    locale = locale || "fr";

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

    let promise = null;
    if (random) {
      promise = Dispositif.aggregate([
        { $match: query },
        { $sample: { size: 1 } },
      ]);
    } else {
      promise = Dispositif.find(query)
        .sort(sort)
        .populate(populate)
        .limit(limit)
        .lean();
    }
    // promise.explain("allPlansExecution").then(d => console.log("query explained : ", d));
    promise
      .then((result) => {
        [].forEach.call(result, (dispositif) => {
          dispositif = turnToLocalized(dispositif, locale);
          turnJSONtoHTML(dispositif.contenu);
        });
        res.status(200).json({
          text: "Succès",
          data: result,
        });
      })
      .catch(function (error) {
        switch (error) {
          case 500:
            res.status(500).json({
              text: "Erreur interne",
            });
            break;
          case 404:
            res.status(404).json({
              text: "Pas de résultat",
            });
            break;
          default:
            res.status(500).json({
              text: "Erreur interne",
            });
        }
      });
  }
}

function update_dispositif(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body || !req.body.dispositifId || !req.body.fieldName) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    new DBEvent({
      action: JSON.stringify(req.body),
      userId: _.get(req, "userId"),
      roles: _.get(req, "user.roles"),
      api: arguments.callee.name,
    }).save();
    let {
      dispositifId,
      fieldName,
      suggestionId,
      type,
      ...dispositif
    } = req.body;
    let update = null,
      query = { _id: dispositifId };
    if (type === "pull") {
      update = { $pull: { [fieldName]: { suggestionId: suggestionId } } };
    } else if (type === "set") {
      query = { ...query, "suggestions.suggestionId": suggestionId };
      update = { $set: { [fieldName]: true } };
    } else {
      update = {
        $push: {
          [fieldName]: {
            ...(req.userId && { userId: req.userId }),
            ...(req.user && {
              username: req.user.username,
              picture: req.user.picture,
            }),
            ...dispositif,
            createdAt: new Date(),
            suggestionId: uniqid("feedback_"),
          },
        },
      };
    }
    Dispositif.findOneAndUpdate(query, update, { new: true }, (err, data) => {
      if (err) {
        res.status(404).json({ text: "Pas de résultat", error: err });
      } else {
        res.status(200).json({
          text: "Succès",
          data: data,
        });
      }
    });
  }
}

function get_dispo_progression(req, res) {
  new DBEvent({
    userId: _.get(req, "userId"),
    roles: _.get(req, "user.roles"),
    api: arguments.callee.name,
  }).save();
  var start = new Date();
  start.setHours(0, 0, 0, 0);

  var find = new Promise(function (resolve, reject) {
    Dispositif.aggregate([
      {
        $match: {
          creatorId: req.userId,
          created_at: { $gte: start },
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
    // eslint-disable-next-line no-use-before-define
    (e) => _errorHandler(e, res)
  );
}

function count_dispositifs(req, res) {
  new DBEvent({
    action: JSON.stringify(req.body),
    userId: _.get(req, "userId"),
    roles: _.get(req, "user.roles"),
    api: arguments.callee.name,
  }).save();
  Dispositif.count(req.body, (err, count) => {
    if (err) {
      res.status(404).json({ text: "Pas de résultat" });
    } else {
      res.status(200).json(count);
    }
  });
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

const _handleMailNotification = (dispositif) => {
  let html = "";
  const status = dispositif.status;
  // ["Actif", "Accepté structure", , "Brouillon", "Rejeté structure", "Rejeté admin", "Inactif", "Supprimé"]
  if (
    ["En attente", "En attente admin", "En attente non prioritaire"].includes(
      status
    )
  ) {
    html = "<p>Bonjour,</p>";

    if (
      ["En attente", "En attente admin", "En attente non prioritaire"].includes(
        status
      )
    ) {
      html +=
        "<p>Un nouveau contenu (" +
        dispositif.typeContenu +
        ") est '<b>" +
        status +
        " de validation</b>' sur la plateforme Réfugiés.info (environnement : '" +
        process.env.NODE_ENV +
        "')</p>" +
        "<p><a href=" +
        url +
        (dispositif.typeContenu || "dispositif") +
        "/" +
        dispositif._id +
        ">Cliquez ici</a> pour accéder au contenu, ou accédez <a href=" +
        url +
        "backend/admin-contrib>à la page d'administration</a>.</p>";
    }
    html +=
      "<p>A bientôt,</p>" +
      "<p>Soufiane, webmestre (who says that ?!) Réfugiés.info</p>";

    mailOptions.html = html;
    mailOptions.subject =
      "Administration Réfugiés.info - " +
      dispositif.titreInformatif +
      " - " +
      status;
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      } else {
        // eslint-disable-next-line no-console
        console.log("Email sent: " + info.response);
      }
    });
  }
};
//On exporte notre fonction
exports.add_dispositif = add_dispositif;
exports.get_dispositif = get_dispositif;
exports.count_dispositifs = count_dispositifs;
exports.update_dispositif = update_dispositif;
exports.get_dispo_progression = get_dispo_progression;

//Utilisés dans d'autres controllers :
exports.transporter = transporter;
exports.mailOptions = mailOptions;
exports.url = url;
