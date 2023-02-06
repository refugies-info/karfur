import { RequestFromClient, Res } from "../../types/interface";
import { Traduction } from "../../schema/schemaTraduction";
import { DispositifModel, Langue, LangueModel } from "src/typegoose";

// TODO type correctly Query
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
    var findLangue: Langue[] = await LangueModel.find(query).sort(sort).populate(populate).exec();
    var totalCount = await DispositifModel.count({ status: "Actif" });
    if (findLangue.length > 0) {
      for (var i = 0; i < findLangue.length; i++) {
        var langue = findLangue[i];
        var pubTrads = await Traduction.distinct("articleId", {
          langueCible: langue.i18nCode,
          status: "Validée"
        });
        var pubTradsCount = pubTrads.length;
        findLangue[i].avancementTrad = pubTradsCount / totalCount;
      }
    }
    res.status(200).json({
      text: "Succès",
      data: findLangue
    });
  } catch (e) {
    res.status(500).json({ text: "Erreur interne", err: e });
  }
}

export { get_langues };
