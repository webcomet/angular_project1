(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.directive:errorMessage
   * @description
   */
  angular.module('ffmedia').directive("errorMessage", ErrorMessage);
  function ErrorMessage() {
    return {
      restrict: "E",
      replace: true,
      scope: {
        'messages': '='
      },
      template: '<div>' +
              '<div ng-if="messages.length > 0">' +
              '<div class="alert alert-danger" ng-if="message" ng-repeat="message in messages">' +
              '<strong>{{message}}</strong> ' +
              '</div>' +
              '</div>' +
              '</div>'
    };
  }
}());
