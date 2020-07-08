const Structure = require("../../schema/schemaStructure.js");
const User = require("../../schema/schemaUser.js");
const Role = require("../../schema/schemaRole.js");
const _ = require("lodash");

async function add_structure(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.body || (!req.body.nom && !req.body._id)) {
    res.status(400).json({ text: "Requête invalide" });
  } else {

    let { membreId, ...structure } = req.body;

    if (structure._id) {
      //Il faut avoir soit un rôle admin soit être admin de la structure
      const r = await Structure.findOne({ _id: structure._id });
      if (!r) {
        res.status(402).json({ text: "Id non valide" });
        return;
      }
      const isAdmin =
        (req.user.roles || []).some((x) => x.nom === "Admin") ||
        req.userId.equals(r.administrateur);
      const isContributeur = (
        ((r.membres || []).find((x) => req.userId.equals(x.userId)) || {})
          .roles || []
      ).includes("contributeur");
      if (
        isAdmin ||
        (isContributeur &&
          !JSON.stringify(structure).includes("administrateur"))
      ) {
        //Soit l'auteur est admin soit il est contributeur et modifie les droits d'un membre seul
        // eslint-disable-next-line no-undef
        promise = Structure.findOneAndUpdate(
          {
            _id: structure._id,
            ...(membreId && { "membres.userId": membreId }),
          },
          structure,
          { upsert: true, new: true }
        );
      } else {
        //Voir les cas qu'on laissera passer pour les membres
        res.status(401).json({ text: "Token invalide" });
        return false;
      }
    } else {
      structure.createur = req.userId;
      structure.status = structure.status || "En attente";
      // eslint-disable-next-line no-undef
      promise = new Structure(structure).save();
    }

    // eslint-disable-next-line no-undef
    promise
      .then((data) => {
        //J'ajoute cette structure à l'utilisateur
        Role.findOne({ nom: "hasStructure" }).exec((err, result) => {
          if (!err && result && req.userId) {
            (data.membres || []).forEach((x) =>
              User.findByIdAndUpdate(
                { _id: x.userId },
                { $addToSet: { roles: result._id, structures: data._id } },
                { upsert: true, new: true },
                () => {}
              )
            );
          }
        });
        res.status(200).json({
          text: "Succès",
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).json({ text: "Erreur interne", data: err });
      });
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
