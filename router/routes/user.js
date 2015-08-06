'use strict';

var express = require('express')
  , router = express.Router()
  , conn = require('../../db')
  , ensureAuthentication = require('../../middleware/ensureAuthentication');

router.get('/:userId', function(req, res) {
  var User = conn.model('User');

  User.findOne({ id: req.params.userId }, function(err, user) {
    if (err) {
      return res.sendStatus(500);
    }
    if (!user) {
      return res.sendStatus(404);
    }
    res.send({ user: user });
  });
});

router.put('/:userId', ensureAuthentication, function(req, res) {
  var User = conn.model('User')
    , query = { id: req.params.userId }
    , update = { password: req.body.password };

  if (req.user.id !== req.params.userId) {
    return res.sendStatus(403);
  }

  User.findOneAndUpdate(query, update, function(err, user) {
    if (err) {
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});

router.post('/', function(req, res) {
  var user = req.body.user
  , User = conn.model('User');

  User.create(user, function(err, user) {
    if (err) {
      // 11000 === Duplicate key error
      var code = err.code === 11000 ? 409 : 500;
      return res.sendStatus(code);
    }
    req.login(user, function(err) {
      if (err) {
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  });
});

module.exports = router;