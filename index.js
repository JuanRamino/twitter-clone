'use strict';

var _ = require('lodash')
  , express = require('express')
  , fixtures = require('./fixtures')
  , app = express()
  , conn = require('./db');

var cookieParser = require('cookie-parser')
  , session  = require('express-session')
  , bodyParser = require('body-parser')
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

  var Tweet = conn.model('Tweet')
    , query = { userId: req.query.userId }
    , options = { sort: { created: -1 } };

  Tweet.find(query, null, options, function(err, tweets) {
    if (err) {
      return res.sendStatus(500);
    }
    var responseTweets = tweets.map(function(tweet) { return tweet.toClient(); });
    res.send({ tweets: responseTweets });
  });
});

app.get('/api/users/:userId', function(req, res) {
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

app.put('/api/users/:userId', ensureAuthentication, function(req, res) {
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

app.post('/api/users', function(req, res) {
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

app.post('/api/tweets', ensureAuthentication, function(req, res) {
  var Tweet = conn.model('Tweet')
    , tweetData = req.body.tweet;

  tweetData.created = Date.now() / 1000 | 0;
  tweetData.userId = req.user.id;

  Tweet.create(tweetData, function(err, tweet) {
    if (err) {
      return res.sendStatus(500);
    }
    res.send({ tweet: tweet.toClient() });
  });
});

app.get('/api/tweets/:tweetId', function(req, res) {
  var Tweet = conn.model('Tweet');

  Tweet.findById(req.params.tweetId, function(err, tweet) {
    if (err) {
      return res.sendStatus(500);
    }
    if (!tweet) {
      return res.sendStatus(404);
    }
    res.send({ tweet: tweet.toClient() });
  });
});

app.delete('/api/tweets/:tweetId', ensureAuthentication, function(req, res) {
  var tweet = _.find(fixtures.tweets, 'id', req.params.tweetId);

  if (!tweet) {
    return res.sendStatus(404);
  }

  if (tweet.userId !== req.user.id) {
    return res.sendStatus(403);
  }

  _.remove(fixtures.tweets, 'id', req.params.tweetId);

  res.sendStatus(200);
});

app.post('/api/auth/login', function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.sendStatus(500);
    }
    if (!user) {
      return res.sendStatus(403);
    }
    req.login(user, function(err) {
      if (err) {
        return res.sendStatus(500);
      }
      return res.send({ user: user });
    });
  })(req, res);
});

app.post('/api/auth/logout', function(req, res) {
  req.logout();
  res.sendStatus(200);
});

// middleware implementation
function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(403);
}


var config = require('./config');
var server = app.listen(config.get('server:port'), config.get('server:host'));

module.exports = server;