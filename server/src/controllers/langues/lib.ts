import Langue from "../../schema/schemaLangue.js";
import { RequestFromClient, Res } from "../../types/interface";

// create_langues not used
// @ts-ignore
function create_langues(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body || !req.body.langueFr) {
    res.status(400).json({ text: "Requête invalide" });
    // @ts-ignore
  } else if (!req.user || !req.user.roles.some((x) => x.nom === "Admin")) {
    res.status(403).json({
      text:
        "L'utilisateur n'a pas les droits pour effectuer cette modification",
    });
  } else {
    // remove this call because it generates an error with typescript
    // new DBEvent({
    //   action: JSON.stringify(req.body),
    //   userId: _.get(req, "userId"),
    //   roles: _.get(req, "user.roles"),
    //   api: arguments.callee.name,
    // }).save();
    var langue = req.body,
      promise;
    if (langue._id) {
      promise = Langue.findOneAndUpdate({ _id: langue._id }, langue, {
        upsert: true,
        new: true,
      });
    } else {
      promise = new Langue(langue).save();
    }
    promise
      // @ts-ignore
      .then((data) => {
        res.status(200).json({
          text: "Succès",
          data: data,
        });
      })
      // @ts-ignore
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          text: "Erreur interne",
          data: err,
        });
      });
  }
}

function get_langues(req: RequestFromClient, res: Res) {
  // remove this call because it generates an error with typescript
  // new DBEvent({
  //   action: JSON.stringify(req.body),
  //   userId: _.get(req, "userId"),
  //   roles: _.get(req, "user.roles"),
  //   api: arguments.callee.name,
  // }).save();

  var { query, sort, populate } = req.body;
  if (populate) {
    if (!req.fromSite) {
      //On n'autorise pas les populate en API externe
      populate = "";
    } else if (populate.constructor === Object) {
      // @ts-ignore
      populate.select = "-password";
    } else {
      // @ts-ignore
      populate = { path: populate, select: "-password" };
    }
  } else {
    populate = "";
  }

  var findLangue = new Promise(function (resolve, reject) {
    Langue.find(query)
      .sort(sort)
      .populate(populate)
      // @ts-ignore
      .exec(function (err, result) {
        if (err) {
          console.log(err);
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

  findLangue.then(
    function (result) {
      res.status(200).json({
        text: "Succès",
        data: result,
      });
    },
    function (error) {
      console.log(error);
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
    }
  );
}

//On exporte notre fonction
exports.create_langues = create_langues;
exports.get_langues = get_langues;
