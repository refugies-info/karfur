const rp = require('request-promise');
const $ = require('cheerio');
const parser = require('./parser');
const url = 'https://www.reseau-alpha.org/trouver-une-formation?form%5BcodePostal%5D=75&form%5BniveauLinguistiqueVise%5D=';

rp(url)
  .then(function(html){
    //success!
    console.log($('h3.formation', html))
    // const wikiUrls = [];
    // for (let i = 0; i < 45; i++) {
    //   wikiUrls.push($('h3.formation', html)[i].attribs.href);
    // }
    // return Promise.all(
    //   wikiUrls.map(function(url) {
    //     return parser('https://en.wikipedia.org' + url);
    //   })
    // );
  })
  .then(function(presidents) {
    //console.log(presidents);
  })
  .catch(function(err){
    console.log(err);
  });