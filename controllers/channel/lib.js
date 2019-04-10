const Channel = require('../../schema/schemaChannel.js');

function add_channel(req, res) {
  if (!req.body || !req.body.langueCible || !req.body.translatedText) {
    //Le cas où la requête ne serait pas soumise ou nul
    res.status(400).json({
      "text": "Requête invalide"
    })
  } else {
    let channel=req.body;
    //check if there is existing channel first, else create it
    var _u = new Channel(channel);
    _u.save((err, saved) => {
      if (err) {
        console.log(err);
        res.status(501).json({"text": "Erreur interne"})
      } else {
        console.log('succes')
        res.status(200).json({
          "text": "Succès",
          "data": saved
        })
      }
    })
  }
}

function get_channel(req, res) {
  var query = req.body.query;
  var sort = req.body.sort;
  var populate = req.body.populate;
  if(populate && populate.constructor === Object){
    populate.select = '-password';
  }else if(populate){
    populate={path:populate, select : '-password'};
  }else{populate='';}
  
  var find = new Promise(function (resolve, reject) {
    Channel.find(query).sort(sort).populate(populate).exec(function (err, result) {
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
  }, (e) => _errorHandler(e,res))
}

const _errorHandler = (error, res) => {
  switch (error) {
    case 500:
      res.status(500).json({
          "text": "Erreur interne"
      })
      break;
    case 204:
      res.status(204).json({
          "text": "Pas de résultats"
      })
      break;
    default:
      res.status(500).json({
          "text": "Erreur interne"
      })
  }
}

//On exporte notre fonction
exports.add_channel = add_channel;
exports.get_channel = get_channel;