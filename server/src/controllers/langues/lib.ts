import Langue from "../../schema/schemaLangue.js";
import { RequestFromClient, Res } from "../../types/interface";
import Traduction from "../../schema/schemaTraduction.js";
import Dispositif from "../../schema/schemaDispositif.js";

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
exports.get_langues = get_langues;
