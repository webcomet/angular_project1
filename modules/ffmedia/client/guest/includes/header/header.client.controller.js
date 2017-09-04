(function () {
  'use strict';

  angular.module('ffmedia').controller('HeaderController', HeaderController);

  function HeaderController(
    $scope,
    $state,
    $window,
    $q,
    Authentication,
    ffmediaApi
  ) {
    var vm = this;
    var unregisterListener;

    function setup() {

      vm.authentication = Authentication;
      vm.isCollapsed = false;
      vm.signout = signout;
      vm.showMenu = false;
      closeMenuOnStateChange();
    }
    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }
    function signout() {

      ffmediaApi.auth().signout().then(signoutSuccess);

      function signoutSuccess() {
        
        $window.location.reload();
      }
    }
    function closeMenuOnStateChange() {

      unregisterListener = $scope.$on('$stateChangeSuccess', stateChangeSuccess);
      $scope.$on('$destroy', unregisterListener);
    }


    setup();
  }

  HeaderController.$inject = [
    '$scope',
    '$state',
    '$window',
    '$q',
    'Authentication',
    'ffmediaApi'
  ];
}());
