'use strict';

/**
 * Module dependencies
 */
var https = require('https');
var errorHandler = require('../errors.server.controller');
var s3fsController = require('../external-apis/s3.server.controller');
var mongoose = require('mongoose');
var Theme = mongoose.model('Theme');
var Festival = mongoose.model('Festival');

exports.upload = s3fsController.upload;
exports.deleteImageFromBucket = deleteImageFromBucket;
exports.publishTheme = publishTheme;
exports.savePreviewTheme = savePreviewTheme;
exports.getActiveTheme = getActiveTheme;
exports.revertChanges = revertChanges;
exports.getThemeForPreview = getThemeForPreview;

// For saving preview theme
function savePreviewTheme(req, res, next) {
  if (req.body.festivalId) {
    Theme.findOne({ festivalId: req.body.festivalId, themeType: 'preview' }, findPreviewThemeSuccess);
  } else {
    return res.status(400).send({
      message: 'Festival id is required.'
    });
  }
  function findPreviewThemeSuccess(err, theme) {
    if (err) {
      returnErrorMessageOfFindingFestival(res, err);
    } else {
      if (theme) {
        //update theme object
        theme = updateThemeObject(theme, req);
      } else {
        if (req.body._id) {
          delete req.body._id;
        }
        theme = new Theme(req.body);
      }
      theme.themeType = 'preview';
      if (theme.festivalDate && theme.festivalEndDate && theme.festivalEndDate < theme.festivalDate) {
        return res.status(400).send({
          message: 'Festival end date should not be less than festival start date.'
        });
      }
      theme.save(saveThemeCallback);

    }
    function saveThemeCallback(err, theme) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(theme);
    }
  }
}
function getActiveTheme(req, res, next){
  var festivalId = req.query.festivalId || null;
  if (festivalId === null) {
    return res.status(400).send({
      message: 'Festival id is required.'
    });
  } else {
    Theme.findOne({ festivalId: festivalId, themeType: 'active' }, findThemeSuccess);
  }
  function findThemeSuccess(err, theme) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(theme);
    }
  }
}
function getThemeForPreview(req, res, next) {
  var festivalId = req.query.festivalId || null;
  if (festivalId === null) {
    return res.status(400).send({
      message: 'Festival id is required.'
    });
  } else {
    Theme.find({ festivalId: festivalId }, function (err, theme) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(theme);
      }
    });
  }
}
// For publishing / saving new active theme
function publishTheme(req, res, next) {
  if (req.body.festivalId) {
    Theme.findOne({ festivalId: req.body.festivalId, themeType: 'active' }, findActiveThemeSuccess);
  } else {
    return res.status(400).send({
      message: 'Festival id is required.'
    });
  }
  function findActiveThemeSuccess(err, activeTheme) {
    if (err) {
      returnErrorMessageOfFindingFestival(res, err);
    } else {
      if (activeTheme) {
        //update active theme object
        activeTheme = updateThemeObject(activeTheme, req);
      } else {
        if (req.body._id) {
          delete req.body._id;
        }
        activeTheme = new Theme(req.body);
        activeTheme.themeType = 'active';
      }
      if (activeTheme.festivalDate && activeTheme.festivalEndDate && activeTheme.festivalEndDate < activeTheme.festivalDate) {
        return res.status(400).send({
          message: 'Festival end date should not be less than festival start date.'
        });
      }
      activeTheme.save(saveActiveThemeSuccess);
    }
    function saveActiveThemeSuccess(err, newActiveTheme) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // Update festival name in festival collection
        updateFestival(req.body.festivalId, req.body.festivalName, res);
        deletePreviewTheme(req.body.festivalId, function deletePreviewCallback(response){});
        res.json(newActiveTheme);
      }
    }
  }
}
function updateThemeObject(theme, req) {
  theme.banner = req.body.banner;
  theme.logo = req.body.logo;
  theme.laurel = req.body.laurel;
  theme.festivalDate = req.body.festivalDate;
  theme.festivalEndDate = req.body.festivalEndDate;
  theme.festivalName = req.body.festivalName;
  theme.festivalCity = req.body.festivalCity;
  theme.featuredCollection = req.body.featuredCollection;
  theme.about = req.body.about;
  theme.facebook = req.body.facebook;
  theme.twitter = req.body.twitter;
  theme.commenting = req.body.commenting;
  theme.updated = Date.now();
  return theme;
}
function updateFestival(festivalId, festivalName, res) {
  Festival.findById(festivalId, findFestivalSuccess);
  function findFestivalSuccess(err, festival) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      festival.festivalName = festivalName;
      festival.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
    }
  }
}
function revertChanges(req, res, next) {
  deletePreviewTheme(req.body.festivalId, deletePreviewThemeCallback);
  function deletePreviewThemeCallback(response) {
    res.json(response);
  }
}
function deleteTheme(themeObj) {
  themeObj.remove({}, function deleteThemeSuccess(err, deletedTheme) {});
}
function deletePreviewTheme(festivalId, callback) {
  Theme.findOne({ festivalId: festivalId, themeType: 'preview' }, findPreviewThemeSuccess);
  function findPreviewThemeSuccess(err, previewTheme) {
    if (!err) {
      if (previewTheme) {
        deleteTheme(previewTheme);
        return callback(previewTheme);
      }else{
        return callback(true);
      }
    } 
  }
}
// Delete old theme's banner,logo and laurel from bucket

function deleteImageFromBucket(req, res, next){
  if (req.body.imageUrl) {
    s3fsController.deleteFromBucket(req.body.imageUrl.split("/"));
  }
  res.json('');
}
function returnErrorMessageOfFindingFestival(res, err) {
  if (errorHandler.getErrorMessage(err)) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
    return res.status(400).send({
      message: 'Festival not found.'
    });
  }
}
