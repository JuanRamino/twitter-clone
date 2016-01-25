'use strict';

var jwt = require('jsonwebtoken')
  , secret = require('./config').get('secret');

module.exports = function(payload) {
  return jwt.sign(payload, secret, {
    expiresIn: '1d' // expires in 24 hours
  });
}