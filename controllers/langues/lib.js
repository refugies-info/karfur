const Langue = require('../../schema/schemaLangue.js');

function create_langues(req, res) {
  if (!req.body || !req.body.langueFr) {
    //Le cas où la page ne serait pas soumise ou nul
    res.status(400).json({
        "text": "Requête invalide"
    })
  } else if (!req.user || !req.user.isAdmin) {
    res.status(204).json({
      "text": "L'utilisateur n'a pas les droits pour effectuer cette modification"
    })
  } else {
    var langue = req.body;
    let promise=null;
    if(langue._id){
      promise=Langue.findOneAndUpdate({_id: langue._id}, langue, { upsert: true , new: true});
    }else{
      promise=new Langue(langue).save();
    }
    promise.then(data => {
      res.status(200).json({
        "text": "Succès",
        "data": data
      })
    }).catch(err => {
      res.status(500).json({
        "text": "Erreur interne"
      })
    })
  }
}

function get_langues(req, res) {
  var query = req.body.query;
  var sort = req.body.sort;
  var populate = req.body.populate;
  if(populate){
    if(populate.constructor === Object){
      populate.select = '-password';
    }else{
      populate={path:populate, select : '-password'};
    }
  }else{populate='';}
  
  var findLangue = new Promise(function (resolve, reject) {
    Langue.find(query).sort(sort).populate(populate).exec(function (err, result) {
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

  findLangue.then(function (result) {
    res.status(200).json({
        "text": "Succès",
        "data": result
    })
  }, function (error) {
    console.log(error);
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
  })
}

//On exporte notre fonction
exports.create_langues = create_langues;
exports.get_langues = get_langues;