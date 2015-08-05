'use strict';

var _ = require('lodash')
  , express = require('express')
  , fixtures = require('./fixtures')
  , app = express()
  , bodyParser = require('body-parser');

var cookieParser = require('cookie-parser')
  , session  = require('express-session')
  , passport = require('./auth');


// middleware component
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes definitions
app.get('/api/tweets', function(req, res) {
  if (!req.query.userId) {
    return res.sendStatus(400);
  }

  var tweets = _.where(fixtures.tweets, { userId: req.query.userId });
  var sortedTweets = tweets.sort(function(a, b) { return b.created - a.created; });

  res.send({ tweets: sortedTweets });
});

app.get('/api/users/:userId', function(req, res) {
  var user = _.find(fixtures.users, 'id', req.params.userId);

  if (!user) {
    return res.sendStatus(404);
  }

  res.send({ user: user });
});

app.post('/api/users', function(req, res) {
  var user = req.body.user;

  if (_.find(fixtures.users, 'id', user.id)) {
    return res.sendStatus(409);
  }

  user.followingIds = [];
  fixtures.users.push(user);

  res.sendStatus(200);
});

app.post('/api/tweets', function(req, res) {
  var shortId = require('shortid');
  var tweet = req.body.tweet;

  tweet.id = shortId.generate();
  tweet.created = Date.now() / 1000 | 0;

  fixtures.tweets.push(tweet);

  res.send({ tweet: tweet });
});

app.get('/api/tweets/:tweetId', function(req, res) {
  var tweet = _.find(fixtures.tweets, 'id', req.params.tweetId);

  if (!tweet) {
    return res.sendStatus(404);
  }

  res.send({ tweet: tweet });
});

app.delete('/api/tweets/:tweetId', function(req, res) {
  var removedTweets = _.remove(fixtures.tweets, 'id', req.params.tweetId);

  if (removedTweets.length === 0) {
    return res.sendStatus(404);
  }

  res.sendStatus(200);
});

var server = app.listen(3000, '127.0.0.1');

module.exports = server;