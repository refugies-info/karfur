const Theme = require('../../schema/schemaTheme.js');

function create_theme(req, res) {
  if (!req.body || !req.body.themeNom) {
    res.status(400).json({
        "text": "Requête invalide"
    })
  } else if (!req.user || !req.user.roles.some(x => x.nom === 'Admin')) {
    res.status(204).json({
      "text": "L'utilisateur n'a pas les droits pour effectuer cette modification"
    })
  } else {
    var theme = req.body;
    let promise=null;
    if(theme._id){
      promise=Theme.findOneAndUpdate({_id: theme._id}, theme, { upsert: true , new: true});
    }else{
      promise=new Theme(theme).save();
    }
    promise.then(data => {
      console.log(data)
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

function get_themes(req, res) {
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
  
  var find = new Promise(function (resolve, reject) {
    Theme.find(query).sort(sort).populate(populate).exec(function (err, result) {
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
exports.create_theme = create_theme;
exports.get_themes = get_themes;