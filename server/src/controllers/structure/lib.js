const { Structure } = require("../../schema/schemaStructure");
const logger = require("../../logger");

// const getAssociatedDispositifs = async (id) => {
//   try {
//     logger.info(
//       "[getAssociatedDispositifs] fetching associated dispositif with id",
//       { id }
//     );
//     const dispositifArray = await Dispositif.find({
//       sponsors: { $elemMatch: { _id: id.toString() } },
//     });

//     return dispositifArray;
//   } catch (error) {
//     logger.error(
//       "[getAssociatedDispositifs] error while getting associated dispositifs, return empty array"
//     );
//     return [];
//   }
// };

// TO BE REMOVED : CREATE FUNCTIONS LIKE IN MODELS/STRUCTURE
async function get_structure(req, res) {
  if (!req.body || !req.body.query) {
    return res.status(400).json({ text: "Requête invalide" });
  }

  let { query, sort, populate, limit } = req.body;
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

  logger.info("[get_structure] get structure", { query });
  try {
    const structure = await Structure.find(query)
      .sort(sort)
      .populate(populate)
      .limit(limit);

    if (!structure) {
      throw new Error("No structure");
    }

    // the populate on DispositifsAssocies is not correct since dispositifsAssocies is not updated when we change the structure of a dispositif
    // const associatedDispositifs = await getAssociatedDispositifs(
    //   structure[0]._id
    // );
    // const newStructure = [
    //   { ...structure[0].toJSON(), dispositifsAssocies: associatedDispositifs },
    // ];
    return res.status(200).json({
      text: "Succès",
      data: structure,
    });
  } catch (error) {
    logger.error("[get_structure] error while getting structure");
    if (error.message === "No structure") {
      res.status(404).json({
        text: "Pas de résultat",
      });
      return;
    }
    return res.status(500).json({
      text: "Erreur interne",
    });
  }
}

//On exporte notre fonction
exports.get_structure = get_structure;
