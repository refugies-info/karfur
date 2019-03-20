const Role = require('../../schema/schemaRole.js');

function set_role(req, res) {
  if (!req.body || !req.body.nom) {
    res.status(400).json({
      "text": "Requête invalide"
    })
  } else {
    var role = req.body
    var _u = new Role(role);
    _u.save(function (err, data) {
      if (err) {
        res.status(500).json({
          "text": "Erreur interne"
        })
      } else {
        res.status(200).json({
          "text": "Succès",
          "data": data
        })
      }
    })
  }
}

function get_role(req, res) {
  var query = req.body.query;
  var sort = req.body.sort;
  var findRole = new Promise(function (resolve, reject) {
      Role.find(query).sort(sort).exec(function (err, result) {
        if (err) {
          reject(500);
        } else {
          if (result) {
            resolve(result)
          } else {
            reject(204)
          }
        }
      })
  })

  findRole.then(function (result) {
    res.status(200).json({
        "text": "Succès",
        "data": result
    })
  }, function (error) {
    switch (error) {
      case 500:
        res.status(500).json({
            "text": "Erreur interne"
        })
        break;
      case 204:
        res.status(204).json({
            "text": "Erreur sur le résultat"
        })
        break;
      default:
        res.status(500).json({
          "text": "Erreur interne"
        })
    }
  })
}

//On exporte notre fonction
exports.set_role = set_role;
exports.get_role = get_role;