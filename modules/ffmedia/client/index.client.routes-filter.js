(function () {
  'use strict';

  angular.module('ffmedia').run(routeFilter);

  function routeFilter(
    $rootScope,
    $state,
    Authentication,
    $location
  ) {
    $rootScope.$on('$stateChangeStart', stateChangeStart);
    $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeStart(event, toState, toParams, fromState, fromParams) {

      if (toState.data && toState.data.permissions && toState.data.permissions.length > 0) {
        var allowed = false;

        for (var i = 0, permissions = toState.data.permissions; i < permissions.length; i++) {
          if ((permissions[i] === 'guest') || (Authentication.user && Authentication.user.permissions && Authentication.user.permissions[permissions[i]])) {

            allowed = true;
            break;
          }
        }

        if (!allowed) {
          event.preventDefault();
          if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
            $state.transitionTo('index.guest.forbidden');
            $location.replace(); //erase the forbidden page from browser history
          } else {
            $state.go('index.guest.authentication.signin').then(function () {
              // Record previous state
              storePreviousState(toState, toParams);
            });
          }
        }
      }
    }

    function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {

      // Record previous state
      storePreviousState(fromState, fromParams);
    }

    // Store previous state
    function storePreviousState(state, params) {
      // only store this state if it shouldn't be ignored
      if (!state.data || !state.data.ignoreState) {
        $state.previous = {
          state: state,
          params: params,
          href: $state.href(state, params)
        };
      }
    }
  }

  routeFilter.$inject = [
    '$rootScope',
    '$state',
    'Authentication',
    '$location'
  ];
}());
