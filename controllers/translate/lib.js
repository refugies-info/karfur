const {Translate} = require('@google-cloud/translate');
const projectId = 'traduction-1551702821050';

const translate = new Translate({
  projectId: projectId,
});

//A mettre en place d'abord:
//export GOOGLE_APPLICATION_CREDENTIALS="/Users/tonyparker/Documents/github/karfur/config/Traduction-1edb23e00f9a-serviceAccount.json" 
function get_translation(req, res) {
  console.log(req.body);
  if (!req.body || !req.body.q) {
    res.status(400).json({
        "text": "Requête invalide"
    })
  } else {
    var q = req.body.q;
    var target = req.body.target;
    console.log(q);

    translate
    .translate(q, target)
    .then(results => {
      const translation = results[0];

      console.log(`Text: ${q}`);
      console.log(`Translation: ${translation}`);
      res.send(translation);
    })
    .catch(err => {
      console.error('ERROR:', err);
      res.status(500).json({"text": "Erreur interne","err": err})
    });
  }
}

//On exporte notre fonction
exports.get_translation = get_translation;