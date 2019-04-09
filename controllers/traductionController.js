const traduction = require('./traduction/lib.js');
const checkToken = require('./account/checkToken');

module.exports = function (app) {
  app.post('/add_tradForReview', checkToken.getId, traduction.add_tradForReview);
  app.post('/get_tradForReview', checkToken.check, traduction.get_tradForReview);
  app.post('/validate_tradForReview', checkToken.check, traduction.validate_tradForReview);
  app.post('/get_progression', checkToken.check, traduction.get_progression);
}