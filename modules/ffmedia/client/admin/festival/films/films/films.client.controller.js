(function ($, angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.controller:AdminFestivalFilm
   * @description
   */
  angular.module('ffmedia').controller('AdminFestivalFilm', AdminFestivalFilm);

  function AdminFestivalFilm(
    $scope,
    $http,
    $stateParams,
    $timeout,
    ffmediaApi
  ){

    var vm = this;

    function setup(){
      vm.videoList = {};
      vm.stateParams = $stateParams;
      vm.itemsPerPage = 12;
      vm.currentPage = 1;
      vm.totalCount = 0;

      viewApi();

      processGetCount();
      processListVideo(vm.itemsPerPage, 0);
    }

    function viewApi(){

      vm.listVideo = function(limit, offset) {
        processListVideo(limit, offset);
      };

      vm.changePage = function() {
        var offset = vm.currentPage * vm.itemsPerPage;
        vm.listVideo(vm.itemsPerPage, offset);
      };

    }

    function processListVideo(limit, offset) {
      ffmediaApi.film().list(limit, offset).then(function(result) {
        vm.videoList = result.data;
      }, function(err) {
        console.error(err);
      });
    }

    function processGetCount() {
      ffmediaApi.film().count().then(function(result) {
        vm.totalCount = result.data.count;
      }, function(err) {
        console.error(err);
      });
    }

    setup();
  }
  
  AdminFestivalFilm.$inject = [
    '$scope',
    '$http',
    '$stateParams',
    '$timeout',
    'ffmediaApi'
  ];

}(window.jQuery || window.$, window.angular));
