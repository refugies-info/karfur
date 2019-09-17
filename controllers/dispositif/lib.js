const Dispositif = require('../../schema/schemaDispositif.js');
const Role = require('../../schema/schemaRole.js');
const User = require('../../schema/schemaUser.js');
const Structure = require('../../schema/schemaStructure.js');
var sanitizeHtml = require('sanitize-html');
var himalaya = require('himalaya');
var uniqid = require('uniqid');
const nodemailer = require("nodemailer");

const pointeurs = [ "titreInformatif", "titreMarque", "abstract"];

//Réactiver ici si besoin
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'diairagir@gmail.com',
    pass: process.env.GMAIL_PASS
  }
});

var mailOptions = {
  from: 'diairagir@gmail.com',
  to: 'souflam007@yahoo.fr',
  subject: 'Administration Agi\'R'
};

function add_dispositif(req, res) {
  if (!req.body || ((!req.body.titreMarque || !req.body.titreInformatif) && !req.body.dispositifId)) {
    res.status(400).json({ "text": "Requête invalide" })
  } else {
    let dispositif = req.body;
    
    dispositif.status = dispositif.status || 'En attente';
    if(dispositif.contenu){dispositif.nbMots = turnHTMLtoJSON(dispositif.contenu);}

    if(dispositif.dispositifId){
      promise=Dispositif.findOneAndUpdate({_id: dispositif.dispositifId}, dispositif, { upsert: true , new: true});
    }else{
      dispositif.creatorId = req.userId;
      promise=new Dispositif(dispositif).save();
    }

    promise.then(data => {
      //Je rajoute le statut de contributeur à l'utilisateur
      if(!dispositif.dispositifId){
        Role.findOne({'nom':'Contrib'}).exec((err, result) => {
          if(!err && result && req.userId){ 
            User.findByIdAndUpdate({ _id: req.userId },{ "$addToSet": { "roles": result._id, "contributions": data._id } },{new: true},(e) => {if(e){console.log(e);}}); 
          }
        })
        //J'associe la structure principale à ce dispositif
        Structure.findByIdAndUpdate({ _id: dispositif.mainSponsor },{ "$addToSet": { "dispositifsAssocies": data._id } },{new: true},(e) => {if(e){console.log(e);}}); 
      }
      mailOptions.html = "<p>Bonjour,<p>" + 
        "<p>Un nouveau contenu est en attente de validation sur la plateforme Agi'R, <a href='https://agir-dev.herokuapp.com/'>cliquez ici</a> pour y accéder</p>" + 
        "<p>Une nouvelle structure est également en attente de validation, <a href='https://agir-dev.herokuapp.com/'>cliquez ici</a> pour y accéder</p>" + 
        "<p>A bientôt,</p>" +
        "<p>Soufiane</p>";
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) { console.log(error); } else { console.log('Email sent: ' + info.response); }
      });
      res.status(200).json({
        "text": "Succès",
        "data": data
      })
    }).catch(err => {
      console.log(err);
      res.status(500).json({"text": "Erreur interne"})
    })
  }
}

function get_dispositif(req, res) {
  if (!req.body || !req.body.query) {
    res.status(400).json({
        "text": "Requête invalide"
    })
  } else {
    var query = req.body.query;
    var sort = req.body.sort;
    var populate = req.body.populate;
    var limit = req.body.limit;
    if(populate && populate.constructor === Object){
      populate.select = '-password';
    }else if(populate){
      populate={path:populate, select : '-password'};
    }else{populate='';}

    var find= new Promise(function (resolve, reject) {
      Dispositif.find(query).sort(sort).populate(populate).limit(limit).exec(function (err, result) {
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
      [].forEach.call(result, (dispositif) => { 
        dispositif = _turnToFr(dispositif);
        turnJSONtoHTML(dispositif.contenu);
      });
      res.status(200).json({
          "text": "Succès",
          "data": result
      })
    }, function (error) {
      console.log(error)
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

const _turnToFr = result => {
  pointeurs.forEach(x => { 
    if(result[x] && result[x].fr){ result[x] = result[x].fr };
  });

  result.contenu.forEach((p, i) => {
    if(p.title && p.title.fr){ p.title = p.title.fr; }
    if(p.content && p.content.fr){ p.content = p.content.fr; }
    if(p.children && p.children.length > 0){
      p.children.forEach((c, j) => {
        if(c.title && c.title.fr){ c.title = c.title.fr; }
        if(c.content && c.content.fr){ c.content = c.content.fr; }
      });
    }
  });
  return result
}

function update_dispositif(req, res) {
  if (!req.body || !req.body.dispositifId || !req.body.fieldName) {
    res.status(400).json({ "text": "Requête invalide" })
  } else {
    let {dispositifId, fieldName, suggestionId, type, ...dispositif} = req.body;
    let update = null;
    if(type==='pull'){
      update = { $pull: { [fieldName] : {'suggestionId': suggestionId } } }
    }else{
      update = { "$push": { [fieldName]: {
        ...(req.userId && {userId:req.userId}), 
        ...(req.user && {username:req.user.username, picture: req.user.picture}), 
        ...dispositif, 
        createdAt: new Date(),
        suggestionId: uniqid('feedback_')
      } } }
    }
    Dispositif.findByIdAndUpdate({ _id: dispositifId },update,{new: true},(err, data) => {
      if (err){res.status(404).json({ "text": "Pas de résultat" })}
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
      console.log(result)
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
  Dispositif.count(req.body, (err, count) => {
    if (err){res.status(404).json({ "text": "Pas de résultat" })}
    else{res.status(200).json(count)}
  });
}


const turnHTMLtoJSON = (contenu, nbMots=null) => {
  for(var i=0; i < contenu.length;i++){
    let html= contenu[i].content;
    console.log(html)
    nbMots+=(html || '').trim().split(/\s+/).length;
    let safeHTML=sanitizeHtml(html, {allowedTags: false,allowedAttributes: false}); //Pour l'instant j'autorise tous les tags, il faudra voir plus finement ce qui peut descendre de l'éditeur et restreindre à ça
    let jsonBody=himalaya.parse(safeHTML, { ...himalaya.parseDefaults, includePositions: false })
    contenu[i].content=jsonBody;

    if( (contenu[i].children || []).length > 0){
      nbMots=turnHTMLtoJSON(contenu[i].children, nbMots)  
    }
  }
  return nbMots
}

const turnJSONtoHTML = (contenu) => {
  for(var i=0; i < contenu.length;i++){
    if(contenu[i] && contenu[i].content){
      contenu[i].content = himalaya.stringify(contenu[i].content);
    }
    if( contenu[i] && contenu[i].children && contenu[i].children.length > 0){
      turnJSONtoHTML(contenu[i].children)  
    }
  }
}

//On exporte notre fonction
exports.add_dispositif = add_dispositif;
exports.get_dispositif = get_dispositif;
exports.count_dispositifs=count_dispositifs;
exports.update_dispositif = update_dispositif;
exports.turnHTMLtoJSON = turnHTMLtoJSON;
exports.turnJSONtoHTML = turnJSONtoHTML;
exports.get_dispo_progression = get_dispo_progression;