'use strict';

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , conn = require('./db')
  , bcrypt = require('bcrypt');


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
    bcrypt.compare(password, user.password, function(err, matched) {
      if (err) {
        return done(err);
      }
      matched ? done(null, user)
              : done(null, false, { message: 'Incorrect password.' });
    });
  });
}

passport.use(new LocalStrategy(verify));

module.exports = passport;