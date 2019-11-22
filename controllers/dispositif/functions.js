const himalaya = require('himalaya');
var sanitizeHtml = require('sanitize-html');
const sanitizeOptions = require('../article/lib.js').sanitizeOptions;

const pointeurs = [ "titreInformatif", "titreMarque", "abstract"];

const turnToFr = result => {
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

//Dupliqué dans traduction/lib : Node ne semble pas gérer cet export (circulaire)
const turnHTMLtoJSON = (contenu, nbMots=null) => {
  for(var i=0; i < contenu.length;i++){
    let html= contenu[i].content;
    nbMots+=(html || '').trim().split(/\s+/).length;
    let safeHTML=sanitizeHtml(html, sanitizeOptions); //Pour l'instant j'autorise tous les tags, il faudra voir plus finement ce qui peut descendre de l'éditeur et restreindre à ça
    let jsonBody=himalaya.parse(safeHTML, { ...himalaya.parseDefaults, includePositions: false })
    contenu[i].content=jsonBody;

    if( (contenu[i].children || []).length > 0){
      nbMots=turnHTMLtoJSON(contenu[i].children, nbMots)  
    }
  }
  return nbMots
}

//Dupliqué dans traduction/lib : Node ne semble pas gérer cet export (circulaire)
const turnJSONtoHTML = (contenu) => {
  if(contenu){
    for(var i=0; i < contenu.length;i++){
      if(contenu[i] && contenu[i].content && (typeof contenu[i].content === Object || typeof contenu[i].content === "object")){
        contenu[i].content = himalaya.stringify(contenu[i].content);
      }
      if( contenu[i] && contenu[i].children && contenu[i].children.length > 0){
        turnJSONtoHTML(contenu[i].children)  
      }
    }
  }
}

exports.turnToFr = turnToFr;
exports.turnHTMLtoJSON = turnHTMLtoJSON;
exports.turnJSONtoHTML = turnJSONtoHTML;