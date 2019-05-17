const Audio = require('../../schema/schemaAudio.js');

const recordSampleRate = 44100;

function set_audio(req, res) {
  if (!req.body) {
    res.status(400).json({
      "text": "Requête invalide"
    })
  } else {
    let audio=req.body;
    var _u = new Audio(audio);

    _u.save( (err, data) => {
      if (err) {
        res.status(500).json({
          "text": "Erreur interne",
          "error": err
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

function get_audio(req, res) {
  var query = req.body;
  var find = new Promise(function (resolve, reject) {
    Audio.find(query).exec(function (err, result) {
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

  find.then(function (result) {
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
        res.status(404).json({
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
exports.set_audio = set_audio;
exports.get_audio = get_audio;