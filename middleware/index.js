'use strict';

var bodyParser = require('body-parser')
  , morgan = require('morgan')
  , nconf = require('nconf')
  , cors = require('cors');


module.exports = function(app) {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  
  if ( nconf.get('NODE_ENV') == 'test' ) {
    app.use(morgan('dev'));
  }
};