'use strict';

/**
 * Module dependencies
 */
var apiPolicies = require('../api.server.policy.js');
var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();

module.exports = function (app) {
  // User Routes
  var filmsController = require('./films.server.controller');
  var s3Controller = require('./../external-apis/s3.server.controller.js');
  var brightcoveController = require('./../external-apis/brightcove.server.controller.js');
  var zencoderController = require('./../external-apis/zencoder.server.controller.js');
  // Use Multiparty Middleware for files upload
  app.use(multipartyMiddleware);
  // Films method calls:
  app.route('/api/films/get').get(filmsController.getFilm);
  app.route('/api/films/count').get(apiPolicies.hasPermission('videos'), filmsController.getFilmsCount);
  app.route('/api/films/list').get(apiPolicies.hasPermission('videos'), filmsController.listFilms);
  app.route('/api/films/create').post(apiPolicies.hasPermission('videos'), filmsController.createUpdateFilm);
  app.route('/api/films/video').delete(apiPolicies.hasPermission('videos'), filmsController.removeFullVideo);
  app.route('/api/films/teaser').delete(apiPolicies.hasPermission('videos'), filmsController.removeTeaser);
  // External API method calls:
  app.route('/api/s3/upload').post(apiPolicies.hasPermission('videos'), s3Controller.upload);
  app.route('/api/brightcove/accountid').get(apiPolicies.hasPermission('videos'), brightcoveController.getAccountId);
  app.route('/api/brightcove/ingest/video').post(apiPolicies.hasPermission('videos'), brightcoveController.ingestVideo);
  app.route('/api/brightcove/ingest/teaser').post(apiPolicies.hasPermission('videos'), brightcoveController.ingestTeaser);
  app.route('/api/brightcove/video').get(apiPolicies.hasPermission('videos'), brightcoveController.getVideoObject);
  app.route('/api/zencoder/createteaser').post(apiPolicies.hasPermission('videos'), zencoderController.createTeaser);
  app.route('/api/zencoder/progress').get(apiPolicies.hasPermission('videos'), zencoderController.getProgress);
  app.route('/api/films/getFilmsByCollectionId').get(apiPolicies.hasPermission('festival'), filmsController.getFilmsByCollectionId);
};
