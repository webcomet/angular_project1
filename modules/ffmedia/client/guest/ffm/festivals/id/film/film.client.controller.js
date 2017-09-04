(function ($, angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.controller:GuestFestivalFilm
   * @description
   */
  angular.module('ffmedia').controller('GuestFestivalFilm', GuestFestivalFilm);

  function GuestFestivalFilm(
    $scope,
    $http,
    $stateParams,
    $timeout,
    $uibModal,
    $sce,
    ffmediaApi
  ){

    var vm = this;

    function setup() {
      vm.video = {};
      vm.accountId;
      vm.brightcoveVideoObject = {};
      vm.brightcoveTeaserObject = {};
      vm.filmPlayerModal;
      vm.stateParams = $stateParams;
      vm.reloadCount = 0;

      viewApi();
      loadAccountId();
      vm.getVideo(vm.stateParams.festival_id, vm.stateParams.film_id);
    }

    function logError(err) {
      console.error(err);
    }

    function viewApi() {

      vm.getVideo = function(festID, filmID) {
        ffmediaApi.film(filmID).get().then(loadBrightcoveVideoObject, logError);
      };

      vm.getBrightcoveVideoObject = function(vid) {
        ffmediaApi.film().getBrightcoveVideoObject(vid).then(function(result) {
          vm.brightcoveVideoObject = result.data;
        }, logError);
      };

      vm.getBrightcoveTeaserObject = function(vid) {
        ffmediaApi.film().getBrightcoveVideoObject(vid).then(function(result) {
          vm.brightcoveTeaserObject = result.data;
        }, logError);
      };

      vm.getVideoDuration = function() {
        if(vm.video.videoDuration) {
          return calculateDuration(vm.video.videoDuration);
        } else if(vm.brightcoveVideoObject.duration) {
          return calculateDuration(vm.brightcoveVideoObject.duration);
        } else {
          return "";
        }
      };

      vm.getFilmPlayerLocation = function() {
        var url = "//players.brightcove.net/"+vm.accountId+"/default_default/index.html?videoId="+vm.video.videoID;
        console.log("video url: "+url);
        return $sce.trustAsResourceUrl(url);
      };

      vm.getTeaserPlayerLocation = function() {
        var url = "//players.brightcove.net/"+vm.accountId+"/default_default/index.html?videoId="+vm.video.teaserID;
        console.log("teaser url: "+url);
        return $sce.trustAsResourceUrl(url);
      };

      vm.openFilmPlayer = function() {
        vm.filmPlayerModal = openModalDialog();
      };

      vm.close = function () {
        vm.filmPlayerModal.dismiss('cancel');
      };

    }

    function loadAccountId() {
      ffmediaApi.film().getAccountId().then(function(result){
        vm.accountId = result.data.accountId;
      });
    }

    function openModalDialog() {
      return $uibModal.open({
        animation: true,
        ariaLabelledBy: 'film-modal-title',
        ariaDescribedBy: 'film-modal-body',
        templateUrl: 'FilmPlayerModal.html',
        controller: 'GuestFestivalFilm',
        controllerAs: 'vm',
        size: 'lg'
      });
    }

    function loadBrightcoveVideoObject(result) {
      vm.video = result.data;
      if(vm.video.videoID) {
        vm.getBrightcoveVideoObject(vm.video.videoID);
      }
      if(vm.video.teaserID) {
        vm.getBrightcoveTeaserObject(vm.video.teaserID);
      }
    }

    function calculateDuration(ms) {
      var secs = ms / 1000;
      if (secs > 60) {
        var mins = secs / 60;
        if (mins > 60) {
          var hrs = mins / 60;
          return hrs + " hrs";
        } else {
          return mins + " minutes";
        }
      } else {
        return secs + " seconds";
      }
    }

    setup();
  }


  GuestFestivalFilm.$inject = [
    '$scope',
    '$http',
    '$stateParams',
    '$timeout',
    '$uibModal',
    '$sce',
    'ffmediaApi'
  ];

}(window.jQuery || window.$, window.angular));
