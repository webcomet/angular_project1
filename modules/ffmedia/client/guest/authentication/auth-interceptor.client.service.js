(function () {
  'use strict';

  angular.module('ffmedia').factory('authInterceptor', authInterceptor);

  function authInterceptor($q, $injector, Authentication) {
    var service = {
      responseError: responseError
    };

    return service;

    function responseError(rejection) {
      if (!rejection.config.ignoreAuthModule) {
        switch (rejection.status) {
          case 401:
            // Deauthenticate the global user
            Authentication.user = null;
            $injector.get('$state').transitionTo('authentication.signin');
            break;
          // case 403:
          //   $injector.get('$state').transitionTo('index.guest.forbidden');
          //   break;
        }
      }
      // otherwise, default behaviour
      return $q.reject(rejection);
    }
  }

  authInterceptor.$inject = ['$q', '$injector', 'Authentication'];
}());
