'use strict';

var nconf = require('nconf')
  , path = require('path');

// load configuration on enviroment variable
nconf.env();

var configFile = 'config-' + nconf.get('NODE_ENV') + '.json'

nconf.file(path.join(__dirname, configFile));

module.exports = nconf;