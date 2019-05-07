const Traduction = require('../../schema/schemaTraduction.js');
const Article = require('../../schema/schemaArticle.js');
const User = require('../../schema/schemaUser.js');
const article = require('../article/lib');
var sanitizeHtml = require('sanitize-html');
var himalaya = require('himalaya');
var h2p = require('html2plaintext');

function add_tradForReview(req, res) {
  if (!req.body || !req.body.langueCible || !req.body.translatedText) {
    //Le cas où la requête ne serait pas soumise ou nul
    res.status(400).json({
      "text": "Requête invalide"
    })
  } else {
    let traduction=req.body;
    traduction.status='En attente';
    let nbMotsTitres=0;nbMotsBody=0;
    //On transforme le html en JSON après l'avoir nettoyé
    let html= traduction.translatedText.body || traduction.translatedText;
    let safeHTML=sanitizeHtml(html, {allowedTags: false,allowedAttributes: false}); //Pour l'instant j'autorise tous les tags, il faudra voir plus finement ce qui peut descendre de l'éditeur et restreindre à ça
    if(!traduction.isStructure){
      let jsonBody=himalaya.parse(safeHTML, { ...himalaya.parseDefaults, includePositions: true })
      traduction.translatedText= traduction.translatedText.body ? {...traduction.translatedText, body:jsonBody}:jsonBody;
    }else{
      traduction={
        ...traduction,
        jsonId : traduction.articleId,
        articleId : traduction.id,
      }
      delete traduction.id
    }
    nbMotsBody=(h2p(safeHTML).split(/\s+/).length || 0);
    
    traduction.userId=req.userId;
    if(traduction.initialText && traduction.initialText.body && !traduction.isStructure){
      traduction.initialText.body = himalaya.parse(sanitizeHtml(traduction.initialText.body, {allowedTags: false,allowedAttributes: false}), { ...himalaya.parseDefaults, includePositions: true })
    }
    if(traduction.initialText && traduction.initialText.title){
      traduction.initialText.title = h2p(traduction.initialText.title)
    }
    if(traduction.translatedText.title){
      traduction.translatedText.title = h2p(traduction.translatedText.title)
      nbMotsTitres=traduction.translatedText.title.split(/\s+/).length || 0;
    }
    traduction.nbMots=nbMotsBody+nbMotsTitres;

    var _u = new Traduction(traduction);
    _u.save((err, data) => {
      if (err) {
        console.log(err);
        res.status(501).json({"text": "Erreur interne"})
      } else {
        console.log('succes')
        //J'ajoute en même temps cette traduction dans celles effectuées par l'utilisateur :
        if(req.userId){ User.findByIdAndUpdate({ _id: req.userId },{ "$push": { "traductionsFaites": data._id } },{new: true},(e) => {if(e){console.log(e);}}); }
        res.status(200).json({
          "text": "Succès",
          "data": data
        })
      }
    })
  }
}

function get_tradForReview(req, res) {
  var query = req.body.query;
  var sort = req.body.sort;
  var populate = req.body.populate;
  if(populate && populate.constructor === Object){
    populate.select = '-password';
  }else if(populate){
    populate={path:populate, select : '-password'};
  }else{populate='';}
  
  var find = new Promise(function (resolve, reject) {
    Traduction.find(query).sort(sort).populate(populate).exec(function (err, result) {
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

function validate_tradForReview(req, res) {
  if (!req.body || !req.body.articleId || (req.body.translatedText || []).length===0) {
    //Le cas où la requête ne serait pas soumise ou nul
    res.status(400).json({
      "text": "Requête invalide"
    })
  } else {
    let traductionUser=req.body;
    Traduction.findOneAndUpdate({_id: traductionUser._id}, {status:'Validée'}, { upsert: true , new: true}).then(data_traduction => {
      let traduction=data_traduction;
      Article.findOne({_id:traduction.articleId}).exec((err, result) => {
        if (!err) {
          if(result.body && result.body.constructor === Array){
            if(!_findNodeAndReplace(result.body, traduction.translatedText, traduction.langueCible, traduction.rightId)){
              res.status(300).json({"text": "Erreur d'insertion"})
            }else{
              //console.log(JSON.stringify(result.body));
              result.markModified("body");
              result.save((err, article_saved) => {
                if (err) {
                  console.log(err);
                  res.status(500).json({"text": "Erreur interne"})
                } else {
                  console.log('succes')
                  res.status(200).json({
                    "text": "Succès",
                    "data": article_saved,
                    "data_traduction" : data_traduction
                  })
                }
              });
            }
          }
        }else{console.log(err); res.status(400).json({"text": "Erreur d'identification de l'article"})}
      })
    }, err => {
      console.log(err)
      res.status(501).json({
        "text": "Erreur interne"
      })
    });

  }
}

const _findNodeAndReplace = (initial,translated,locale,id) => {
  let children=(initial.children || initial || []);
  for(var i=0; i < children.length;i++){
    let node=children[i];
    let attributes=node.attributes || [];
    for(var j=0; j < attributes.length;j++){
      if(attributes[j].key === 'id' && attributes[j].value === id){
        //On passe le correctif
        if(node.children.length === 1 && node.children[0].content && translated.length === 1 && translated[0].children.length === 1 && translated[0].children[0].children.length ===1 && translated[0].children[0].children[0].content){
          node.children[0].content[locale] = translated[0].children[0].children[0].content;
          return true
        }else{
          console.log('cas compliqué à retraiter')
          return false
        }
      }
    }
    if( (node.children || []).length > 0){
      if(!_findNodeAndReplace(node,translated,locale,id))
        return false;
    }
  }
  return true;
}

function update_tradForReview(req, res) {
  var translationId = req.body.translationId;
  var update = req.body.update;
  
  var find = new Promise(function (resolve, reject) {
    Traduction.findByIdAndUpdate({_id: translationId},update,{new: true}).exec(function (err, result) {
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

function get_progression(req, res) {
  var start = new Date();
  start.setHours(0,0,0,0);

  var find = new Promise(function (resolve, reject) {
    Traduction.aggregate([
      {$match:
        {'userId': req.userId,
         'created_at':{$gte: start},
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
exports.add_tradForReview = add_tradForReview;
exports.get_tradForReview = get_tradForReview;
exports.validate_tradForReview = validate_tradForReview;
exports.update_tradForReview=update_tradForReview;
exports.get_progression=get_progression;