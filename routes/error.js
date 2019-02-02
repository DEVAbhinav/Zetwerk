"use strict";

var env = process.env.NODE_ENV || 'development';


module.exports = function (err, req, res, next) {

  var code = err.status || 500;
  var response = {
    error: err.message || err,
    stack: err.stack ? err.stack.split('\n') : ''
  };

  if (err.data) {
    response.data = err.data;
  }
  if (err.wrong_data) {
    response.wrong_data = err.wrong_data;
  }
  if (err.url) {
    response.url = err.url;
  }

  if (err.error_code) {
    response.error_code = err.error_code;
  }
  console.log('ERROR Handler: ' + err.message);

  if (code >= 500) {
    console.log(err.stack);
  }

  if (env.toLowerCase() == 'production') {
    if (code == 500) {
      response.error = 'An unexpected error has occured';
    }
    response.stack = undefined;
  }

  res.status(code).json(response);
};