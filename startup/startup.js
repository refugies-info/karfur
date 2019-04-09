if(process.env.NODE_ENV === 'dev') {
  const langues = require('../private/langues.json');
  const roles = require('../private/roles.json');
  const users = require('../private/users.json');
  const Article = require('../schema/schemaArticle.js');
  const fs = require('fs');
  var path = require('path');
  var uniqid = require('uniqid');

  const run = async (db) => {
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

      // let isLocaleSuccess=_insertI18nLocales()
      // let isDownloadSuccess=_getI18nLocales()
    }catch(e){console.log(e)}
  }

  const _insertI18nLocales = () => {
    const localeFolder = __dirname + "/../client/src/locales";
    let frJson=JSON.parse(fs.readFileSync(localeFolder + "/fr/translation.json", "utf8"));
    let nbMots=0;
    let avancement={fr:1};
    fs.readdirSync(localeFolder,{'withFileTypes':true}).forEach(dir => {
      if(dir !=='fr' && !path.extname(dir)){
        try{
          fs.readdirSync(localeFolder + "/"  + dir).forEach(file => {
            if(file.includes(".json")){
              var jsonLoc= JSON.parse(fs.readFileSync(localeFolder + "/"  + dir + "/" + file, "utf8"));
              avancement[dir]=0;
              let tempObj=_insertNested(frJson,jsonLoc, dir, nbMots, avancement);
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
      isStructure: true
    }
    Article.findOneAndUpdate({isStructure: true, title: 'Structure du site', status:'Actif'}, localeArticle, {upsert: true,new: true}, (err, doc) => {
      if (err) {
        console.log("Something went wrong when updating data : " + err);
        return false
      }
      console.log(doc);
      return true
    });
  }

  _insertNested = (frJson, jsonLoc, locale, nbMots, avancement) => {
    Object.keys(frJson).forEach((key) => {
      if(typeof frJson[key] === 'string' || (frJson[key] && typeof frJson[key].fr === 'string')){
        frJson[key]=frJson[key].fr ? frJson[key] : {fr:frJson[key], id : uniqid('struct_')};
        nbMots+=frJson[key].fr.trim().split(/\s+/).length;
        if(jsonLoc && jsonLoc[key] && (typeof jsonLoc[key] === 'string' || jsonLoc[key] instanceof String)){
          frJson[key][locale]=jsonLoc[key];
          avancement[locale]+=frJson[key].fr.trim().split(/\s+/).length
        }
      }else if(frJson.constructor === Object){
        let tempObj=_insertNested(frJson[key], (jsonLoc || {})[key], locale, nbMots, avancement);
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

  exports.run = run;
}