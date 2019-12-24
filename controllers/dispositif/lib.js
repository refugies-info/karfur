const Dispositif = require('../../schema/schemaDispositif.js');
const Role = require('../../schema/schemaRole.js');
const User = require('../../schema/schemaUser.js');
const Structure = require('../../schema/schemaStructure.js');
var uniqid = require('uniqid');
const nodemailer = require("nodemailer");
const DBEvent = require('../../schema/schemaDBEvent.js');
const _ = require('lodash');
const {turnToLocalized, turnHTMLtoJSON, turnJSONtoHTML} = require('./functions');
// const gmail_auth = require('./gmail_auth');

//Réactiver ici si besoin
const transporter = nodemailer.createTransport({
  // service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'diairagir@gmail.com',
    pass: process.env.GMAIL_PASS
  },
});

var mailOptions = {
  from: 'diairagir@gmail.com',
  to: process.env.NODE_ENV === "dev" ? "souflam007@yahoo.fr" : 'diairagir@gmail.com',
  subject: 'Administration Réfugiés.info'
};

const url = process.env.NODE_ENV === 'dev' ? "http://localhost:3000/" : process.env.NODE_ENV === 'quality' ? "https://agir-qa.herokuapp.com/" : "https://www.refugies.info/"

function add_dispositif(req, res) {
  if (!req.fromSite) { 
    return res.status(405).json({ "text": "Requête bloquée par API" }) 
  } else if (!req.body || ((!req.body.titreInformatif) && !req.body.dispositifId)) {
    return res.status(400).json({ "text": "Requête invalide" })
  } else {
    new DBEvent({action: JSON.stringify(req.body), userId: _.get(req, "userId"), roles: _.get(req, "user.roles"), api: arguments.callee.name}).save()
    let dispositif = req.body;
    dispositif.status = dispositif.status || 'En attente';
    if(dispositif.contenu){dispositif.nbMots = turnHTMLtoJSON(dispositif.contenu);}

    //Si le dispositif existe déjà on fait juste un update
    if(dispositif.dispositifId){
      promise=Dispositif.findOneAndUpdate({_id: dispositif.dispositifId}, dispositif, { upsert: true , new: true});
    }else{
      dispositif.creatorId = req.userId;
      promise=new Dispositif(dispositif).save();
    }

    return promise.then(data => {
      //Je rajoute le statut de contributeur à l'utilisateur
      if(!dispositif.dispositifId){
        Role.findOne({'nom':'Contrib'}).exec((err, result) => {
          if(!err && result && req.userId){ 
            User.findByIdAndUpdate({ _id: req.userId },{ "$addToSet": { "roles": result._id, "contributions": data._id } },{new: true},(e) => {if(e){console.log(e);}}); 
          }
        })
      }
      //J'associe la structure principale à ce dispositif
      if(dispositif.mainSponsor){
        Structure.findByIdAndUpdate({ _id: dispositif.mainSponsor },{ "$addToSet": { "dispositifsAssocies": data._id } },{new: true},(e) => {if(e){console.log(e);}}); 
      }

      _handleMailNotification(data);

      return res.status(200).json({
        "text": "Succès",
        "data": data
      })
    }).catch(err => {
      console.log(err);
      return res.status(500).json({"text": "Erreur interne", data: err})
    })
  }
}

