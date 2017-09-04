'use strict';

/**
 * Module dependencies
 */
var path = require('path');
var apiPolicies = require(path.resolve('./modules/api/server/api.server.policy.js'));

module.exports = function (app) {
  // Theme Routes
  var inviteFilmMakerController = require('./inviteFilmmaker.server.controller');
  
  app.route('/api/invite/create').post(apiPolicies.hasPermission('invite'), inviteFilmMakerController.createNewInvite);
  app.route('/api/invite/reinvite').post(apiPolicies.hasPermission('invite'), inviteFilmMakerController.reInviteFilmmaker);
  app.route('/api/invite/invite').post(apiPolicies.hasPermission('invite'), inviteFilmMakerController.inviteAllFilmmaker);
  app.route('/api/invite/delete').delete(apiPolicies.hasPermission('invite'), inviteFilmMakerController.deleteSentInvite);
  app.route('/api/invite/').get(apiPolicies.hasPermission('invite'), inviteFilmMakerController.getInvitedFilmmakers);
  app.route('/api/invite/check').get(inviteFilmMakerController.checkFilmmakerUniqueCode);
};
