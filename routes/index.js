var employee = require('./Employee');
var error = require('./error');
var statusCheck = require('./statusCheck');



module.exports = function mainIndexMapper(app) {
  employee(app);
  //status Check
  app.get('/status', statusCheck);
}