function get_dispositif(req, res) {
  if (!req.body || !req.body.query) {
    res.status(400).json({ "text": "Requête invalide" })
  } else {
    new DBEvent({action: JSON.stringify(req.body), userId: _.get(req, "userId"), roles: _.get(req, "user.roles"), api: arguments.callee.name}).save()
    let {query, sort, populate, limit, random, locale} = req.body;
    locale = locale || 'fr';

    if (!req.fromSite) {  //On n'autorise pas les populate en API externe
      populate = '';
    }else if(populate && populate.constructor === Object){
      populate.select = '-password';
    }else if(populate){
      populate={path:populate, select : '-password'};
    }else{populate='';}

    let promise=null;
    if(random){
      promise=Dispositif.aggregate([
        { $match : query },
        { $sample : { size: 1 } }
      ]);
    }else{
      promise=Dispositif.find(query).sort(sort).populate(populate).limit(limit)//.setOptions({explain: 'executionStats'});
    }
    // promise.explain("allPlansExecution").then(d => console.log("query explained : ", d));
    promise.then((result) => {
      [].forEach.call(result, (dispositif) => { 
        dispositif = turnToLocalized(dispositif, locale);
        turnJSONtoHTML(dispositif.contenu);
      });
      res.status(200).json({
        "text": "Succès",
        "data": result
      })
    }).catch(function (error) {console.log(error)
      switch (error) {
        case 500:
          res.status(500).json({
            "text": "Erreur interne"
          })
          break;
        case 404:
          res.status(404).json({
            "text": "Pas de résultat"
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

function update_dispositif(req, res) {
  if (!req.fromSite) { 
    return res.status(405).json({ "text": "Requête bloquée par API" }) 
  } else if (!req.body || !req.body.dispositifId || !req.body.fieldName) {
    res.status(400).json({ "text": "Requête invalide" })
  } else {
    new DBEvent({action: JSON.stringify(req.body), userId: _.get(req, "userId"), roles: _.get(req, "user.roles"), api: arguments.callee.name}).save()
    let {dispositifId, fieldName, suggestionId, type, ...dispositif} = req.body;
    let update = null, query = { _id: dispositifId };
    if(type==='pull'){
      update = { $pull: { [fieldName] : {'suggestionId': suggestionId } } }
    }else if(type==='set'){
      query = {...query, "suggestions.suggestionId": suggestionId};
      update = { "$set": { [fieldName]: true } }
    }else{
      update = { "$push": { [fieldName]: {
        ...(req.userId && {userId:req.userId}), 
        ...(req.user && {username:req.user.username, picture: req.user.picture}), 
        ...dispositif, 
        createdAt: new Date(),
        suggestionId: uniqid('feedback_')
      } } }
    }
    Dispositif.findOneAndUpdate(query, update,{new: true},(err, data) => {
      if (err){res.status(404).json({ "text": "Pas de résultat", error: err }); console.log(err)}
      else{
        res.status(200).json({
          "text": "Succès",
          "data": data
        })
      }
    }); 
  }
}

function get_dispo_progression(req, res) {
  new DBEvent({userId: _.get(req, "userId"), roles: _.get(req, "user.roles"), api: arguments.callee.name}).save()
  var start = new Date();
  start.setHours(0,0,0,0);

  var find = new Promise(function (resolve, reject) {
    Dispositif.aggregate([
      {$match:
        {'creatorId': req.userId,
         'created_at': {$gte: start},
         'timeSpent': { $ne: null } } },
      {$group:
         { _id : req.userId,
          nbMots: { $sum: "$nbMots"},
          timeSpent:{ $sum: "$timeSpent"},
          count:{ $sum: 1}}}
    ]).exec(function (err, result) {
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

  find.then(function (result) {
    res.status(200).json({
        "text": "Succès",
        "data": result
    })
  }, (e) => _errorHandler(e,res))
}

function count_dispositifs(req, res) {
  new DBEvent({action: JSON.stringify(req.body), userId: _.get(req, "userId"), roles: _.get(req, "user.roles"), api: arguments.callee.name}).save()
  Dispositif.count(req.body, (err, count) => {
    if (err){res.status(404).json({ "text": "Pas de résultat" })}
    else{res.status(200).json(count)}
  });
}

const _errorHandler = (error, res) => {
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
}

const _handleMailNotification = dispositif => {
  let html = "";
  const status = dispositif.status;
  // ["Actif", "Accepté structure", , "Brouillon", "Rejeté structure", "Rejeté admin", "Inactif", "Supprimé"]
  if(["En attente", "En attente admin", "En attente non prioritaire"].includes(status)){
    html = "<p>Bonjour,</p>";
  
    if( ["En attente", "En attente admin", "En attente non prioritaire"].includes(status) ){
      html += "<p>Un nouveau contenu (" + dispositif.typeContenu + ") est '<b>" + status + " de validation</b>' sur la plateforme Réfugiés.info (environnement : '" + process.env.NODE_ENV + "')</p>" +
        "<p><a href=" + url + (dispositif.typeContenu || "dispositif") + "/" + dispositif._id + ">Cliquez ici</a> pour accéder au contenu, ou accédez <a href=" + url + "backend/admin-contrib>à la page d'administration</a>.</p>";
    }
    html += "<p>A bientôt,</p>" +
      "<p>Soufiane, webmestre (who says that ?!) Réfugiés.info</p>";
    
    mailOptions.html = html;
    mailOptions.subject = 'Administration Réfugiés.info - ' + dispositif.titreInformatif + ' - ' + status;
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) { console.log(error); } else { console.log('Email sent: ' + info.response); }
    });
  }
}
//On exporte notre fonction
exports.add_dispositif = add_dispositif;
exports.get_dispositif = get_dispositif;
exports.count_dispositifs=count_dispositifs;
exports.update_dispositif = update_dispositif;
exports.get_dispo_progression = get_dispo_progression;

//Utilisés dans d'autres controllers :
exports.transporter = transporter;
exports.mailOptions = mailOptions;
exports.url = url;