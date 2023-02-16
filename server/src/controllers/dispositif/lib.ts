import { DispositifModel } from "src/typegoose";
import { Request, Res } from "src/types/interface";

// const { turnToLocalized, turnJSONtoHTML } = require("./functions");
const logger = require("../../logger");

async function add_dispositif_infocards(req: Request, res: Res) {
  logger.error("REFACTOR TODO, DO NOT USE");
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body) {
    return res.status(400).json({ text: "Requête invalide" });
  }
  let dispositif = req.body;
  try {
    // let originalDis = await DispositifModel.findOne({
    //   _id: dispositif.dispositifId
    // });
    // if (originalDis.contenu && originalDis.contenu[1].children) {
    //   const index = originalDis.contenu[1].children.map((e) => e.title).indexOf("Zone d'action");
    //   if (index !== -1) {
    //     originalDis.contenu[1].children[index] = dispositif.geolocInfocard;
    //   } else {
    //     originalDis.contenu[1].children.push(dispositif.geolocInfocard);
    //   }
    //   await DispositifModel.findOneAndUpdate({ _id: dispositif.dispositifId }, originalDis, {
    //     upsert: true,
    //     new: true
    //   });
    // }
    return res.status(200).json("OK");
  } catch (err) {
    logger.error("Error while updating infocards", {
      dispositifId: dispositif._id
    });
    res.status(500).json({ text: "Erreur interne", data: err });
  }
}

async function get_dispositif(req: Request, res: Res) {
  try {
    console.log(req.body);
    if (!req.body || !req.body.query) {
      res.status(400).json({ text: "Requête invalide" });
    } else {
      logger.info("Calling get dispositif");
      let { query, sort, populate, limit, random, locale } = req.body;
      // locale = locale || "fr";

      if (!req.fromSite) {
        //On n'autorise pas les populate en API externe
        populate = "";
      } else if (populate && populate.constructor === Object) {
        populate.select = "-password -traductions -traductionsFaites";
      } else if (populate) {
        populate = { path: populate, select: "-password -traductions -traductionsFaites" };
      } else {
        populate = "";
      }
      let promise = null;
      if (random) {
        promise = await DispositifModel.aggregate([{ $match: query }, { $sample: { size: 1 } }]);
      } else {
        if (query["audienceAge.bottomValue"]) {
          var modifiedQuery = Object.assign({}, query);
          delete modifiedQuery["audienceAge.bottomValue"];
          delete modifiedQuery["audienceAge.topValue"];
          var newQuery = {
            $or: [
              query,
              {
                "variantes.bottomValue": query["audienceAge.bottomValue"],
                "variantes.topValue": query["audienceAge.topValue"],
                ...modifiedQuery
              }
            ]
          };
          promise = await DispositifModel.find(newQuery).sort(sort).populate(populate).limit(limit).lean();
        } else {
          promise = await DispositifModel.find(query).sort(sort).populate(populate).limit(limit).lean();
        }
      }

      // promise.then(dispositif)

      // [].forEach.call(promise, (dispositif) => {
      //   dispositif = turnToLocalized(dispositif, locale);
      //   turnJSONtoHTML(dispositif.contenu);
      // });
      res.status(200).json({
        text: "Succès",
        data: promise
      });
    }
  } catch (error) {
    switch (error) {
      case 500:
        res.status(500).json({
          text: "Erreur interne"
        });
        break;
      case 404:
        res.status(404).json({
          text: "Pas de résultat"
        });
        break;
      default:
        res.status(500).json({
          text: "Erreur interne"
        });
    }
  }
}

export { add_dispositif_infocards, get_dispositif };
