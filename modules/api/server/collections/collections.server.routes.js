'use strict';

/**
 * Module dependencies
 */
var apiPolicies = require('../api.server.policy.js');

module.exports = function (app) {
  // Theme Routes
  var collectionsController = require('./collections.server.controller');
  
  app.route('/api/collection/saveCollection').post(apiPolicies.hasPermission('collections'), collectionsController.saveCollection);
  app.route('/api/collection/deleteCollection').delete(apiPolicies.hasPermission('collections'), collectionsController.deleteCollection);
  app.route('/api/collection/getCollectionById').get(apiPolicies.hasPermission('collections'), collectionsController.getCollectionById);
  app.route('/api/collection/removeFilmFromCollection').post(apiPolicies.hasPermission('collections'), collectionsController.removeFilmFromCollection);
  app.route('/api/collection/sortFilmsOfCollection').post(apiPolicies.hasPermission('collections'), collectionsController.sortFilmsOfCollection);
  app.route('/api/collection/addFilmsToCollection').post(apiPolicies.hasPermission('collections'), collectionsController.addFilmsToCollection);
  
};
