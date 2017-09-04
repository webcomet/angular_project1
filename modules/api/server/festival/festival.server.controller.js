'use strict';

/**
 * Module dependencies
 */
var path = require('path');
var mongoose = require('mongoose');
var errorHandler = require('../errors.server.controller');
var festival = mongoose.model('Festival');

exports.getFestival = getFestival;

function getFestival(festivalId, callback) {
  if (festivalId) {
    festival.findOne({ _id: festivalId }, findFestivalCallback);
  } else {
    return callback({ error: true, data: 'Festival id required.' });
  }
  function findFestivalCallback(err, festival) {
    if (err) {
      return callback({ error: true, data: err });
    } else {
      return callback({ error: false, data: festival });
    }
  }
}
