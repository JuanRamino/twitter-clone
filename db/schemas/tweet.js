'use strict';

var Schema = require('mongoose').Schema
  , _ = require('lodash');

var tweetSchema = new Schema(
  { userId: String
  , created: Number
  , text: String
  }
);

// tweet.toClient()
tweetSchema.methods.toClient = function() {
  var tweet = _.pick(this, ['userId', 'created', 'text']);
  tweet.id = this._id;

  return tweet;
};

module.exports = tweetSchema;