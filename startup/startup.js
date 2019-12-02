let run=null;
console.log('starting up')
const Article = require('../schema/schemaArticle.js');
const Langue = require('../schema/schemaLangue.js');
const fs = require('fs');
var path = require('path');
var uniqid = require('uniqid');
var _ = require("lodash");

if(process.env.NODE_ENV === 'dev') {
  const langues = require('../private/langues.json');
  const roles = require('../private/roles.json');
  const users = require('../private/users.json');
  const dispositif = require('../private/dispositif.json');

  run = async (db) => {
    try{
      let nb_documents=await db.collection('langues').countDocuments()
      if(nb_documents < langues.length){
        console.log(await db.collection('langues').insertMany(langues).insertedIds);
      }

      nb_documents=await db.collection('roles').countDocuments()
      if(nb_documents < roles.length){
        console.log(await db.collection('roles').insertMany(roles).insertedIds);
      }

      nb_documents=await db.collection('users').countDocuments()
      if(nb_documents < users.length){
        console.log(await db.collection('users').insertMany(users).insertedIds);
      }

      nb_documents=await db.collection('dispositifs').countDocuments()
      if(nb_documents < 10 && false){
        let dispositifs = new Array(100).fill(dispositif).map((x, key) => {return {
          ...x,
          titreInformatif: x.titreInformatif + key,
          titreMarque: x.titreMarque + key,
          abstract: x.abstract + key,
          audience: x.audience.filter(()=> Math.random() <= 0.5),
          audienceAge: x.audienceAge.filter(()=> Math.random() <= 0.5),
          tags: x.tags.filter((y)=> Math.random() <= 0.5),
          localisation: ['Paris', 'Aubervilliers', 'Seine Saint-Denis', 'Calais', 'Lyon'][Math.floor(Math.random() * 4,99)],
          "niveauFrancais":["pas", "peu", "moyennement", "bien", "parfaitement"][Math.floor(Math.random() * 4,99)],
        }})
        console.log(await db.collection('dispositifs').insertMany(dispositifs).insertedIds);
      }

      // let isLocaleSuccess=_insertI18nLocales() //depuis le fichier local vers la BDD
      // let isMergeSuccess=_mergeLocalesFiles() //fusionner en local avec les données de prod
      // let isDownloadSuccess=_getI18nLocales() //depuis la BDD vers le fichier local
      // let isAvancementSuccess = _recalculateAvancement(); //Recalcule l'avancement de tous les strings du site
    }catch(e){console.log(e)}
  }
}else{
  run = async (db) => {
    try{
      // let isLocaleSuccess=_insertI18nLocales()
      // let isDownloadSuccess=_getI18nLocales()
      // let isAvancementSuccess = _recalculateAvancement(); //Recalcule l'avancement de tous les strings du site
    }catch(e){console.log(e)}
  }
}

const _insertI18nLocales = async () => {
  //On commence par récupérer l'article dans son état actuel :
  const currArticle = await Article.findOne({isStructure: true, title: 'Structure du site', status:'Actif', canBeUpdated: true});
  if(!currArticle || !currArticle.body){console.log('aucun article retourné, fin.'); return;}
  const localeFolder = __dirname + "/../client/src/locales";
  let frJson=JSON.parse(fs.readFileSync(localeFolder + "/fr/translation.json", "utf8"));
  let nbMots=0;
  let avancement={fr:1};
  fs.readdirSync(localeFolder,{'withFileTypes':true}).forEach(dir => {
    if(dir.name && !path.extname(dir.name) && dir.name.slice(0,1) !== '.'){
      try{
        fs.readdirSync(localeFolder + "/"  + dir.name).forEach(file => {
          if(file.includes(".json")){ console.log(dir.name, file)
            var jsonLoc= JSON.parse(fs.readFileSync(localeFolder + "/"  + dir.name + "/" + file, "utf8"));
            avancement[dir.name]=0;
            let tempObj=_insertNested(frJson,jsonLoc, dir.name, nbMots, avancement, currArticle.body);
            nbMots=tempObj.nbMots;
            avancement=tempObj.avancement;
          }
        })
      }catch(e){console.log(e)}
    }
  })
  if(nbMots>0){Object.keys(avancement).map((key) => {avancement[key] = avancement[key]/nbMots;});}
  let localeArticle={
    title: 'Structure du site',
    body: frJson,
    nombreMots:nbMots,
    avancement:avancement,
    status:'Actif',
    isStructure: true,
    canBeUpdated: false
  }
  Article.findOneAndUpdate(
    {isStructure: true, title: 'Structure du site', status:'Actif', canBeUpdated: true}, 
    localeArticle, 
    {upsert: false,new: true},  //Modifier upsert à true si on accepte d'en créer un nouveau si on ne le trouve pas
    (err, doc) => {
      if (err) {
        console.log("Something went wrong when updating data : " + err);
        return false
      }else if(doc){
        console.log('translation data inserted with great success');
      }
      return true
    }
  );
}

