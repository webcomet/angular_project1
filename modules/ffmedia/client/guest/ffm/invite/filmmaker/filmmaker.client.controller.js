(function ($, angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.controller:GuestFestivalThemePreview
   * @description
   */
  angular.module('ffmedia').controller('GuestFestivalInviteFilmMaker', GuestFestivalInviteFilmMaker);

  function GuestFestivalInviteFilmMaker(
    $scope,
    $location,
    $stateParams,
    ffmediaApi,
    $state
    ) {
    var vm = this;

    function setup() {
      vm.stateParams = $stateParams;
      if (vm.stateParams.code) {
        vm.filmMakerUniqueCode = $stateParams.code;
        checkFilmmakerUniqueCode();
      }else{
        vm.error = 'Uniquecode not found.';
      }
      viewApi();
    }

    function viewApi() {
      
    }
    function checkFilmmakerUniqueCode() {
      ffmediaApi.festivals().films().invite().checkFilmmakerUniqueCode(vm.filmMakerUniqueCode).then(checkFilmmakerUniqueCodeSuccess, checkFilmmakerUniqueCodeError);
      function checkFilmmakerUniqueCodeSuccess(response) {
        vm.error = '';
        if(response.data.length){
          vm.filmMakerUniqueCodeStatus = response.data;
        }else {
          vm.error = 'Uniquecode not found.';
        }
      }
      function checkFilmmakerUniqueCodeError(err) {
        if (err.data.message) {
          vm.error = err.data.message;
        }
      }
    }
    setup();
  }

  GuestFestivalInviteFilmMaker.$inject = [
    '$scope',
    '$location',
    '$stateParams',
    'ffmediaApi',
    '$state'
  ];

}(window.jQuery || window.$, window.angular));
