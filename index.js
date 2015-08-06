'use strict';

var express = require('express')
  , app = express()
  , config = require('./config');

var ensureAuthentication = require('./middleware/ensureAuthentication');

require('./middleware')(app);
require('./router')(app);

var server = app.listen(config.get('server:port'), config.get('server:host'));

module.exports = server;