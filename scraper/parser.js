const rp = require('request-promise');
const cheerio = require('cheerio');

const parser = function(url) {
  return rp(url)
    .then(function(html) {
      let $ = cheerio.load(html, {
        normalizeWhitespace: true,
        decodeEntities: false
      });
      return {
        typeAction: $('div.row.premiere-partie h3.titre-fa', html).html(),
        titre: $('.entete .titre-element strong', html).html(),
        structure: $('.entete .row .col-lg-12 a.red-alpha.underline', html).html(),
        typeCours: $('.entete .row .col-lg-12 div:nth-child(4)', html).html(),
        derniereModif: $('.entete .row .col-lg-12 div:nth-child(5)', html).html(),
        placesDispo: $('.entete .row .col-lg-12 div:nth-child(6)', html).html(),
        objectif: $('.container .row .col-lg-6.col-sm-12:nth-child(1) .row:nth-child(1)', html).html(),
        public: $('.container .row .col-lg-6.col-sm-12:nth-child(1) .row:nth-child(2)', html).html(),
        conditions: $('.container .row .col-lg-6.col-sm-12:nth-child(2) .row:nth-child(1)', html).html(),
        inscription: $('.container .row .col-lg-6.col-sm-12:nth-child(2) .row:nth-child(2)', html).html(),
        contact: $('.container .row .col-lg-6.col-sm-12:nth-child(2) .row:nth-child(3)', html).html(),
        lieu: $('.container .row .col-lg-6.col-sm-12:nth-child(2) .row:nth-child(4)', html).html(),
      };
    })
    .catch(function(err) {
      console.log(err)
    });
};

module.exports = parser;