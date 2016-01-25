'use strict';

var express = require('express')
  , router = express.Router()
  , conn = require('../../db')
  , jwt    = require('jsonwebtoken')
  , bcrypt = require('bcrypt')
  , _ = require('lodash')
  , auth = require('../../auth');

router.post('/login', function(req, res) {
  
  var User = conn.model('User');
  User.findOne({ id: req.body.username }, function(err, user) {
    
    if (err) {
      return res.sendStatus(500);
    } 
    // no user
    if (!user) {
      return res.json({ success: false, message: 'Authentication failed. User not found.' });
    }

    bcrypt.compare(req.body.password, user.password, function(err, matched) {
      if (err) {
        return res.sendStatus(500);
      }
      // password didn't match
      if (!matched) {
        return res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      }

      var payload = _.omit(user.toJSON(), 'password' );
      var token = auth(payload);
      
      return res.json({
        token: token
      });
    });
  });
});

module.exports = router;