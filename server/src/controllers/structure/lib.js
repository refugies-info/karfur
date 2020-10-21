const Structure = require("../../schema/schemaStructure.js");
const User = require("../../schema/schemaUser.js");
const Role = require("../../schema/schemaRole.js");
const logger = require("../../logger");

const modifyStructure = async (
  structure,
  requestUserRoles,
  requestUserId,
  membreId
) => {
  logger.info("[modifyStructure] try to modify structure with id", {
    id: structure._id,
  });

  const fetchedStructure = await Structure.findOne({ _id: structure._id });
  if (!fetchedStructure) {
    logger.info("[modifyStructure] no structure with this id", {
      id: structure._id,
    });
    return { status: 402 };
  }
  // user is admin for the platform or user is admin(responsable) of the structure
  const isAdmin =
    (requestUserRoles || []).some((x) => x.nom === "Admin") ||
    requestUserId.equals(fetchedStructure.administrateur);

  const isContributeur = (
    (
      (fetchedStructure.membres || []).find((x) =>
        requestUserId.equals(x.userId)
      ) || {}
    ).roles || []
  ).includes("contributeur");
  if (
    isAdmin ||
    (isContributeur && !JSON.stringify(structure).includes("administrateur"))
  ) {
    logger.info("[modifyStructure] updating stucture", {
      structureId: structure.id,
      membreId,
    });
    const updatedStructure = await Structure.findOneAndUpdate(
      {
        _id: structure._id,
        ...(membreId && { "membres.userId": membreId }),
      },
      structure,
      { upsert: true, new: true }
    );

    logger.info("[modifyStructure] successfully modified structure with id", {
      id: structure._id,
    });
    return { status: null, updatedStructure };
  }
  return { status: 401 };
};

const updateRoles = async (
  userId,
  deleteUserFromStructure,
  updatedStructure,
  requestUserId
) => {
  try {
    logger.info("[updateRoles] updating roles of structure", {
      structureId: updatedStructure._id,
    });

    const hasStructureRole = await Role.findOne({ nom: "hasStructure" });
    if (hasStructureRole && requestUserId) {
      if (!deleteUserFromStructure) {
        logger.info("[updateRoles] update roles hasStructure of membres", {
          membres: updatedStructure.membres,
        });
        (updatedStructure.membres || []).forEach((x) => {
          logger.info(
            "[updateRoles] update role hasStructure and structure of membre",
            { membreId: x.userId }
          );

          User.findByIdAndUpdate(
            { _id: x.userId },
            {
              $addToSet: {
                roles: hasStructureRole._id,
                structures: updatedStructure._id,
              },
            },
            { upsert: true, new: true },
            () => {}
          );
        });
      } else {
        logger.info(
          "[updateRoles] delete role hasStructure and structure of membre",
          { membreId: userId }
        );

        await User.findByIdAndUpdate(
          { _id: userId },
          {
            $pull: {
              roles: hasStructureRole._id,
              structures: updatedStructure._id,
            },
          },
          { upsert: true, new: true },
          () => {
            logger.info("[updateRoles] successfully modified user", {
              membreId: userId,
            });
          }
        );
      }
    }
  } catch (error) {
    logger.error("[updateRoles] error while modifying user");
  }
};

async function add_structure(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body || (!req.body.nom && !req.body._id)) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    try {
      let {
        membreId,
        deleteUserFromStructure,
        userId,
        ...structure
      } = req.body;
      if (structure._id) {
        const { status, updatedStructure } = await modifyStructure(
          structure,
          req.user.roles,
          req.userId,
          membreId
        );

        if (status === 402) {
          logger.error("[add_structure] structure id not valid");
          res.status(402).json({ text: "Id non valide" });
          return;
        }

        if (status === 401) {
          logger.error("[add_structure] token not valid");

          res.status(401).json({ text: "Token invalide" });
          return;
        }

        await updateRoles(
          userId,
          deleteUserFromStructure,
          updatedStructure,
          req.userId
        );
        res.status(200).json({
          text: "Succès",
          data: updatedStructure,
        });
        return;
      }
      structure.createur = req.userId;
      structure.status = structure.status || "En attente";

      const newStructure = await new Structure(structure).save();
      res.status(200).json({
        text: "Succès",
        data: newStructure,
      });
      return;
    } catch (err) {
      res.status(500).json({ text: "Erreur interne", data: err });
    }
  }
}

function get_structure(req, res) {
  if (!req.body || !req.body.query) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
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
    var find = new Promise((resolve, reject) => {
      Structure.find(query)
        .sort(sort)
        .populate(populate)
        .limit(limit)
        .exec((err, result) => {
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
      (result) => {
        res.status(200).json({
          text: "Succès",
          data: result,
        });
      },
      (error) => {
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
    );
  }
}

//On exporte notre fonction
exports.add_structure = add_structure;
exports.get_structure = get_structure;
