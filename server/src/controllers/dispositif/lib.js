const { Dispositif } = require("../../schema/schemaDispositif");

const { turnToLocalized, turnJSONtoHTML } = require("./functions");
const logger = require("../../logger");

//Function to patch dispositifs that had EditorState object saved in DB causing great size problem
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function patch_dispositifs(req, res) {
  logger.info("Patch dispositifs");
  try {
    var all = await Dispositif.find().lean();
    for (var i = 0; i < all.length; ++i) {
      logger.info("patching dispositif", { id: all[i]._id.toString() });
      if (all[i].contenu && all[i].contenu.length) {
        for (var x = 0; x < all[i].contenu.length; ++x) {
          if (all[i].contenu[x].children && all[i].contenu[x].children.length) {
            for (var y = 0; y < all[i].contenu[x].children.length; ++y) {
              if (all[i].contenu[x].children[y].editorState) {
                delete all[i].contenu[x].children[y].editorState;
              }
            }
          }
        }
      }
      await Dispositif.findOneAndUpdate({ _id: all[i]._id }, all[i], {
        upsert: true,
        new: true,
      });
    }
    logger.info(`finish patching ${all.length} dispositifs`);
    return res.status(200).json("OK");
  } catch (e) {
    logger.error("Error while patching dispositifs", { error: e });
    return res.status(500).json("KO");
  }
}

async function add_dispositif_infocards(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body) {
    return res.status(400).json({ text: "Requête invalide" });
  }
  let dispositif = req.body;
  try {
    let originalDis = await Dispositif.findOne({
      _id: dispositif.dispositifId,
    });
    if (originalDis.contenu && originalDis.contenu[1].children) {
      const index = originalDis.contenu[1].children
        .map((e) => e.title)
        .indexOf("Zone d'action");
      if (index !== -1) {
        originalDis.contenu[1].children[index] = dispositif.geolocInfocard;
      } else {
        originalDis.contenu[1].children.push(dispositif.geolocInfocard);
      }
      await Dispositif.findOneAndUpdate(
        { _id: dispositif.dispositifId },
        originalDis,
        { upsert: true, new: true }
      );
    }
    return res.status(200).json("OK");
  } catch (err) {
    logger.error("Error while updating infocards", {
      dispositifId: dispositif._id,
    });
    res.status(500).json({ text: "Erreur interne", data: err });
  }
}

async function get_dispositif(req, res) {
  try {
    if (!req.body || !req.body.query) {
      res.status(400).json({ text: "Requête invalide" });
    } else {
      logger.info("Calling get dispositif");
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
        promise = await Dispositif.aggregate([
          { $match: query },
          { $sample: { size: 1 } },
        ]);
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
                ...modifiedQuery,
              },
            ],
          };
          promise = await Dispositif.find(newQuery)
            .sort(sort)
            .populate(populate)
            .limit(limit)
            .lean();
        } else {
          promise = await Dispositif.find(query)
            .sort(sort)
            .populate(populate)
            .limit(limit)
            .lean();
        }
      }
      // promise.explain("allPlansExecution").then(d => console.log("query explained : ", d));
      [].forEach.call(promise, (dispositif) => {
        dispositif = turnToLocalized(dispositif, locale);
        turnJSONtoHTML(dispositif.contenu);
      });
      res.status(200).json({
        text: "Succès",
        data: promise,
      });
    }
  } catch (error) {
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
  }
}

/* NOT USED
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

function get_dispo_progression(req, res) {
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
    (e) => _errorHandler(e, res)
  );
}
*/

function count_dispositifs(req, res) {
  Dispositif.count(req.body, (err, count) => {
    if (err) {
      res.status(404).json({ text: "Pas de résultat" });
    } else {
      res.status(200).json(count);
    }
  });
}

//On exporte notre fonction
exports.add_dispositif_infocards = add_dispositif_infocards;
exports.get_dispositif = get_dispositif;
exports.count_dispositifs = count_dispositifs;
