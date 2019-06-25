const Event = require('../../schema/schemaEvent.js');
const User = require('../../schema/schemaUser.js');

function log_event(req, res) {
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
    _u.save((err, event) => {
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

function get_event(req, res) {
  var query = req.body.query;
  var sort = req.body.sort;
  var findEvent = new Promise(function (resolve, reject) {
    Event.find(query).sort(sort).exec(function (err, result) {
      console.log(err)
      if (err) { reject(500); } 
      else {
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

async function distinct_event (req, res) {
  var body = req.body;
  Event.distinct(body.distinct).exec(async (err, data) => {
    if (err) { res.status(500).json({ "text": "Erreur interne" }) }
    else if(!data) {res.status(404).json({ "text": "Data not found" }) }
    else {
      if(body.distinct === "userId"){ data = await User.find({}, {username:1, status:1, picture: 1}) }
      res.status(200).json({
        "text": "Succès",
        "data": data
      })
    } 
  })
}

//On exporte notre fonction
exports.log_event = log_event;
exports.get_event = get_event;
exports.distinct_count_event = distinct_count_event;
exports.distinct_event = distinct_event;