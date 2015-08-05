var mongoose = require('mongoose')
  , config = require('../config');

var connection = mongoose.createConnection(
    config.get('database:host')
  , config.get('database:name')
  , config.get('database:port'));


module.exports = connection;