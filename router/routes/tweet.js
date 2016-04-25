'use strict';

var express = require('express')
  , router = express.Router()
  , conn = require('../../db')
  , ensureAuthentication = require('../../middleware/ensureAuthentication');

// get tweets
router.get('/', ensureAuthentication, function(req, res) {
  var Tweet = conn.model('Tweet')
    , stream = req.query.stream
    , userId = req.query.userId
    , options = { sort: { created: -1 } }
    , query = null;

  // tweets from users followed
  if (stream === 'home_timeline') {
    query = { userId: { $in: req.user.followingIds }};
  }
  // personal tweets
  else if (stream === 'profile_timeline' && userId) {
    query = { userId: userId };
  }
  // stream is no defined in query
  else {
    return res.sendStatus(400);
  }

  Tweet.find(query, null, options, function(err, tweets) {
    if (err) {
      return res.sendStatus(500);
    }
    var responseTweets = tweets.map(function(tweet) { return tweet.toClient(); });
    res.send({ tweets: responseTweets });
  });
});

// post a tweet
router.post('/', ensureAuthentication, function(req, res) {
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

// get single tweet
router.get('/:tweetId', function(req, res) {
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

// delete a tweet
router.delete('/:tweetId', ensureAuthentication, function(req, res) {
  var Tweet = conn.model('Tweet')
    , tweetId = req.params.tweetId
    // http://docs.mongodb.org/manual/reference/object-id/
    , ObjectId = require('mongoose').Types.ObjectId;

  if (!ObjectId.isValid(tweetId)) {
    return res.sendStatus(400);
  }

  Tweet.findById(tweetId, function(err, tweet) {
    if (err) {
      return res.sendStatus(500);
    }

    if (!tweet) {
      return res.sendStatus(404);
    }

    if (tweet.userId !== req.user.id) {
      return res.sendStatus(403);
    }

    Tweet.findByIdAndRemove(tweet._id, function(err) {
      if (err) {
        return res.sendStatus(500);
      }
      res.send({});
    });
  });
});

module.exports = router;
