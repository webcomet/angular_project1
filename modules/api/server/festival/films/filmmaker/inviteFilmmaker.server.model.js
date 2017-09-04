'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        validator = require('validator');

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (inviteEmail) {
  return (validator.isEmail(inviteEmail, { require_tld: true }));
};
/**
 * CollectionTypes schema
 */

var inviteFilmmakerSchema = new Schema({
  filmTitle: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  inviteEmail: {
    type: String,
    required: 'Email id required.',
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    lowercase: true,
    trim: true,
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address.']
  },
  lastInvitedDate: {
    type: Date
  },
  uniqueCode: {
    type: String
  },
  invited: {
    type: Boolean,
    default: true
  },
  festivalId: {
    type: Schema.ObjectId,
    ref: 'Festival'
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  }
});

mongoose.model('InviteFilmmaker', inviteFilmmakerSchema);
