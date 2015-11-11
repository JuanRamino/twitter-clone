'use strict';

var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , session  = require('express-session')
  , MongoStore = require('connect-mongo')(session)
  , conn = require('../db')
  , passport = require('../auth');


module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(session({
    secret: 'jf:K8295Hs$eGAuy',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: conn
    })
  }));

  app.use(passport.initialize());
  app.use(passport.session());
};