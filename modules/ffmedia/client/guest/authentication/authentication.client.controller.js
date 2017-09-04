(function (angular) {
  'use strict';

  angular.module('ffmedia').controller('AuthenticationController', AuthenticationController);

  function AuthenticationController(
    $scope,
    $state,
    $http,
    $location,
    $window,
    Authentication,
    PasswordValidator
  ) {
    var vm = this;
    vm.callOauthProvider = callOauthProvider;

    // OAuth provider request
    function callOauthProvider(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }
  }

  AuthenticationController.$inject = [
    '$scope',
    '$state',
    '$http',
    '$location',
    '$window',
    'Authentication',
    'PasswordValidator'
  ];
}(window.angular));