_insertNested = (frJson, jsonLoc, locale, nbMots, avancement, currBody) => {
  Object.keys(frJson).forEach((key) => {
    if(typeof frJson[key] === 'string' || (frJson[key] && typeof frJson[key].fr === 'string')){
      frJson[key]=frJson[key].fr ? frJson[key] : {fr:frJson[key], id: _.get(currBody, key + ".id") || uniqid('struct_')};
      if(locale === "fr"){ nbMots+=frJson[key].fr.trim().split(/\s+/).length; }
      if(jsonLoc && jsonLoc[key] && (typeof jsonLoc[key] === 'string' || jsonLoc[key] instanceof String)){
        frJson[key][locale]=jsonLoc[key];
        avancement[locale]+=frJson[key].fr.trim().split(/\s+/).length
      }
    }else if(frJson.constructor === Object){
      let tempObj=_insertNested(frJson[key], (jsonLoc || {})[key], locale, nbMots, avancement, _.get(currBody, key, {}));
      nbMots=tempObj.nbMots;
      avancement=tempObj.avancement;
    }else{
      console.log(frJson.constructor)
    }
  })
  return {nbMots, avancement}
}

const _getI18nLocales = () => {
  Article.findOne({isStructure: true, title: 'Structure du site', status:'Actif'}, (err, article) => {
    if (err || !article) {
      console.log("Something went wrong when downloading data : " + err);
      return false
    }
    //On boucle sur tous les locales :
    Object.keys(article.avancement).forEach((key) => {
      let localeJSON=JSON.parse(JSON.stringify(article.body))
      _getFromNested(localeJSON, key);
      //On écrit le json en local
      if (!fs.existsSync(__dirname + "/../client/src/locales/" + key)){
        fs.mkdirSync(__dirname + "/../client/src/locales/" + key);
      }
      fs.writeFile(__dirname + "/../client/src/locales/" + key + "/translation.json", JSON.stringify(localeJSON, null, 2), function(err) {
        if (err) {
          console.log(err);
        }else{
          console.log('Key saved to json : ', key)
        }
      });
    })
  });
}

const _mergeLocalesFiles = () => {
  const localJson = require('../client/src/locales/merger/local.js').local;
  const prodJson = require('../client/src/locales/merger/prod.js').prod;
  let nbMots=0;
  let avancement={fr:1};
  
  let tempObj=_mergeNested(localJson.body,prodJson.body,nbMots, avancement);
  nbMots=tempObj.nbMots;
  avancement=tempObj.avancement;
  
  if(nbMots>0){Object.keys(avancement).map((key) => {avancement[key] = key==="fr" ? avancement[key] : avancement[key]/nbMots;});}
  let localeArticle={
    title: 'Structure du site',
    body: localJson.body,
    nombreMots:nbMots,
    avancement:avancement,
    canBeUpdated: false
  }
  Article.findOneAndUpdate(
    {isStructure: true, title: 'Structure du site', status:'Actif', canBeUpdated: true}, 
    localeArticle, 
    {upsert: false,new: true},  //Modifier upsert à true si on accepte d'en créer un nouveau si on ne le trouve pas
    (err, doc) => {
      if (err) {
        console.log("Something went wrong when updating data : " + err);
        return false
      }else if(doc){
        console.log('translation data merged with great success');
      }
      return true
    }
  );
}

