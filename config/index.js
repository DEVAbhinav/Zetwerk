'use strict'

var mongoURI = require('./mongoURI');
var env = process.env.NODE_ENV || 'development';
var config = {
    mongo: mongoURI[env]
}
module.exports = config;