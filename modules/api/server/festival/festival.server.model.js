'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Festival Schema
 */
var FestivalSchema = new Schema({
  festivalName: {
    type: String,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Festival', FestivalSchema);
