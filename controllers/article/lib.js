const Article = require('../../schema/schemaArticle.js');
const draftToHtml = require('draftjs-to-html');
var sanitizeHtml = require('sanitize-html');
var himalaya = require('himalaya');
var uniqid = require('uniqid');

let elementId=Math.floor(Math.random() * Math.floor(9999999));
function add_article(req, res) {
  if (!req.body || !req.body.title || !req.body.body) {
    //Le cas où la requête ne serait pas soumise ou nul
    res.status(400).json({
      "text": "Requête invalide"
    })
  } else {
    //On transforme le html en JSON après l'avoir nettoyé
    let draft=req.body.body;
    let html= draft.blocks ? draftToHtml(draft) : draft;
    let safeHTML=sanitizeHtml(html, {allowedTags: false,allowedAttributes: false}); //Pour l'instant j'autorise tous les tags, il faudra voir plus finement ce qui peut descendre de l'éditeur et restreindre à ça
    let jsonBody=himalaya.parse(safeHTML, { ...himalaya.parseDefaults, includePositions: true })

    make_nodes_unique_and_local(jsonBody, uniqid('initial_'))

    var article = {
      title:{fr:sanitizeHtml(req.body.title)},
      body:jsonBody
    };
    //On l'insère
    var _u = new Article(article);
    _u.save((err, article_saved) => {
      if (err) {
        console.log(err);
        res.status(500).json({"text": "Erreur interne"})
      } else {
        res.status(200).json({
          "text": "Succès",
          "article": article_saved
        })
      }
    })
  }
}

