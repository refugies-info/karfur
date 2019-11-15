const User = require('../../schema/schemaUser.js');
const Role = require('../../schema/schemaRole.js');
const Langue = require('../../schema/schemaLangue.js');
const passwordHash = require("password-hash");
const authy = require('authy')(process.env.ACCOUNT_SECURITY_API_KEY);
const passwdCheck = require("zxcvbn");

//Cette fonction est appelée seulement lorsqu'un administrateur crée un nouveau compte
function signup(req, res) {
  if (!req.body.username || !req.body.password) {
    //Le cas où l'email ou bien le password ne serait pas soumis ou nul
    res.status(400).json({ "text": "Requête invalide" })
  } else {
    let user = req.body;
    if(user.password){
      if((passwdCheck(user.password) || {}).score < 1){
        return res.status(401).json({ "text": "Le mot de passe est trop faible" });
      }
      user.password=passwordHash.generate(user.password)
    }

    const find = new Promise(function (resolve, reject) {
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
      if(user.traducteur){
        user.roles=[req.roles.find(x=>x.nom==='Trad')._id]
        delete user.traducteur;
      }
      user.status='Actif';
      user.last_connected = new Date();

      Role.findOne({'nom':'User'}).exec((e, result) => {
        user.roles = (result || {})._id;

        var _u = new User(user);
        _u.save(function (err, user) {
          if (err) {
            console.log(err)
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
      })
    }, function (error) {
      console.log(error)
      switch (error) {
        case 500:
          res.status(500).json({
            "text": "Erreur interne"
          })
          break;
        case 204:
          res.status(404).json({
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

//Cette fonction est appelée quand tout utilisateur cherche à se connecter ou créer un compte
function login(req, res) {
  if (!req.body.username || !req.body.password) {
    //Le cas où le username ou bien le password ne serait pas soumis ou nul
    res.status(400).json({ "text": "Requête invalide" })
  } else {
    User.findOne({
      username: req.body.username
    }, async (err, user) => {
      if (err) { console.log(err);
        res.status(500).json({ "text": "Erreur interne", data: err });
      } else if(!user){ //On lui crée un nouveau compte
        user = req.body;
        if(user.cpassword && user.cpassword === user.password){
          if((passwdCheck(user.password) || {}).score < 1){
            return res.status(401).json({ "text": "Le mot de passe est trop faible" });
          }
          user.password=passwordHash.generate(user.password);
          if(user.roles && user.roles.length > 0 && req.user.roles.some(x => x.nom === "Admin")){
            user.roles=[...new Set([...user.roles, req.roles.find(x=>x.nom==='User')._id])]
          }else if(user.traducteur){
            user.roles=[req.roles.find(x=>x.nom==='Trad')._id]
            delete user.traducteur;
          }else{
            user.roles=[req.roles.find(x=>x.nom==='User')._id]
          }
          user.status='Actif';
          user.last_connected = new Date();
          var _u = new User(user);
          _u.save( (err, user) => {
            if (err) {
              res.status(500).json({ "text": "Erreur interne" })
            } else {
              //Si on a des données sur les langues j'alimente aussi les utilisateurs de la langue
              populateLanguages(user);
              res.status(200).json({
                "text": "Succès",
                "token": user.getToken(),
                "data": user
              })
            }
          })
        }else{
          res.status(401).json({ "text": "Les mots de passe ne correspondent pas" });
        }
      } else {
        if (user.authenticate(req.body.password)) {
          if((user.roles || []).some(x => x.equals(req.roles.find(x=>x.nom==='Admin')._id) )){
            if(user.authy_id && req.body.code){
              return authy.verify(user.authy_id, req.body.code, function (err, result) {
                if(err || !result){return res.status(204).json({ "text": "Erreur à la vérification du code" });}
                return proceed_with_login(req,res, user);
              });
            }else if(user.authy_id){
              console.log(user.username, " has authy_id ", user.authy_id)
              return authy.request_sms(user.authy_id, function (err_sms, result_sms) {
                if(err_sms){console.log(err_sms);return res.status(204).json({ "text": "Erreur à l'envoi du code à ce numéro'" });}
                return res.status(501).json({ "text": "no code supplied" });
              });
            }else if(req.body.email && req.body.phone){
              return authy.register_user(req.body.email, req.body.phone, '33', function (err, result) {
                if(err){return res.status(204).json({ "text": "Erreur à la création du compte authy" });}
                const authy_id = result.user.id;
                authy.request_sms(authy_id, function (err_sms, result_sms) {
                  if(err_sms){res.status(204).json({ "text": "Erreur à l'envoi du code à ce numéro'" }); return}
                });
                //On enregistre aussi son identifiant pour la suite
                user.authy_id= authy_id;
                user.phone= req.body.phone;
                user.email= req.body.email;
                user.save();
                return res.status(501).json({ "text": "no code supplied" });
              });
            }else{return res.status(502).json({ "text": "no authy_id", phone: user.phone, email: user.email });}
          }
          return proceed_with_login(req,res, user);
        }
        else{
          res.status(401).json({ "text": "Mot de passe incorrect" })
        }
      }
    })
  }
}

const proceed_with_login = function (req,res, user){
  //On change les infos de l'utilisateur
  if(req.body.traducteur){
    user.roles=[...new Set([...(user.roles || []), req.roles.find(x=>x.nom==='Trad')._id])]
  }
  user.last_connected = new Date();
  user.save();
  res.status(200).json({
    "token": user.getToken(),
    "text": "Authentification réussi"
  })
}

function checkUserExists(req, res) {
  if (!req.body.username) {
    res.status(400).json({ "text": "Requête invalide" })
  } else {
    User.findOne({
      username: req.body.username //.toLowerCase()
    }, (err, user) => {
      if (err) {
        res.status(500).json({ "text": "Erreur interne" })
      } else if(!user){
        res.status(204).json({ "text": "L'utilisateur n'existe pas", data: false })
      } else {
        res.status(200).json({ "text": "L'utilisateur existe", data: true })
      }
    })
  }
}

function set_user_info(req, res) {
  let user=req.body;
  if (!user || !user._id) {
    res.status(400).json({ "text": "Requête invalide" })
  } else {
    if(user.password){
      delete user.password;
    }

    //Si l'utilisateur n'est pas admin je vérifie qu'il ne se modifie que lui-même
    let isAdmin = req.user.roles.find(x => x.nom==='Admin')

    if(!isAdmin && user._id != req.user._id){
      res.status(401).json({ "text": "Token invalide" }); return false;
    }

    if(user.traducteur){
      user = {...user, $addToSet:{roles: req.roles.find(x=>x.nom==='Trad')._id}}
      delete user.traducteur;
    }
    User.findByIdAndUpdate({
      _id: user._id
    },user,{new: true},function(error,result){
      if(error){ console.log(error);
        res.status(500).json({ "text": "Erreur interne", "error": error })
      }else{
        //Si on a des données sur les langues j'alimente aussi les utilisateurs de la langue
        //Je le fais en non bloquant, il faut pas que ça renvoie une erreur à l'enregistrement
        populateLanguages(user);
        res.status(200).json({
          "data": result,
          "text": "Mise à jour réussie"
        })
      }
    });
  }
}

function change_password(req, res) {
  const {query, newUser}=req.body;
  if (!query._id || !query.username || !newUser.password || !newUser.newPassword) {
    res.status(400).json({ "text": "Requête invalide" })
  } else {
    if(query._id != req.user._id){ return res.status(401).json({ "text": "Token invalide" }); }
    if(newUser.newPassword !== newUser.cpassword){ return res.status(400).json({ "text": "Les mots de passe ne correspondent pas" }); }
    User.findOne(query, (err, user) => {
      if (err) {
        return res.status(500).json({ "text": "Erreur interne" })
      } else if(!user){
        return res.status(404).json({ "text": "L'utilisateur n'existe pas" })
      } else if( !user.authenticate(newUser.password) ){
        return res.status(401).json({ "text": "Echec d'authentification" })
      }else if( (passwdCheck(newUser.newPassword) || {}).score < 1 ){
        return res.status(401).json({ "text": "Le mot de passe est trop faible" });
      } else {
        user.password = passwordHash.generate(newUser.newPassword);
        user.save();
        res.status(200).json({
          "token": user.getToken(),
          "text": "Authentification réussi"
        })
      }
    })
  }
}

function get_users(req, res) {
  var query = req.body.query;
  var sort = req.body.sort;
  var populate = req.body.populate;

  if(populate && populate.constructor === Object){
    populate.select = '-password';
  }else if(populate){
    populate={path:populate, select : '-password'};
  }else{populate='';}
  
  var find = new Promise( (resolve, reject) => {
    User.find(query).sort(sort).populate(populate).exec(function (err, result) {
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
      case 404:
        res.status(404).json({
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


function get_user_info(req, res) {
  res.status(200).json({
    "text": "Succès",
    "data": req.user
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
exports.checkUserExists = checkUserExists;
exports.set_user_info=set_user_info;
exports.change_password = change_password;
exports.get_users=get_users;
exports.get_user_info=get_user_info;