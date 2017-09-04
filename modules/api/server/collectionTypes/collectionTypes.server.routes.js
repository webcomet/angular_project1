'use strict';

/**
 * Module dependencies
 */
var apiPolicies = require('../api.server.policy.js');

module.exports = function (app) {
  // Theme Routes
  var collectionTypesController = require('./collectionTypes.server.controller');

  app.route('/api/collectionTypes/save').post(apiPolicies.hasPermission('collections'), collectionTypesController.saveType);
  app.route('/api/collectionTypes/getTypes').get(apiPolicies.hasPermission('collections'), collectionTypesController.getTypes);
  app.route('/api/collectionTypes/deleteType').delete(apiPolicies.hasPermission('collections'), collectionTypesController.deleteType);
  app.route('/api/collectionTypes/getTypeById').get(apiPolicies.hasPermission('collections'), collectionTypesController.getTypeById);
};
