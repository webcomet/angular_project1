'use strict';

/**
 * Module dependencies
 */

module.exports = function (app) {
  // User Routes
  var auth = require('./auth.server.controller');

  // Setting up the users authentication api
  app.route('/api/auth/signout').get(auth.signout);
  app.route('/api/auth/signup').post(auth.signup);
  app.route('/api/auth/signin').post(auth.signin);
};
