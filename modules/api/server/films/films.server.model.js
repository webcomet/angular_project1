'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validator = require('validator');
var apiPolicies = require('../api.server.policy.js');

/**
 * Films schema
 */
var FilmSchema = new Schema({
  title: {
    type: String
  },
  videoID: {
    type: String
  },
  videoS3url: {
    type: String
  },
  videoDuration: {
    type: Number
  },
  videoIngested: {
    type: Boolean,
    default: false
  },
  teaserID: {
    type: String
  },
  teaserTranscodeID: {
    type: String
  },
  teaserS3url: {
    type: String
  },
  teaserIngested: {
    type: Boolean,
    default: false
  },
  thumbnailS3url: {
    type: String
  },
  captionS3url: {
    type: String
  },
  teaserStartTime: {
    type: Number
  },
  teaserLength: {
    type: Number
  },
  featureNarrative: {
    type: String
  },
  synopsis: {
    type: String
  },
  cast: {
    type: String
  },
  director: {
    type: String
  },
  writer: {
    type: String
  },
  producer: {
    type: String
  },
  editor: {
    type: String
  },
  cinematographer: {
    type: String
  },
  checkFestival: {
    type: Boolean
  },
  checkAllowComments: {
    type: Boolean
  },
  checkForPurchase: {
    type: Boolean
  },
  created: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String
  },
  updated: {
    type: Date
  },
  updatedBy: {
    type: String
  }
});

mongoose.model('Film', FilmSchema);