function get_article(req, res) {
  if (!req.body || !req.body.query) {
    res.status(400).json({
        "text": "Requête invalide"
    })
  } else {
    var query = req.body.query;
    var locale=req.body.locale;
    var find= new Promise(function (resolve, reject) {
      Article.find(query).exec(function (err, result) {
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
      [].forEach.call(result, (article, i) => { 
        returnLocalizedContent(article.body, locale)
        article.title=article.title[locale] || article.title.fr
      });
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

function add_traduction(req, res) {
  if (!req.body || !req.body.original || !req.body.original.itemId) {
    //Le cas où la requête ne serait pas soumise ou nul
    res.status(400).json({
      "text": "Requête invalide"
    })
  }else if (!req.body.locale) {
    //Le cas où la requête ne serait pas soumise ou nul
    res.status(401).json({
      "text": "La langue n'est pas spécifiée"
    })
  }else if (!req.body.translated.title || !req.body.translated.body) {
    //Le cas où la requête ne serait pas soumise ou nul
    res.status(401).json({
      "text": "Pas de contenu de traduction"
    })
  } else {
    let locale=req.body.locale; //TODO :S'assurer que ce locale est autorisé 
    //On transforme le html en JSON après l'avoir nettoyé
    let html=req.body.translated.body;
    let safeHTML=sanitizeHtml(html, {allowedTags: false,allowedAttributes: false}); //Pour l'instant j'autorise tous les tags, il faudra voir plus finement ce qui peut descendre de l'éditeur et restreindre à ça
    let jsonBody=himalaya.parse(safeHTML, { ...himalaya.parseDefaults, includePositions: false }) //Réactiver les positions si ça devient utile, mais je ne pense pas

        
    //On rend chaque noeud unique
    Article.findOne({_id:req.body.original.itemId}).exec((err, result) => {
      if (!err) {
        if(result.title && result.title.constructor === Object && result.title.fr){
          result.title[locale]= sanitizeHtml(req.body.translated.title); 
          result.markModified("title");
        }
        if(result.body && result.body.constructor === Array){
          //associateTranslation(result.body, jsonBody)
          if(addTranslationRestructure(result,jsonBody,locale)){
            result.markModified("body");
            result.save((err, article_saved) => {
              if (err) {
                console.log(err);
                res.status(500).json({"text": "Erreur interne"})
              } else {
                console.log('succes')
                res.status(200).json({
                  "text": "Succès",
                  "data": article_saved
                })
              }
            });
          }
        }
      }else{console.log(err); res.status(400).json({"text": "Erreur d'identification de l'article"})}
    })
  }
}

const make_nodes_unique_and_local = (object, uid) => {
  [].forEach.call(object, (el, i) => { 
    if(el.attributes){
      el.attributes.push({key:'id',value: uid + '_' + elementId});
      elementId++;
    }
    if(el.content){
      el.content={fr:el.content};//On le transforme en contenu localisé
    }
    if( (el.children || []).length > 0){
      make_nodes_unique_and_local(el.children, uid)
    }
  });
}

const returnLocalizedContent= (object,locale) => {
  [].forEach.call(object, (el, i) => { 
    if(el.content){
      el.content=el.content[locale] || el.content.fr
    }
    if( (el.children || []).length > 0){
      returnLocalizedContent(el.children, locale)
    }
  });
}

const associateTranslation = (initial,translated) => {
  //On s'assure dans un premier temps que la structure est la même :
  if(checkStructure(initial,translated)){
    addTranslation(initial,translated)
  }else{
    addTranslationRestructure(initial,translated, -1)
  }
}

const checkStructure = (initial,translated) => {
  for(var i=0; i < initial.length;i++){
    let attributes=initial[i].attributes;
    if(attributes){
      for(var j=0; j < attributes.length;j++){
        if(attributes[j].key === 'id'){
          for(var k=0; k < translated[i].attributes.length;k++){
            if(translated[i].attributes[k].key === 'id'){
              if(translated[i].attributes[k].value !== attributes[j].value.replace('initial_','target_')){
                // console.log(translated[i])
                // console.log(initial[i])
                return false
              }
            }
          }
        }
      }
    }
    if( (initial[i].children || []).length > 0){
      if(!checkStructure(initial[i].children, translated))
        return false
    }
  }
  return true;
}

const addTranslation = (initial,translated) => {
  console.log('ne devrait pas etre ici')
  for(var i=0; i < initial.length;i++){
    let node=initial[i];
    if(node.content){
      node.content[locale] = translated[i].content
      // console.log(node.content)
    }
    if( (node.children || []).length > 0){
      addTranslation(node.children, translated)
    }
  }
}

const addTranslationRestructure = (initial,translated,locale) => {
  let children=(initial.children || initial.body || []);
  let isSucces=true;
  for(var i=0; i < children.length;i++){
    let node=children[i];
    if(node.content && node.content.fr && node.content.fr.replace(/\s/g, '').length){  //On enlève le cas où le string contient seulement des espaces ou des saunts de ligne, pas besoin de traduire
      let attributes=initial.attributes || [];
      for(var j=0; j < attributes.length;j++){
        if(attributes[j].key === 'id'){
          let id=attributes[j].value;
          //On va chercher cet identifiant dans le JSON traduit
          let translatedJSON = translated.children?translated:{children:translated};
          let right_node = findId(translatedJSON, id);
          if(right_node){
            if(right_node.children.length === 1){
              node.content[locale] = right_node.children[0].content;
            }else if(right_node.children.length === 0){
              console.log('cest la maaarde')
            }else{
              let nbWithContent=0;
              let idArray=[];
              for(var k=0; k < right_node.children.length;k++){
                if(right_node.children[k].content){
                  nbWithContent++;
                  idArray.push(k);
                }
              }
              if(nbWithContent === 1){ //Cas simple où y a qu'un seul des noeuds enfants qui a du contenu
                node.content[locale] = right_node.children[idArray[0]].content;
              }else{
                if(right_node.children.length>=i-1 && right_node.children[i].content){
                  if(right_node.children[i].content.replace(/\s/g, '').length)  { //A défaut je me dis qu'il est sûrement situé au même endroit
                    node.content[locale] = right_node.children[i].content;
                  }else if(idArray.length===2 && idArray.indexOf(i) !== -1) { //Si le string traduit est vide et qu'il y en a juste deux, je prend l'autre
                    idArray.splice(idArray.indexOf(i), 1) 
                    node.content[locale] = right_node.children[idArray[0]].content;
                  }else{
                    console.log('cest la meeerde : ' + nbWithContent);console.log(node.content);
                    return false;
                  }
                }else{
                  console.log('cest encore plus la meeerde : ' + nbWithContent);console.log(node.content);
                  return false;
                }
              }
            }
            //Je réconcilie les espaces au début et à la fin :
            if(node.content[locale]){
              try {
                if(node.content.fr.substring(0,1)===' ' && node.content[locale].substring(0,1)!==' ')
                  node.content[locale]=' '+node.content[locale];
                if(node.content.fr.substring(0,1)!==' ' && node.content[locale].substring(0,1)===' ')
                  node.content[locale]=node.content[locale].substring(1);

                if(node.content.fr.substring(node.content.fr.length-1,node.content.fr.length)===' ' && node.content[locale].substring(node.content[locale].length-1,node.content[locale].length)!==' ')
                  node.content[locale]=node.content[locale] + ' ';
                if(node.content.fr.substring(node.content.fr.length-1,node.content.fr.length)!==' ' && node.content[locale].substring(node.content[locale].length-1,node.content[locale].length)===' ')
                  node.content[locale]=node.content[locale].substring(0,node.content[locale].length-1);
              } catch(error) {console.error(error);}
            }
          }else{
            console.log('nok : ' + id);
            return false
          }
        }
      }
    } else if( (node.children || []).length > 0){
      if(!addTranslationRestructure(node, translated,locale))
        return false;
    }
  }
  return isSucces;
}

const findId = (translated, idToFind) => {
  let children=(translated.children || []);
  let right_node=null;
  for(var i=0; i < children.length;i++){
    let node=children[i];
    if(node.content){
      let attributes=translated.attributes;
      for(var j=0; j < attributes.length;j++){
        if(attributes[j].key === 'id'){
          if(attributes[j].value === idToFind.replace('initial_','target_')){
            right_node=translated;
            break;
          }
        }
      }
    }
    if(!right_node && (node.children || []).length > 0){
      right_node=findId(node, idToFind)
    }
  }
  return right_node;
}

//On exporte notre fonction
exports.add_article = add_article;
exports.get_article = get_article;
exports.add_traduction = add_traduction;