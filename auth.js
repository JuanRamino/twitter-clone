'use strict';

var _ = require('lodash')
  , passport = require('passport')
  , fixtures = require('./fixtures')
  , LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  var user = _.find(fixtures.users, 'id', id);

  if (!user) {
    return done(null, false);
  }

  done(null, user);
});

// http://passportjs.org/docs/username-password
function verify(username, password, done) {
  var user = _.find(fixtures.users, 'id', username);

  if (!user) {
    return done(null, false, { message: 'Incorrect username.' });
  }

  if (user.password !== password) {
    return done(null, false, { message: 'Incorrect password.' });
  }

  done(null, user);
}

passport.use(new LocalStrategy(verify));


module.exports = passport;