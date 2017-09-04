'use strict';

var validator = require('validator');

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      _id: validator.escape(req.user._id.toString()),
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      created: req.user.created.toString(),
      roles: req.user.roles,
      permissions: req.user.permissions,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      facebook: validator.escape(req.user.facebook),
      twitter: validator.escape(req.user.twitter),
      imdb: validator.escape(req.user.imdb),
      additionalProvidersData: req.user.additionalProvidersData,
      profileImageURL: req.user.profileImageURL,
    };
  }

  res.render('modules/ffmedia/server/index', {
    user: safeUserObject,
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/ffmedia/server/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/ffmedia/server/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
