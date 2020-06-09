const Role = require("../../schema/schemaRole.js");
const DBEvent = require("../../schema/schemaDBEvent.js");
const _ = require("lodash");

function get_role(req, res) {
  new DBEvent({
    action: JSON.stringify(req.body),
    userId: _.get(req, "userId"),
    roles: _.get(req, "user.roles"),
    api: arguments.callee.name,
  }).save();
  const { query, sort } = req.body;
  var findRole = new Promise(function (resolve, reject) {
    Role.find(query)
      .sort(sort)
      .exec(function (err, result) {
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

  findRole.then(
    function (result) {
      res.status(200).json({
        text: "Succès",
        data: result,
      });
    },
    function (error) {
      switch (error) {
        case 500:
          res.status(500).json({
            text: "Erreur interne",
          });
          break;
        case 404:
          res.status(404).json({
            text: "Erreur sur le résultat",
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

//Cette fonction n'est pas exportée, utilisée en interne uniquement
function set_role(req, res) {
  if (!req.body || !req.body.nom) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    new DBEvent({
      action: JSON.stringify(req.body),
      userId: _.get(req, "userId"),
      roles: _.get(req, "user.roles"),
      api: arguments.callee.name,
    }).save();
    var role = req.body;
    var _u = new Role(role);
    _u.save(function (err, data) {
      if (err) {
        res.status(500).json({
          text: "Erreur interne",
        });
      } else {
        res.status(200).json({
          text: "Succès",
          data: data,
        });
      }
    });
  }
}

//On exporte notre fonction
exports.get_role = get_role;
