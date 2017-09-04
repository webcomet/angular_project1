(function (angular) {
  'use strict';

  angular.module('ffmedia').controller('AuthenticationSignupController', AuthenticationSignupController);

  function AuthenticationSignupController(
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
      vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
      vm.signup = signup;
      vm.activeTab = 'attendee';

      // Get an eventual error defined in the URL query string:
      vm.error = $location.search().err;

      // If user is signed in then redirect back home
      if (vm.authentication.user) {
        $location.path('/');
      }
    }
    function signup(isValid) {
      vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      // For restricting new entry in festival table in case user switch to "Festival Attendee" tab after adding festival name in "Film Festival" tab.
      vm.credentials.festivalName = vm.activeTab !== 'festival' ? '' : vm.credentials.festivalName;
      $http.post('/api/auth/signup', vm.credentials).success(signupSuccess).error(signupError);
    
      function signupSuccess(response) {

        // If successful we assign the response to the global user model
        vm.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'index.guest.ftv.home', $state.previous.params);
      }
      function signupError(response) {

        vm.error = response.message;
      }
    }
    setup();
  }

  AuthenticationSignupController.$inject = [
    '$scope',
    '$state',
    '$http',
    '$location',
    'Authentication',
    'PasswordValidator'
  ];
}(window.angular));
