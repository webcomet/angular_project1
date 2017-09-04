'use strict';

/**
 * Module dependencies
 */
var apiPolicies = require('../api.server.policy.js');

module.exports = function (app) {
  // Theme Routes
  var themeController = require('./theme.server.controller');
  
  app.route('/api/theme/upload').post(apiPolicies.hasPermission('themes'), themeController.upload);
  app.route('/api/theme/publishTheme').post(apiPolicies.hasPermission('themes'), themeController.publishTheme);
  app.route('/api/theme/savePreviewTheme').post(apiPolicies.hasPermission('themes'), themeController.savePreviewTheme);
  app.route('/api/theme/getThemeForPreview').get(apiPolicies.hasPermission('themes'), themeController.getThemeForPreview);
  app.route('/api/theme/revertChanges').post(apiPolicies.hasPermission('themes'), themeController.revertChanges);
  app.route('/api/theme/deleteImageFromBucket').post(apiPolicies.hasPermission('themes'), themeController.deleteImageFromBucket);
  // Route for fetching active theme for guest user
  app.route('/api/theme/getActiveTheme').get(themeController.getActiveTheme);
};
