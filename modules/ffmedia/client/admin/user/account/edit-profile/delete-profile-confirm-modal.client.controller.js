(function ($, angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.controller:DeleteUserModalController
   * @description
   */
  angular.module('ffmedia').controller('DeleteUserModalController', DeleteUserModalController);

  function DeleteUserModalController($uibModalInstance, param) {
    var vmModal = this;
    vmModal.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    vmModal.accepts = function () {
      $uibModalInstance.close(true);
    };
  }

  DeleteUserModalController.$inject = ['$uibModalInstance', 'param'];
}(window.jQuery || window.$, window.angular));
