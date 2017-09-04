'use strict';

var mongoose = require('mongoose');
var VideoIngestHistory = mongoose.model('VideoIngestHistory');
var TeaserIngestHistory = mongoose.model('TeaserIngestHistory');

// Video History related methods:
exports.createVideoHistory = createVideoHistory;
exports.saveVideoHistory = saveVideoHistory;
// Teaser History related methods:
exports.createTeaserHistory = createTeaserHistory;
exports.saveTeaserHistory = saveTeaserHistory;

function getVideoHistory(videoUrl) {
  VideoIngestHistory.findOne({ videoS3url: videoUrl })
    .exec(function(err, item) {
      if (err)
        console.error(err);
      return item;
    });
}

function createVideoHistory(videoUrl, videoID) {
  var item = new VideoIngestHistory();
  item.videoS3url = videoUrl;
  item.videoID = videoID;
  item.save(logError);
}

function saveVideoHistory(film) {
  VideoIngestHistory.findOne({ videoS3url: film.videoS3url })
    .exec(function(err, item) {
      if (err)
        console.error(err);
      if(item) { // Item found:
        var changes = 0;
        if (!item.filmID && film._id) {
          item.filmID = film._id;
          changes++;
        }
        if (!item.videoID && film.videoID) {
          item.videoID = film.videoID;
          changes++;
        }
        if (!item.videoIngested && film.videoIngested) {
          item.videoIngested = film.videoIngested;
          changes++;
        }
        if (changes > 0) {
          item.save(logError);
        }
      } else { // Nothing found - create new:
        item = new VideoIngestHistory();
        item.videoS3url = film.videoS3url;
        item.filmID = film._id;
        item.videoID = film.videoID;
        item.videoDuration = film.videoDuration;
        item.videoIngested = film.videoIngested;
        item.save(logError);
      }
    });
}

function createTeaserHistory(teaserUrl, teaserTranscodeID) {
  var item = new TeaserIngestHistory();
  item.teaserS3url = teaserUrl;
  item.teaserTranscodeID = teaserTranscodeID;
  item.save(logError);
}

function saveTeaserHistory(film) {
  TeaserIngestHistory.findOne({ teaserS3url: film.teaserS3url })
    .exec(function(err, item) {
      if (err)
        console.error(err);
      if(item) { // Item found:
        var changes = 0;
        if (!item.filmID && film._id) {
          item.filmID = film._id;
          changes++;
        }
        if (!item.teaserID && film.teaserID) {
          item.teaserID = film.teaserID;
          changes++;
        }
        if (!item.teaserTranscodeID && film.teaserTranscodeID) {
          item.teaserTranscodeID = film.teaserTranscodeID;
          changes++;
        }
        if (!item.teaserIngested && film.teaserIngested) {
          item.teaserIngested = film.teaserIngested;
          changes++;
        }
        if (changes > 0) {
          item.save(logError);
        }
      } else { // Item not found - create new:
        item = new TeaserIngestHistory();
        item.filmID = film._id;
        item.teaserID = film.teaserID;
        item.teaserS3url = film.teaserS3url;
        item.teaserTranscodeID = film.teaserTranscodeID;
        item.teaserIngested = film.teaserIngested;
        item.save(logError);
      }
    });
}

function logError(err) {
  if (err) console.error(err);
}
