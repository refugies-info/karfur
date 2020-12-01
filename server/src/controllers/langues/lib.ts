import Langue from "../../schema/schemaLangue.js";
import { RequestFromClient, Res } from "../../types/interface";
import Traduction from "../../schema/schemaTraduction.js";
import Dispositif from "../../schema/schemaDispositif.js";

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
    var langue = req.body,
      promise;
    if (langue._id) {
      // @ts-ignore
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
        res.status(500).json({
          text: "Erreur interne",
          data: err,
        });
      });
  }
}

// TO DO type correctly Query
interface Query {}
async function get_langues(req: RequestFromClient<Query>, res: Res) {
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
  try {
    // @ts-ignore
    var findLangue: any[] = await Langue.find(query)
      .sort(sort)
      .populate(populate)
      .lean()
      // @ts-ignore
      .exec();
    var totalCount = await Dispositif.count({ status: "Actif" });
    if (findLangue.length > 0) {
      for (var i = 0; i < findLangue.length; i++) {
        var langue = findLangue[i];
        var pubTrads = await Traduction.distinct("articleId", {
          langueCible: langue.i18nCode,
          status: "Validée",
        });
        var pubTradsCount = pubTrads.length;
        findLangue[i].avancementTrad = pubTradsCount / totalCount;
      }
    }
    res.status(200).json({
      text: "Succès",
      data: findLangue,
    });
  } catch (e) {
    res.status(500).json({ text: "Erreur interne", err: e });
  }
}

//On exporte notre fonction
exports.create_langues = create_langues;
exports.get_langues = get_langues;
