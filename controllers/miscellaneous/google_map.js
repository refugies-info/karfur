const {GOOGLE_API_KEY} = process.env;

const googleMapsClient = require('@google/maps').createClient({
  key: GOOGLE_API_KEY
});

function get_map(req, res) {
  // res.status(200).json({ "text": "Message envoyé", map: googleMapsClient });
};

exports.get_map = get_map;