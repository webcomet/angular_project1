'use strict';

/**
 * Module dependencies
 */
 var apiPolicies = require('../api.server.policy.js');

module.exports = function (app) {
  // User Routes
  var userController = require('./users.server.controller');

  // Setting up the users authentication api
  app.route('/api/user/:userId/profile').put(apiPolicies.hasPermission('profile'), userController.put);
  app.route('/api/user/:userId/festivals').get(apiPolicies.hasPermission('festival'), userController.getFestivalByUserId);
};
