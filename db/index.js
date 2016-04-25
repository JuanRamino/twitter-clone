'use strict';

var mongoose = require('mongoose')
  , config = require('../config')
  , userSchema = require('./schemas/user')
  , tweetSchema = require('./schemas/tweet');

var host = config.get('database:host')
  , port = config.get('database:port')
  , name = config.get('database:name');

var connection = mongoose.createConnection(host, name, port);

// inject models to connection
connection.model('User', userSchema);
connection.model('Tweet', tweetSchema);

// CLOSE CONNECTION
function exit() {
  connection.close(function() {
    process.exit(0);
  });
};

process.on('SIGINT', exit).on('SIGTERM', exit);

module.exports = connection;