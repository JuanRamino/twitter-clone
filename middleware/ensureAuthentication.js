'use strict';

var jwt = require('jsonwebtoken')
    , secret = require('../config').get('secret');

module.exports = function(req, res, next) {
  // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, secret, function(err, decoded) {          
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });      
            } else {
                // if everything is good, save to request for use in other routes
                req.user = decoded;
                next();
            }
        });
    
    } else {
        // if there is no token
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.'
        });
    }
};