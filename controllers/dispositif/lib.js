const Dispositif = require('../../schema/schemaDispositif.js');
const Role = require('../../schema/schemaRole.js');
const User = require('../../schema/schemaUser.js');
var sanitizeHtml = require('sanitize-html');
var himalaya = require('himalaya');
var uniqid = require('uniqid');

function add_dispositif(req, res) {
  if (!req.body || !req.body.titreMarque || !req.body.titreInformatif) {
    //Le cas où la requête ne serait pas soumise ou nul
    res.status(400).json({
      "text": "Requête invalide"
    })
  } else {
    let dispositif = req.body;
    let nbMots=_turnHTMLtoJSON(dispositif.contenu)
    
    dispositif.creatorId = req.userId;
    dispositif.status = dispositif.status || 'Actif';
    dispositif.nbMots = nbMots;

    if(dispositif.dispositifId){
      promise=Dispositif.findOneAndUpdate({_id: dispositif.dispositifId}, dispositif, { upsert: true , new: true});
    }else{
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
      }
      res.status(200).json({
        "text": "Succès",
        "data": data
      })
    }).catch(err => {
      console.log(err);
      res.status(500).json({"text": "Erreur interne"})
    })

    // _u.save((err, data) => {
    //   if (err) {
    //     console.log(err);
    //     res.status(500).json({"text": "Erreur interne"})
    //   } else {
    //     //Je rajoute le statut de contributeur à l'utilisateur
    //     Role.findOne({'nom':'Contrib'}).exec((err, result) => {
    //       if(!err && result && req.userId){ 
    //         User.findByIdAndUpdate({ _id: req.userId },{ "$addToSet": { "roles": result._id, "contributions": data._id } },{new: true},(e) => {if(e){console.log(e);}}); 
    //       }
    //     })
    //     res.status(200).json({
    //       "text": "Succès",
    //       "data": data
    //     })
    //   }
    // })
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
        _turnJSONtoHTML(dispositif.contenu)
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

function count_dispositifs(req, res) {
  Dispositif.count(req.body, (err, count) => {
    if (err){res.status(404).json({ "text": "Pas de résultat" })}
    else{res.status(200).json(count)}
  });
}


const _turnHTMLtoJSON = (contenu, nbMots=null) => {
  for(var i=0; i < contenu.length;i++){
    let html= contenu[i].content;
    nbMots+=(html || '').trim().split(/\s+/).length;
    let safeHTML=sanitizeHtml(html, {allowedTags: false,allowedAttributes: false}); //Pour l'instant j'autorise tous les tags, il faudra voir plus finement ce qui peut descendre de l'éditeur et restreindre à ça
    let jsonBody=himalaya.parse(safeHTML, { ...himalaya.parseDefaults, includePositions: false })
    contenu[i].content=jsonBody;

    if( (contenu[i].children || []).length > 0){
      nbMots=_turnHTMLtoJSON(contenu[i].children, nbMots)  
    }
  }
  return nbMots
}

const _turnJSONtoHTML = (contenu) => {
  for(var i=0; i < contenu.length;i++){
    contenu[i].content = himalaya.stringify(contenu[i].content);

    if( (contenu[i].children || []).length > 0){
      _turnJSONtoHTML(contenu[i].children)  
    }
  }
}

//On exporte notre fonction
exports.add_dispositif = add_dispositif;
exports.get_dispositif = get_dispositif;
exports.count_dispositifs=count_dispositifs;
exports.update_dispositif = update_dispositif;