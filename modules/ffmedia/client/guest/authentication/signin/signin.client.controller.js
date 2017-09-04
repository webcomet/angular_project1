(function (angular) {
  'use strict';

  angular.module('ffmedia').controller('AuthenticationSigninController', AuthenticationSigninController);

  function AuthenticationSigninController(
    $scope,
    $state,
    $http,
    $location,
    Authentication,
    PasswordValidator
  ) {

    var vm = this;

    function setup() {

      vm.credentials = {
        email: 'test@test.com',
        password: 'Password!dd#33',
      };

      vm.authentication = Authentication;
      vm.signin = signin;

      // Get an eventual error defined in the URL query string:
      vm.error = $location.search().err;

      // If user is signed in then redirect back home
      if (vm.authentication.user) {
        $location.path('/');
      }
    }
    function signin(isValid) {
      vm.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      $http.post('/api/auth/signin', vm.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        vm.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'index', $state.previous.params);
      }).error(function (response) {
        vm.error = response.message;
      });
    }
    setup();
  }

  AuthenticationSigninController.$inject = ['$scope',
    '$state',
    '$http',
    '$location',
    'Authentication',
    'PasswordValidator'
  ];
}(window.angular));
