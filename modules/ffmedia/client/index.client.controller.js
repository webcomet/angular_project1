(function (user) {
  'use strict';

  angular.module('ffmedia').controller('IndexController', IndexController);

  function IndexController(
    $scope,
    Authentication
  ) {
    var vm = this;

    function setup() {}
    setup();
  }

  IndexController.$inject = [
    '$scope',
    'Authentication'
  ];
}(window.user));
