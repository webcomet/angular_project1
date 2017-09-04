'use strict';

/**
 * Module dependencies
 */
var path = require('path');
var mongoose = require('mongoose');
var errorHandler = require('../errors.server.controller');
var Film = mongoose.model('Film');
var Collections = mongoose.model('Collections');
var brightcove = require('../external-apis/brightcove.server.controller');
var history = require('../films/history.server.controller');

exports.getFilm = getFilm;
exports.getFilmsCount = getFilmsCount;
exports.listFilms = listFilms;
exports.createUpdateFilm = createUpdateFilm;
exports.removeFullVideo = removeFullVideo;
exports.removeTeaser = removeTeaser;
exports.getFilmsByCollectionId = getFilmsByCollectionId;

function getFilm(req, res, next) {
  var filmId = req.query.id;
  Film.findOne({ _id: filmId })
    .exec(function(err, film) {
      if (err)
        console.error(err);
      res.json(film);
    });
}

function getFilmsCount(req, res, next) {
  var userId = req.user._id.toString();
  Film.count({ createdBy: userId })
    .exec(function(err, count) {
      if(err)
        console.error(err);
      res.json({ 'count': count });
    });
}

function listFilms(req, res, next) {
  var limit = req.query.limit || 10;
  var offset = req.query.offset || 0;
  limit = parseInt(limit, 10);
  offset = parseInt(offset, 10);
  var userId = req.user._id.toString();
  Film.find({ createdBy: userId })
    .limit(limit)
    .skip(offset)
    .sort({ 'title': 'asc' })
    .exec(function(err, result) {
      if(err)
        console.error(err);
      res.json(result);
    });
}

function createUpdateFilm(req, res, next) {
  if(req.body._id) { //Update:
    var updateId = req.body._id;
    Film.findById(updateId, function(err, foundObj) {
      if (err) console.error(err);
      var film = updateFilmObject(foundObj, req);
      // Check if Video is ingested if it wasn't before
      if (film && film.videoID && !film.videoIngested) {
        brightcove.getBrightcoveVideoObject(film.videoID, function (brightcoveObject) {
          if (brightcoveObject.complete) {
            console.log("Mark film video " + film.videoID + " as ingested");
            film.videoIngested = true;
            film.videoDuration = brightcoveObject.duration;
          }
        });
      }
      // Check if Teaser is ingested if it wasn't before
      if (film && film.teaserID && !film.teaserIngested) {
        brightcove.getBrightcoveVideoObject(film.teaserID, function (brightcoveObject) {
          if (brightcoveObject.complete) {
            console.log("Mark film teaser " + film.teaserID + " as ingested");
            film.teaserIngested = true;
          }
        });
      }
      // Save Film:
      film.save(logError);
      onFilmUpdateHistory(film);
      res.json(film);
    });
  } else { // Create:
    var film = createFilmObject(req);
    film.save(logError);
    onFilmUpdateHistory(film);
    res.json(film);
  }
}

function onFilmUpdateHistory(film) {
  if(film.videoS3url)
    history.saveVideoHistory(film);
  if(film.teaserS3url)
    history.saveTeaserHistory(film);
}

function removeFullVideo(req, res, next) {
  if(req.body._id) { //Film Id
    var updateId = req.body._id;
    Film.findById(updateId, function(err, film) {
      if (err) console.error(err);
      film.videoID = '';
      film.videoDuration = '';
      film.videoS3url = '';
      film.videoIngested = false;
      film.save(logError);
      res.json(film);
    });
  } else {
    res.json({ 'error': 'Film not found for id '+req.body._id });
  }
}

function removeTeaser(req, res, next) {
  if(req.body._id) { //Film Id
    var updateId = req.body._id;
    Film.findById(updateId, function(err, film) {
      if (err) console.error(err);
      film.teaserID = '';
      film.teaserIngested = false;
      film.teaserTranscodeID = '';
      film.teaserS3url = '';
      film.teaserStartTime = '';
      film.teaserLength = '';
      film.save(logError);
      res.json(film);
    });
  } else {
    res.json({ 'error': 'Film not found for id '+req.body._id });
  }
}

function logError(err) {
  if (err) console.error(err);
}

function createFilmObject(req) {
  var film = new Film();
  film.created = Date.now();
  film.createdBy = req.user._id.toString();
  setFilmRequestValues(film, req);
  return film;
}

function updateFilmObject(film, req) {
  film.updated = Date.now();
  film.updatedBy = req.user._id.toString();
  setFilmRequestValues(film, req);
  return film;
}

function setFilmRequestValues(film, req) {
  film.title = req.body.title;
  film.videoID = req.body.videoID;
  film.videoS3url = (req.body.videoS3url) ? req.body.videoS3url : film.videoS3url;
  film.videoDuration = (req.body.videoDuration) ? req.body.videoDuration : film.videoDuration;
  film.videoIngested = (req.body.videoIngested) ? req.body.videoIngested : film.videoIngested;
  film.teaserID = (req.body.teaserID) ? req.body.teaserID : film.teaserID;
  film.teaserTranscodeID = (req.body.teaserTranscodeID) ? req.body.teaserTranscodeID : film.teaserTranscodeID;
  film.teaserS3url = (req.body.teaserS3url) ? req.body.teaserS3url : film.teaserS3url;
  film.teaserIngested = (req.body.teaserIngested) ? req.body.teaserIngested : film.teaserIngested;
  film.thumbnailS3url = (req.body.thumbnailS3url) ? req.body.thumbnailS3url : film.thumbnailS3url;
  film.captionS3url = (req.body.captionS3url) ? req.body.captionS3url : film.captionS3url;
  film.teaserStartTime = (req.body.teaserStartTime) ? req.body.teaserStartTime : film.teaserStartTime;
  film.teaserLength = (req.body.teaserLength) ? req.body.teaserLength : film.teaserLength;
  film.featureNarrative = (req.body.featureNarrative) ? req.body.featureNarrative : film.featureNarrative;
  film.synopsis = (req.body.synopsis) ? req.body.synopsis : film.synopsis;
  film.cast = (req.body.cast) ? req.body.cast : film.cast;
  film.director = (req.body.director) ? req.body.director : film.director;
  film.writer = (req.body.writer) ? req.body.writer : film.writer;
  film.producer = (req.body.producer) ? req.body.producer : film.producer;
  film.editor = (req.body.editor) ? req.body.editor : film.editor;
  film.cinematographer = (req.body.cinematographer) ? req.body.cinematographer : film.cinematographer;
  film.checkFestival = (req.body.checkFestival) ? req.body.checkFestival : film.checkFestival;
  film.checkAllowComments = (req.body.checkAllowComments) ? req.body.checkAllowComments : film.checkAllowComments;
  film.checkForPurchase = (req.body.checkForPurchase) ? req.body.checkForPurchase : film.checkForPurchase;
}
function getFilmsByCollectionId(req, res, next){
  var collectionId = req.query.collectionId;
  Collections.findById(collectionId, findCollectionCallback);
  function findCollectionCallback(err, collection) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var filmObj = collection.films;
      var filmArray = [];
      filmObj.forEach(function (film, index, arr) {
        filmArray.push(film.film);
      });
      Film.find({ _id: { $nin: filmArray } }).sort({ 'title': 'desc' }).exec(findFilmsCallback);
    }
    function findFilmsCallback(err, films) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(films);
    }
  }
}
