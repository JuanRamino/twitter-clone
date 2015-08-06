'use strict';

var _ = require('lodash')
  , passport = require('passport')
  , fixtures = require('./fixtures')
  , LocalStrategy = require('passport-local').Strategy
  , conn = require('./db');


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  conn.model('User').findOne({ id: id }, done);
});

// http://passportjs.org/docs/username-password
function verify(username, password, done) {
  var User = conn.model('User');

  User.findOne({ id: username }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}

passport.use(new LocalStrategy(verify));


module.exports = passport;