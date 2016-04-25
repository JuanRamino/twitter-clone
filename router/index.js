'use strict';

module.exports = function(app) {
  app.use('/api/users', require('./routes/user'));
  app.use('/api/tweets', require('./routes/tweet'));
  app.use('/api/auth', require('./routes/auth'));
  
  // last route respond with 404 to unmanaged routes
  app.use(function(req, res){
    res.send(404);
  });
};