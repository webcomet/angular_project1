'use strict';

/**
 * Module dependencies
 */
var apiPolicies = require('../../api.server.policy.js');
var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();

module.exports = function (app) {
  // User Routes
  var ticketController = require('./ticket.server.controller');
  app.use(multipartyMiddleware);
  app.route('/api/festival/ticket/upload').post(apiPolicies.hasPermission('festival'), ticketController.upload);
  app.route('/api/festival/ticket').post(apiPolicies.hasPermission('festival'), ticketController.createUpdateTicket);
};
