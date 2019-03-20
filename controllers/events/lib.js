const Event = require('../../schema/schemaEvent.js');

function log(req, res) {
    if (!req.body || !req.body.app) {
        //Le cas où la page ne serait pas soumise ou nul
        res.status(400).json({
            "text": "Requête invalide"
        })
    } else {
        var event = req.body
        var _u = new Event(event);
        _u.save(function (err, event,ptet) {
            if (err) {
                res.status(500).json({
                    "text": "Erreur interne"
                })
            } else {
                res.status(200).json({
                    "text": "Succès",
                    "event": event
                })
            }
        })
    }
}

function get(req, res) {
  console.log('dans get events')
  if (false && (!req.body.email || !req.body.password)) {
    res.status(400).json({
        "text": "Requête invalide"
    })
  } else {
    var query = req.body.query;
    var sort = req.body.sort;
    var findEvent = new Promise(function (resolve, reject) {
        Event.find(query).sort(sort).exec(function (err, result) {
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

    findEvent.then(function (result) {
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
                    "text": "L'adresse email existe déjà"
                })
                break;
            default:
                res.status(500).json({
                    "text": "Erreur interne"
                })
        }
    })
  }
}

//On exporte notre fonction
exports.log = log;
exports.get = get;