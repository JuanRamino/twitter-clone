var _ = require('lodash')
  , express = require('express')
  , fixtures = require('./fixtures')
  , app = express();


app.get('/api/tweets', function(req, res) {
  if (!req.query.userId) {
    return res.sendStatus(400);
  }

  var tweets = _.where(fixtures.tweets, { userId: req.query.userId });
  var sortedTweets = tweets.sort(function(a, b) { return b.created - a.created });

  res.send({ tweets: sortedTweets });
});

app.get('/api/users/:userId', function(req, res) {
  var user = _.find(fixtures.users, 'id', req.params.userId);

  if (!user) {
    return res.sendStatus(404);
  }

  res.send({ user: user });
});

var server = app.listen(3000, '127.0.0.1');

module.exports = server;