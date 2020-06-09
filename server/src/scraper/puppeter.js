const puppeteer = require('puppeteer');
const $ = require('cheerio');
const parser = require('./parser');
var fs = require('fs');
const url = 'https://www.reseau-alpha.org/trouver-une-formation?form%5Btexte%5D%5B%5D=Fran%C3%A7ais+%C3%A0+vis%C3%A9e+d%E2%80%99autonomie+sociale+et+communicative&form%5Btexte%5D%5B%5D=Fran%C3%A7ais+%C3%A0+vis%C3%A9e+professionnelle&form%5Btexte%5D%5B%5D=Lutte+contre+l%E2%80%99illettrisme+%2F+Remise+%C3%A0+niveau&form%5BcodePostal%5D=&form%5BniveauLinguistiqueVise%5D=';

puppeteer
  .launch({headless: false}) //, args: ['--proxy-server=https=62.210.251.74:3128']
  .then(function(browser) {
    console.log(1)
    return browser.newPage();
  })
  .then(function(page) {
    page.setViewport({width:1200,height:1200})
    return page.goto(url, {waitUntil: 'networkidle0'}).then(function() {
      console.log(3)
      return page.content();
    });
  })
  .then(function(html) {
    console.log(4)
    //console.log($('h3.formation', html).text());
    let nbElem=$('#div-accordion-formation h3.formation:not(.hidden)', html).length;
    let nbDiv=$('#div-accordion-formation .contact-content a.readon', html).length;
    let urls = [];
    if(nbElem === nbDiv){
      console.log('entrant')
      $('#div-accordion-formation h3.formation:not(.hidden)', html).each(function(i, elem) {
        let span=$(this).find('span').text();
        let small=$(this).find('small').text();
        let link=$('#div-accordion-formation .contact-content a.readon', html)[i].attribs.href;
        urls.push({span:span,small:small,link:link});
        console.log(i)
      })
      console.log('sortant')

      return Promise.all(
        urls.map(function(item, i) {
          // setTimeout( function(){ 
          //   console.log(item.span)
            return parser(item.link);
          // }, 500*i)
        })
      );
    }else{
      return 'pas le même nombre d\'éléments';
    }
  })
  .then(function(cours) {
    console.log(5);
    fs.writeFile(__dirname + '/scrapedData3.json', JSON.stringify(cours, null, 2), 'utf8',()=>{console.log('ok json')});
  })
  .catch(function(err) {
    console.log(err)
  });