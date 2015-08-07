'use strict';

var Schema = require('mongoose').Schema
  , bcrypt = require('bcrypt')
  , _ = require('lodash');

var userSchema = new Schema(
  { id: { type: String, unique: true }
  , name: String
  , email: { type: String, unique: true }
  , password: String
  , followingIds: { type: [String], default: [] }
  }
);

userSchema.pre('save', function(next) {
  var _this = this;

  // https://github.com/ncb000gt/node.bcrypt.js/
  bcrypt.hash(this.password, 10, function(err, passwordHash) {
    if (err) {
      return next(err);
    }
    _this.password = passwordHash;
    next();
  });
});

userSchema.methods.toClient = function() {
  return _.pick(this, ['id', 'name']);
};

userSchema.methods.follow = function(userId, done) {
  // http://docs.mongodb.org/manual/reference/operator/update/addToSet/
  var update = { $addToSet: { followingIds: userId } };
  this.model('User').findByIdAndUpdate(this._id, update, done);
};

userSchema.statics.findByUserId = function(id, done) {
  this.findOne({ id: id }, done);
};

module.exports = userSchema;