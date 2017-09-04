(function ($, angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.controller:AdminInternalMediaController
   * @description
   */
  angular.module('ffmedia').controller('AdminInternalMediaController', AdminInternalMediaController);
  
  function AdminInternalMediaController(
    $scope
    ){

    var vm = this;
    function setup() {

      vm.festivals = {
        festivalLists: { "fullList": [], "selectedList": [] }
      };

      // Generate initial model - To be replaced be eventual query from database
      for (var i = 1; i <= 10; ++i) {
        vm.festivals.festivalLists.fullList.push({ title: "Napa Valley Film Festival", location: "NAPA VALLEY, CA", time: 'Dec 16 - 18, 2016', img: '/modules/ffmedia/client/assets/img/napa-valley.jpg' });
      }
      // Generate initial model - To be replaced be eventual query from database
      for (var n = 1; n <= 3; ++n) {
        vm.festivals.festivalLists.selectedList.push({ title: "Napa Valley Film Festival", location: "NAPA VALLEY, CA", time: 'Dec 16 - 18, 2016', img: '/modules/ffmedia/client/assets/img/napa-valley.jpg' });
      }

    }

    /* TODO - Add UI options for drag and drop functionality to add/remove/order lists */

    /* TODO - Add UI options for double click to add/remove festivals from list */

    setup();
  }
  
  AdminInternalMediaController.$inject = [
    '$scope'
  ];

}(window.jQuery || window.$, window.angular));
