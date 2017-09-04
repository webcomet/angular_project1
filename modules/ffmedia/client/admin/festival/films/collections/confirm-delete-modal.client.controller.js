(function ($, angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.controller:DeleteConfirmationModalController
   * @description
   */
  angular.module('ffmedia').controller('DeleteConfirmationModalController', DeleteConfirmationModalController);
  
  function DeleteConfirmationModalController(
    $uibModalInstance, 
    param
    ) {
    
    var vm = this;
    function setup() {
      vm.message = param;
      viewApi();
    }
    function viewApi() {
      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
      vm.accepts = function () {
        $uibModalInstance.close(true);
      };
    }
    setup();
  }

  DeleteConfirmationModalController.$inject = [
    '$uibModalInstance', 
    'param'
  ];
}(window.jQuery || window.$, window.angular));
