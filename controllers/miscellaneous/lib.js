var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keysN57gau1jfGZpG'}).base('appmqAQ7oVFKOEY6s');

function set_mail(req, res) {
  if (!req.body.mail) {
    res.status(400).json({ "text": "Requête invalide" })
  } else {
    const mail = req.body.mail;
    console.log(mail)
    base('Mailing liste Agi\'r').create([{ fields: {"Mail": mail} }], function(err, records) {
      if (err) {console.error(err);res.status(500).json({"text": "Erreur interne"}); return;}
      res.status(200).json({
        "text": "Succès",
        "data": records
      }) 
    });
  }
}

exports.set_mail = set_mail;