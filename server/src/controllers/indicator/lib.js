
function get_indicator(req, res) {
  if (!req.body || !req.body.q) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    res.status(200)
  }
}

function post_indicator(req, res) {
  if (!req.body || !req.body.q) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    res.status(200)
  }
}

//On exporte notre fonction
exports.get_indicator = get_indicator;
exports.post_indicator = post_indicator;