_mergeNested = (localJson, prodJson, nbMots, avancement) => {
  //On insère les traductions en prod dans le json local
  Object.keys(localJson).forEach((key) => {
    if(localJson[key] && localJson[key].fr && typeof localJson[key].fr === 'string'){
      if(prodJson && prodJson[key] && prodJson[key].constructor === Object){
        Object.keys(prodJson[key]).forEach((ln) => {
          if(ln !== "fr"){
            localJson[key][ln] = prodJson[key][ln];
            avancement[ln]= (avancement[ln] || 0) + localJson[key].fr.trim().split(/\s+/).length
          }
        })
      }
      nbMots+=localJson[key].fr.trim().split(/\s+/).length;
    }else if(localJson.constructor === Object){
      let tempObj=_mergeNested(localJson[key], (prodJson || {})[key], nbMots, avancement);
      nbMots=tempObj.nbMots;
      avancement=tempObj.avancement;
    }else{
      console.log("erreur merge : ", localJson.constructor)
    }
  })
  return {nbMots, avancement}
}

_getFromNested = (localeJSON, locale) => {
  Object.keys(localeJSON).forEach((key) => {
    if(localeJSON[key] && typeof localeJSON[key].fr === 'string'){
      if(localeJSON[key][locale]){
        localeJSON[key]=localeJSON[key][locale]
      }else{
        delete localeJSON[key]
      }
    }else if(localeJSON.constructor === Object && localeJSON[key]){
      _getFromNested(localeJSON[key], locale);
    }
  })
}

const _recalculateAvancement = () => {
  Article.findOne({isStructure: true, title: 'Structure du site', status:'Actif', canBeUpdated: true}, (err, article) => {
    if (err || !article) {
      return console.log("Something went wrong when downloading data : " + err);
    }
    let nbMots=0, avancement={fr:1};
    let tempObj=_calculateNested(article.body, nbMots, avancement);
    nbMots=tempObj.nbMots;
    avancement=tempObj.avancement;
    if(nbMots>0){
      Object.keys(avancement).map((key) => {
        avancement[key] = key !== "fr" ? avancement[key]/nbMots : avancement[key];
        if(key !== "fr" && avancement[key] && avancement[key] > 0){
          Langue.findOne({i18nCode:key}).exec( (err, resultLangue) => {
            if (err || !resultLangue) {
              return console.log('erreur à la mise à jour de l\'avancement de la langue cible : ' + key, avancement[key])
            } else {
              resultLangue.avancement= avancement[key] || 0;
              resultLangue.save();
              console.log('Langue ' + key + ' sauvegardée avec l\'avancement : ' + avancement[key]);
            }
          });
        }
      });
      article.avancement = avancement;
      article.canBeUpdated = false;
      article.save();
      console.log('article correctement enregistré')
    }

  });
}

_calculateNested = (article, nbMots, avancement) => {
  Object.keys(article).forEach((key) => {
    if(article[key] && article[key].fr && typeof article[key].fr === 'string'){
      Object.keys(article[key]).forEach((locale) => {
        if(locale === "fr"){
          nbMots = (nbMots || 0) + article[key].fr.trim().split(/\s+/).length;
        }else if(locale !== "id"){
          avancement[locale]= (avancement[locale] || 0) + article[key].fr.trim().split(/\s+/).length;
        }
      })
    }else if(article.constructor === Object){
      let tempObj=_calculateNested(article[key], nbMots, avancement);
      nbMots=tempObj.nbMots;
      avancement=tempObj.avancement;
    }else{
      console.log(article.constructor)
    }
  })
  return {nbMots, avancement}
}

exports.run = run;