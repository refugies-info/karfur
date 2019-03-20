const User = require('../../schema/schemaUser.js');
const Langue = require('../../schema/schemaLangue.js');
const passwordHash = require("password-hash");

function signup(req, res) {
  if (!req.body.username || !req.body.password) {
    //Le cas où l'email ou bien le password ne serait pas soumis ou nul
    res.status(400).json({
        "text": "Requête invalide"
    })
  } else {
    var user = req.body;
    if(user.password)
      user.password=passwordHash.generate(user.password)

    var find = new Promise(function (resolve, reject) {
      User.findOne({
        username: user.username
      }, function (err, result) {
        if (err) {
          reject(500);
        } else {
          if (result) {
            reject(204)
          } else {
            resolve(true)
          }
        }
      })
    })

    find.then(function () {
      var _u = new User(user);
      _u.save(function (err, user) {
        if (err) {
          res.status(500).json({
            "text": "Erreur interne"
          })
        } else {
          //Si on a des données sur les langues j'alimente aussi les utilisateurs de la langue
          //Je le fais en non bloquant, il faut pas que ça bloque l'enregistrement
          populateLanguages(user);

          res.status(200).json({
            "text": "Succès",
            "token": user.getToken(),
            "data": user
          })
        }
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
              "text": "Le nom d'utilisateur existe déjà"
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

function login(req, res) {
  if (!req.body.username || !req.body.password) {
      //Le cas où le username ou bien le password ne serait pas soumit ou nul
      res.status(400).json({
          "text": "Requête invalide"
      })
  } else {
    User.findOne({
      username: req.body.username
    }, function (err, user) {
      if (err) {
          res.status(500).json({
              "text": "Erreur interne"
          })
      }
      else if(!user){
          res.status(401).json({
              "text": "L'utilisateur n'existe pas"
          })
      }
      else {
          if (user.authenticate(req.body.password)) {
            res.status(200).json({
                "token": user.getToken(),
                "text": "Authentification réussi"
            })
            //On change les infos de l'utilisateur
            // if(req.body.traducteur){
            //   console.log('je change le statut utilisateur à traducteur')
            //   user.traducteur=true
            //   user.save();
            // }
          }
          else{
              res.status(401).json({
                  "text": "Mot de passe incorrect"
              })
          }
      }
    })
  }
}

function set_user_info(req, res) {
  let user=req.body;
  if (!user || !user._id) {
    res.status(400).json({
      "text": "Requête invalide"
    })
  } else {
    if(user.password){
      delete user.password;
    }

    User.findByIdAndUpdate({
      _id: user._id
    },user,{new: true},function(error,result){
      if(error){
        console.log(error);
        res.status(500).json({
          "text": "Erreur interne",
          "error": error
        })
      }else{
        //Si on a des données sur les langues j'alimente aussi les utilisateurs de la langue
        //Je le fais en non bloquant, il faut pas que ça renvoie une erreur à l'enregistrement
        console.log('jappelle la fn')
        populateLanguages(user);

        res.status(200).json({
          "data": result,
          "text": "Mise à jour réussie"
        })
      }
    });
  }
}


function get_users(req, res) {
  var query = req.body.query;
  var sort = req.body.sort;
  var find = new Promise( (resolve, reject) => {
    User.find(query).sort(sort).exec(function (err, result) {
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

  find.then( (result) => {
    if(result){
      result.forEach((item) => {
        item.password='Hidden';
      });
    }

    res.status(200).json({
        "text": "Succès",
        "data": result
    })
  }, (error) => {
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

const populateLanguages = (user) => {
  if(user.selectedLanguages && user.selectedLanguages.constructor === Array && user.selectedLanguages.length>0){
    user.selectedLanguages.forEach((langue) => {
      Langue.findOne({_id:langue._id}).exec((err, result) => {
        if (!err) {
          if(!result.participants){
            result.participants = [user._id];
            result.save();
          }else if(!result.participants.some((participant) => participant.equals(user._id))){
            result.participants=[...result.participants,user._id];
            result.save();
          }
        }else{console.log(err)}
      })
    });

    //Je vérifie maintenant s'il n'était pas inscrit dans d'autres langues à tort:
    Langue.find({participants: user._id}).exec((err, results) => {
      if (!err) {
        results.forEach((result) => {
          if(result.participants.some((participant) => participant.equals(user._id))){
            if(!user.selectedLanguages.some(x => x._id == result._id)){    
              Langue.update( { _id: result._id }, { $pull: { participants: user._id }}).exec((err) => {if (err) {console.log(err)}})
            }
          }
        });
      }else{console.log(err)}
    })
  };
}

//On exporte nos fonctions

exports.login = login;
exports.signup = signup;
exports.set_user_info=set_user_info;
exports.get_users=get_users;