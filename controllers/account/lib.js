const User = require('../../schema/schemaUser.js');
const passwordHash = require("password-hash");

function signup(req, res) {
  console.log(req.body)
    if (!req.body.email || !req.body.password) {
        //Le cas où l'email ou bien le password ne serait pas soumis ou nul
        res.status(400).json({
            "text": "Requête invalide"
        })
    } else {
        var user = {
            email: req.body.email,
            password: passwordHash.generate(req.body.password)
        }
        var findUser = new Promise(function (resolve, reject) {
            User.findOne({
                email: user.email
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

        findUser.then(function () {
            var _u = new User(user);
            _u.save(function (err, user) {
                if (err) {
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
                } else {
                    res.status(200).json({
                        "text": "Succès",
                        "token": user.getToken()
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

function login(req, res) {
  if (!req.body.email || !req.body.password) {
      //Le cas où l'email ou bien le password ne serait pas soumit ou nul
      res.status(400).json({
          "text": "Requête invalide"
      })
  } else {
      User.findOne({
          email: req.body.email
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

//On exporte nos deux fonctions

exports.login = login;
exports.signup = signup;