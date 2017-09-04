'use strict';

module.exports = function (app) {
  // Root routing
  var indexController = require('./index.server.controller');

  // Define error pages
  app.route('/server-error').get(indexController.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(indexController.renderNotFound);

  // Define application route
  app.route('/*').get(indexController.renderIndex);
};
