const Event = require('../../schema/schemaEvent.js');

function log_event(req, res) {
  console.log('logging event')
  if (!req.body || !req.body.app) {
    //Le cas où la page ne serait pas soumise ou nul
    res.status(400).json({
        "text": "Requête invalide"
    })
  } else {
    var event = req.body
    event.userId=req.userId;
    if(event.action){console.log(event)}
    var _u = new Event(event);
    _u.save(function (err, event,ptet) {
      if (err) {
        res.status(500).json({
          "text": "Erreur interne"
        })
      } else {
        console.log('ici')
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
              reject(404)
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
            case 404:
                res.status(404).json({
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

function distinct_count_event(req, res) {
  var body = req.body;
  Event.find(body.query).distinct(body.distinct).exec(function (err, data) {
    if (err) { res.status(500).json({ "text": "Erreur interne" }) }
    else if(!data) {res.status(404).json({ "text": "Data not found" }) }
    else {
      res.status(200).json({
        "text": "Succès",
        "data": data.length
      })
    } 
  })
}

//On exporte notre fonction
exports.log_event = log_event;
exports.get = get;
exports.distinct_count_event = distinct_count_event;