'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VideoIngestHistorySchema = new Schema({
  filmID: {
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
  }
});

var TeaserIngestHistorySchema = new Schema({
  filmID: {
    type: String
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
  }
});

mongoose.model('VideoIngestHistory', VideoIngestHistorySchema);
mongoose.model('TeaserIngestHistory', TeaserIngestHistorySchema);
