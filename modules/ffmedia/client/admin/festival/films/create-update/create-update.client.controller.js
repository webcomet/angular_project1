(function ($, angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.controller:AdminFestivalFilmUpdate
   * @description
   */
  angular.module('ffmedia').controller('AdminFestivalFilmUpdate', AdminFestivalFilmUpdate);

  function AdminFestivalFilmUpdate(
    $scope,
    $http,
    $stateParams,
    Upload,
    $timeout,
    $sce,
    ffmediaApi
  ){

    var vm = this;
    var INTERVAL = 1000; // 1 sec

    function setup(){
      vm.video = {};
      vm.accountId;
      vm.stateParams = $stateParams;
      // Progress bar state:
      vm.videoUploading = false;
      vm.processing = false;
      vm.processingTitle = '';
      vm.processingPct = 0;
      vm.processingCurrentEvent = 'waiting';
      vm.error = '';

      viewApi();

      loadAccountId();
      if(vm.stateParams.film_id) {
        loadFilm(vm.stateParams.film_id);
      }
    }

    function viewApi(){

      vm.uploadVideo = function(file) {
        uploadFile(file, 'video');
      };

      vm.uploadThumbnail = function(file) {
        uploadFile(file, 'thumbnail');
      };

      vm.uploadCaption = function(file) {
        uploadFile(file, 'caption');
      };

      vm.saveFilmVideo = function(video, userAction) {
        processSaveFilm(video, userAction);
      };

      vm.getTeaserPlayerLocation = function() {
        return getPlayerLocation('teaser');
      };

      vm.getFilmPlayerLocation = function() {
        return getPlayerLocation('video');
      };

      vm.createTeaser = function() {
        processCreateTeaser();
      };

      vm.removeTeaser = function() {
        processRemoveTeaser();
      };

      vm.removeVideo = function() {
        processRemoveVideo();
      };

      vm.setError = function(error) {
        vm.error = error;
      };

      vm.clearError = function() {
        vm.error = '';
      };

    }

    function getPlayerLocation(type) {
      var url = "//players.brightcove.net/"+vm.accountId+"/default_default/index.html?videoId=";
      if(type === 'teaser') {
        url += vm.video.teaserID;
      } else if(type === 'video') {
        url+= vm.video.videoID;
      }
      return $sce.trustAsResourceUrl(url);
    }

    function processSaveFilm(video, userAction) {
      ffmediaApi.film().create(video).then(function(result) {
        vm.video = result.data;
        if(userAction && vm.video._id && window.location.href.indexOf(vm.video._id) < 0) {
          location.replace(window.location.href + vm.video._id);
        }
      }, logError);
    }

    function processCreateTeaser() {
      ffmediaApi.film().createTeaser(vm.video).then(processCreateTeaserResult, logError);
    }

    function processRemoveTeaser() {
      ffmediaApi.film().removeTeaser(vm.video).then(function(result) {
        vm.video = result.data;
      }, logError);
    }

    function processRemoveVideo() {
      ffmediaApi.film().removeVideo(vm.video).then(function(result) {
        vm.video = result.data;
      }, logError);
    }

    function loadAccountId() {
      ffmediaApi.film().getAccountId().then(function(result){
        vm.accountId = result.data.accountId;
      });
    }

    function ingestFilmVideo() {
      ffmediaApi.film().ingestVideo(vm.video).then(processFilmIngestResult, logError);
    }

    function processFilmIngestResult(result) {
      if(result.data && result.data.videoID) {
        vm.video.videoID = result.data.videoID;
        setTimeout(monitorFilmIngestProcess(), 2*INTERVAL);
      } else {
        vm.setError("Failed to ingest film - no video id returned!");
      }
    }

    function monitorFilmIngestProcess() {
      ffmediaApi.film().getBrightcoveVideoObject(vm.video.videoID).then(saveVideoIngestStatusWhenComplete, logError);
    }

    function saveVideoIngestStatusWhenComplete(result) {
      if (result.data) {
        if(result.data.complete) {
          vm.video.videoIngested = true;
          vm.video.videoDuration = result.data.duration;
          if(vm.video._id) {
            processSaveFilm(vm.video);
          }
        }
        if(!vm.video.videoIngested) {
          setTimeout(monitorFilmIngestProcess(), INTERVAL);
        }
      } else {
        setTimeout(monitorFilmIngestProcess(), INTERVAL);
      }
    }

    function processCreateTeaserResult(result) {
      if (result.data) {
        vm.video.teaserS3url = result.data.teaserS3url;
        vm.video.teaserTranscodeID = result.data.teaserTranscodeID;
        startProgressBarState('waiting', 'Teaser');
        setTimeout(getTeaserProgress(vm.video.teaserTranscodeID), INTERVAL);
      }
    }

    function logError(err) {
      vm.setError(err);
      console.error(err);
    }

    function startProgressBarState(state, title) {
      vm.processingPct = 0;
      vm.processingTitle = title;
      vm.processingCurrentEvent = state;
      vm.processing = true;
    }

    function stopProgressBarState(state) {
      vm.processingPct = 100;
      vm.processingTitle = "";
      vm.processingCurrentEvent = state;
      vm.processing = false;
    }

    function getTeaserProgress(jobId) {
      ffmediaApi.film().progress(jobId).then(processTeaserProgressAndUpdateBarState, logError);
    }

    function processTeaserProgressAndUpdateBarState(result) {
      var progress = result.data;
      console.log(progress.state);
      if(progress.state === "finished") {
        stopProgressBarState(progress.state);
        ingestTeaserVideo();
      } else if(progress.state === "processing") {
        if(progress.progress > vm.processingPct)
          vm.processingPct = progress.progress;
        if(progress.outputs[0].current_event) {
          vm.processingCurrentEvent = progress.outputs[0].current_event + ' teaser';
        } else if(progress.input.current_event) {
          vm.processingCurrentEvent = progress.input.current_event + ' video for transcoding';
          //emulate progress on Downloading up to 50%:
          vm.processingPct += (50 - vm.processingPct)/50;
        }
        setTimeout(getTeaserProgress(vm.video.teaserTranscodeID), INTERVAL);
      } else if(progress.state === "waiting") {
        setTimeout(getTeaserProgress(vm.video.teaserTranscodeID), 2*INTERVAL);
      } else if(progress.state === "failed") {
        vm.processingCurrentEvent = "Failed: <input type='button' value='Reload' onClick='reloadCreateTeaserProcess()'>";
      }
    }

    function ingestTeaserVideo() {
      ffmediaApi.film().ingestTeaser(vm.video).then(saveTeaserID, logError);
    }

    function saveTeaserID(result) {
      if(result.data && result.data.teaserID) {
        vm.video.teaserID = result.data.teaserID;
        processSaveFilm(vm.video);
        setTimeout(monitorTeaserIngestProcess(), 2*INTERVAL);
      } else if(result.data && result.data.error) {
        console.log('Error: '+result.data.error);
      } else {
        console.log('Ingest Teaser call failed!');
      }
    }

    function monitorTeaserIngestProcess() {
      ffmediaApi.film().getBrightcoveVideoObject(vm.video.teaserID).then(saveTeaserIngestStatusWhenComplete, logError);
    }

    function saveTeaserIngestStatusWhenComplete(result) {
      if (result.data) {
        if(result.data.complete) {
          vm.video.teaserIngested = true;
        }
        if(!vm.video.teaserIngested) {
          setTimeout(monitorTeaserIngestProcess(), INTERVAL);
        }
      } else {
        setTimeout(monitorTeaserIngestProcess(), INTERVAL);
      }
    }

    function loadFilm(filmId) {
      ffmediaApi.film(filmId).get().then(saveFilmData, logError);
    }

    function saveFilmData(result) {
      if(result.data)
        vm.video = result.data;
        if(vm.video.videoID && !vm.video.videoIngested) {
          monitorFilmIngestProcess();
        }
        if(vm.video.teaserID && !vm.video.teaserIngested) {
          monitorTeaserIngestProcess();
        }
    }

    function uploadFile(file, type) {
      if (file) {
        file.upload = Upload.upload({
          url: '/api/s3/upload?type='+type,
          data: { file: file }
        });
        if(type==='video') {
          vm.videoUploading = true;
          startProgressBarState('uploading '+type);
          file.upload.then(uploadVideoSuccess, uploadError, uploadProgress);
        } else if(type==='thumbnail') {
          file.upload.then(uploadThumbnailSuccess, uploadError);
        } else if(type==='caption') {
          file.upload.then(uploadCaptionSuccess, uploadError);
        }
      }
    }

    function uploadVideoSuccess(response) {
      vm.video.videoS3url = response.data.url;
      vm.videoUploading = false;
      stopProgressBarState('finished');
      // Start Ingesting Video:
      ingestFilmVideo();
    }

    function uploadCaptionSuccess(response) {
      vm.video.captionS3url = response.data.url;
    }

    function uploadThumbnailSuccess(response) {
      vm.video.thumbnailS3url = response.data.url;
    }

    function uploadError(response) {
      if (response.status > 0) {
        vm.errorMsg = response.status + ': ' + response.data;
        vm.processingCurrentEvent = 'Error: '+vm.errorMsg;
      }
    }

    function uploadProgress(evt) {
      vm.processingPct = parseInt(100.0 * evt.loaded / evt.total, 10);
    }

    setup();
  }

  AdminFestivalFilmUpdate.$inject = [
    '$scope',
    '$http',
    '$stateParams',
    'Upload',
    '$timeout',
    '$sce',
    'ffmediaApi'
  ];

}(window.jQuery || window.$, window.angular));
