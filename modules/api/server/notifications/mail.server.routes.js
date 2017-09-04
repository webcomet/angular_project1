'use strict';

/**
 * Module dependencies
 */
var apiPolicies = require('../api.server.policy.js');

module.exports = function (app) {
  // User Routes
  var mailController = require('./mail.server.controller');

  // Setting up the users authentication api
  app.route('/api/notifications/welcome').get(apiPolicies.hasPermission('notifications'), mailController.welcome);
  app.route('/api/notifications/welcomeFilmmaker').get(apiPolicies.hasPermission('notifications'), mailController.welcomeFilmmaker);
};
