(function ($, angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.controller:GuestFestivalThemePreview
   * @description
   */
  angular.module('ffmedia').controller('GuestFestivalThemePreview', GuestFestivalThemePreview);

  function GuestFestivalThemePreview(
    $scope,
    $location,
    $stateParams,
    ffmediaApi,
    $state
    ) {
    var vm = this;

    function setup() {
      vm.theme = {};
      vm.display=true;
      vm.stateParams = $stateParams;
      if (vm.stateParams.festival_id) {
        callGetTheme(vm.stateParams.festival_id);
      }
      viewApi();
    }

    function viewApi() {
    }
    function callGetTheme(festival_id) {
      vm.theme.festivalId = festival_id;
      var array = $location.path().split("/");
      if (array[array.length - 1] === 'preview') {
        getThemeForPreview(vm.theme.festivalId);
      } else {
        getActiveTheme(vm.theme.festivalId);
      }
    }
    // function for fetching active theme for guest user
    function getActiveTheme(festivalId) {
      ffmediaApi.theme().getActiveTheme(festivalId).then(getThemeSuccess, getThemeError);
      function getThemeSuccess(result) {
        if (result.data) {
          vm.theme = result.data;
          if (vm.theme.festivalDate && vm.theme.festivalEndDate) {
            formatFestivalDate(vm.theme.festivalDate, vm.theme.festivalEndDate);
          }
        }
      }
    }
    function getThemeForPreview(festivalId) {
      ffmediaApi.theme().getThemeForPreview(festivalId).then(getThemeForPreviewSuccess, getThemeError);
      function getThemeForPreviewSuccess(result) {
        if (result.data.length > 0) {
          angular.forEach(result.data, function (theme, key) {
            vm.theme = angular.copy(theme);
            if (theme.themeType === "preview") {
              result.data = [];
            }
          });
          if (vm.theme.festivalDate && vm.theme.festivalEndDate) {
            formatFestivalDate(vm.theme.festivalDate, vm.theme.festivalEndDate);
          }
        }
      }
    }
    function getThemeError(err) {
      if (err.status === 403) {
        $state.go('index.guest.ffm.festivals.id.home');
      }
    }
    function formatFestivalDate(festivalStartDate, festivalEndDate) {
      var festEndDate = new Date(festivalEndDate);
      var festStartDate = new Date(festivalStartDate);
      var diffDays = calculateDaydiff(festStartDate, festEndDate);
      if (diffDays > 0) {
        vm.festDate = setFestivalDate(festStartDate, festEndDate);
      }
    }
    function calculateDaydiff(festStartDate, festEndDate) {
      var oneDay = 24 * 60 * 60 * 1000;// hours*minutes*seconds*milliseconds  
      var diffDays = Math.round(Math.abs((festEndDate.getTime() - festStartDate.getTime()) / (oneDay)));
      return diffDays;
    }
    function getMonthNameFromDate(dateObj) {
      return dateObj.toLocaleString("en-us", { month: "long" });
    }
    function getDateSuffix(dateObj) {
      var suffixes = ["th", "st", "nd", "rd"];
      var relevantStartDateDigits = (dateObj.getDate() < 30) ? dateObj.getDate() % 20 : dateObj.getDate() % 30;
      return (relevantStartDateDigits <= 3) ? suffixes[relevantStartDateDigits] : suffixes[0];
    }

    function setFestivalDate(festStartDate, festEndDate) {
      var startMonth = getMonthNameFromDate(festStartDate);
      var endMonth = getMonthNameFromDate(festEndDate);
      var sufStart = getDateSuffix(festStartDate);
      var sufEnd = getDateSuffix(festEndDate);
      if (festEndDate.getFullYear() === festStartDate.getFullYear()) {
        if (festEndDate.getMonth() === festStartDate.getMonth()) {
          return startMonth + ' ' + festStartDate.getDate() + ' - ' + festEndDate.getDate() + sufEnd + ', ' + festEndDate.getFullYear();
        } else {
          return startMonth + ' ' + festStartDate.getDate() + ' - ' + endMonth + ' ' + festEndDate.getDate() + sufEnd + ', ' + festEndDate.getFullYear();
        }
      } else {
        return startMonth + ' ' + festStartDate.getDate() + sufStart + ', ' + festStartDate.getFullYear() + ' - ' + endMonth + ' ' + festEndDate.getDate() + sufEnd + ', ' + festEndDate.getFullYear();
      }
    }
    setup();
  }

  GuestFestivalThemePreview.$inject = [
    '$scope',
    '$location',
    '$stateParams',
    'ffmediaApi',
    '$state'
  ];

}(window.jQuery || window.$, window.angular));
