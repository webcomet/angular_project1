'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = function () {

  acl.addRoleParents('admin', ['account_manager', 'festival_admin', 'filmmaker', 'subscriber']);
  acl.addRoleParents('account_manager', ['festival_admin', 'filmmaker', 'subscriber']);
  acl.addRoleParents('festival_admin', ['subscriber']);
  acl.addRoleParents('filmmaker', ['subscriber']);

  acl.allow([
    {
      roles: ['subscriber'],
      allows: [
        {
          resources: ['profile'],
          permissions: ['put'],
        },
        {
          resources: ['purchases', 'payment_options'],
          permissions: ['*'],
        },
      ],
    },
    {
      roles: ['filmmaker'],
      allows: [
        {
          resources: ['themes', 'collections', 'videos', 'packages', 'news', 'support', 'subscriptions', 'festival', 'notifications', 'submissions', 'subscribers'],
          permissions: ['*']
        }
      ]
    },
    {
      roles: ['festival_admin'],
      allows: [
        {
          resources: ['themes', 'collections', 'videos', 'packages', 'news', 'support', 'subscriptions', 'festival', 'notifications', 'submissions', 'subscribers', 'invite'],
          permissions: ['*']
        }
      ]
    },
    {
      roles: ['account_manager'],
      allows: [
        {
          resources: ['festivals', 'filmmaker'],
          permissions: ['*'],
        },
      ],
    },
  ]);
};

exports.whatResources = function(roles) {

  return new Promise(whatResourcesPromise);

  function whatResourcesPromise(whatResourcesResolve, whatResourcesReject) {

    if (!roles) {
      whatResourcesResolve({});
    }

    acl.whatResources(roles).then(aclWhatResourcesSuccess, aclWhatResourcesError);

    function aclWhatResourcesSuccess(response) {

      whatResourcesResolve(response);
    }
    function aclWhatResourcesError(response) {}
  }
};

exports.hasPermission = function(resource) {

  return function(req, res, next){

    var method = req.method.toLowerCase();

    if (!req.user || !req.user.permissions[resource]) {
      return res.status(403).json({
        message: 'User is not authorized'
      });
    }

    var foundPermission = false;
    req.user.permissions[resource].forEach(function(permission){

      if (permission === "*" || permission === method) {
        foundPermission = true;
      }
    });

    if (!foundPermission) {
      return res.status(403).json({
        message: 'User is not authorized'
      });
    }

    next();
  };
};

/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
