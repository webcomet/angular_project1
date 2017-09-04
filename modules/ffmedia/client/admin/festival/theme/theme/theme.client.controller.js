(function ($, angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.controller:AdminFestivalThemeUpdate
   * @description
   */
  angular.module('ffmedia').controller('AdminFestivalThemeUpdate', AdminFestivalThemeUpdate);

  function AdminFestivalThemeUpdate(
    $scope,
    $stateParams,
    Upload,
    $uibModal,
    $timeout,
    ffmediaApi,
    $state
  ){

    var vm = this;

    function setup() {
      vm.theme = {};
      vm.uploading = {
        'laurel': false,
        'logo': false,
        'banner': false
      };
      vm.error;
      vm.activeTheme;
      vm.previewTheme;
      vm.showPreviewButton = true;
      vm.spinner = false;
      vm.stateParams = $stateParams;
      if (vm.stateParams.festivalId) {
        vm.theme.festivalId = vm.stateParams.festivalId;
        getThemeForPreview(vm.theme.festivalId);
      }
      vm.collection = [
        "1", "2", "3"
      ];
      vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      vm.format = vm.formats[0];
      vm.altInputFormats = ['M!/d!/yyyy'];
      vm.datePicker = {
        opened: false,
        openedEnd: false
      };
      viewApi();
    }

    function viewApi() {
      vm.openDatePicker = function () {
        vm.datePicker.opened = true;
      };
      vm.openEndDatePicker = function () {
        vm.datePicker.openedEnd = true;
      };
      vm.changeCollection = function (name) {
        vm.theme.featuredCollection = name;
      };
      vm.uploadBanner = function (file, type) {
        vm.showPreviewButton = false;
        vm.showSavePreviewButton = false;
        vm.showPublishButton = false;
        uploadFile(file, 'thumbnail', type);
      };
      vm.savePreviewTheme = function (themeData) {
        vm.showPreviewButton = false;
        vm.spinner = true;
        savePreviewTheme(themeData);
        vm.themeForm.$setPristine();
      };
      vm.publishTheme = function (themeData) {
        vm.showPublishButton = false;
        vm.spinner = true;
        publishTheme(themeData);
        vm.themeForm.$setPristine();
      };
      vm.revertChanges = function () {
        revertChanges();
      };
      vm.setSavePreviewButtonVisibility= function (visible) {
        if(visible){
          vm.showSavePreviewButton = false;
          vm.showPreviewButton = false;
          vm.showPublishButton = false;
          vm.themeForm.$dirty = false;
        }else{
          vm.showSavePreviewButton = true;
          vm.themeForm.$dirty = true;
        }
      };
    }

    // Private Functions
    function uploadFile(file, type, imgType) {
      if (file) {
        file.upload = Upload.upload({ url: '/api/theme/upload?type=' + type, data: { file: file } });
        if (imgType === 'banner') {
          if (vm.theme.banner) {
            vm.oldImage = vm.theme.banner;
          }
          vm.uploading.banner = true;
          file.upload.then(uploadBannerSuccess, uploadBannerError);
        } else if (imgType === 'logo') {
          if (vm.theme.banner) {
            vm.oldImage = vm.theme.logo;
          }
          vm.uploading.logo = true;
          file.upload.then(uploadLogoSuccess, uploadLogoError);
        } else if (imgType === 'laurel') {
          if (vm.theme.banner) {
            vm.oldImage = vm.theme.laurel;
          }
          vm.uploading.laurel = true;
          file.upload.then(uploadLaurelSuccess, uploadLaurelError);
        }
      }else {
        vm.showSavePreviewButton = true;
      }
      function uploadLaurelSuccess(response) {
        vm.theme.laurel = response.data.url;
        vm.uploading.laurel = false;
        setButtonVisibilityToTrue();
        //@TODO For deleting old image from bucket #142
        //if(vm.oldImage){
        // ffmediaApi.theme().deleteImageFromBucket({ 'imageUrl':vm.oldImage }).then(deleteImageSuccess, onError);
        //}
      }
      function uploadBannerSuccess(response) {
        vm.theme.banner = response.data.url;
        vm.uploading.banner = false;
        setButtonVisibilityToTrue();
        //@TODO For deleting old image from bucket #142
        //  if(vm.oldImage){
        //    ffmediaApi.theme().deleteImageFromBucket({ 'imageUrl':vm.oldImage }).then(deleteImageSuccess, onError);
        //  }
      }
      function uploadLogoSuccess(response) {
        vm.theme.logo = response.data.url;
        vm.uploading.logo = false;
        setButtonVisibilityToTrue();
        //@TODO For deleting old image from bucket #142
        //if(vm.oldImage){
        //  ffmediaApi.theme().deleteImageFromBucket({ 'imageUrl':vm.oldImage }).then(deleteImageSuccess, onError);
        //}
      }
      function uploadBannerError(response) {
        vm.showPreviewButton = true;
        if (response.status > 0) {
          vm.bannerErrorMsg = response.status + ': ' + response.data.message;
          vm.uploading.banner = false;
          vm.showRevertButton = true;
        }
      }
      function uploadLogoError(response) {
        vm.showPreviewButton = true;
        if (response.status > 0) {
          vm.logoErrorMsg = response.status + ': ' + response.data.message;
          vm.uploading.logo = false;
          vm.showRevertButton = true;
        }
      }
      function uploadLaurelError(response) {
        vm.showPreviewButton = true;
        if (response.status > 0) {
          vm.laurelErrorMsg = response.status + ': ' + response.data.message;
          vm.uploading.laurel = false;
          vm.showRevertButton = true;
        }
      }
      //@TODO #142
      //function deleteImageSuccess(response){
      //  vm.oldImage='';
      //}
    }
    function setButtonVisibilityToTrue() {
      vm.showSavePreviewButton = true;
      vm.showRevertButton = true;
    }
    function getThemeForPreview(festivalId) {
      ffmediaApi.theme().getThemeForPreview(festivalId).then(getThemeForPreviewSuccess, onError);
      function getThemeForPreviewSuccess(result) {
        if (result.data.length > 0) {
          angular.forEach(result.data, function (theme, key) {
            vm.theme = angular.copy(theme);
            if (theme.themeType === "preview") {
              vm.showPublishButton = true;
              vm.showRevertButton = true;
              result.data = [];
            }
          });
        } else {
          vm.theme = {};
          vm.theme.festivalId = vm.stateParams.festivalId;
        }
      }
    }
    function savePreviewTheme(themeData) {
      if (Object.keys(themeData).length) {
        ffmediaApi.theme().savePreviewTheme(themeData).then(savePreviewThemeSuccess, savePreviewThemeError);
      }
      function savePreviewThemeSuccess(result) {
        if (result.data) {
          vm.error = false;
          vm.spinner = false;
          vm.showPreviewButton = true;
          vm.showPublishButton = true;
          vm.showSavePreviewButton = false;
          vm.showRevertButton = true;
        }
      }
      function savePreviewThemeError(err) {
        if (err.data.message) {
          vm.error = err.data.message;
          vm.showPreviewButton = false;
          vm.showSavePreviewButton = false;
          vm.showPublishButton = false;
          vm.showRevertButton = true;
          vm.spinner = false;
        }
      }
    }
    function publishTheme(themeData) {
      if (Object.keys(themeData).length) {
        ffmediaApi.theme().publishTheme(themeData).then(publishThemeSuccess, publishThemeError);
      }
      function publishThemeSuccess(result) {
        if (result.data) {
          vm.themeData = result.data;
          vm.error = false;
          vm.showPublishButton = false;
          vm.showRevertButton = false;
          vm.spinner = false;
        }
      }
      function publishThemeError(err) {
        if (err.data.message) {
          vm.showRevertButton = true;
          vm.showPreviewButton = false;
          vm.showPublishButton = false;
          vm.spinner = false;
          vm.error = err.data.message;
        }
      }
    }
    function revertChanges() {
      vm.themeForm.$setPristine();
      vm.showPublishButton = false;
      vm.showPreviewButton = true;
      vm.showSavePreviewButton = false;
      vm.showRevertButton = false;
      vm.logoErrorMsg = false;
      vm.bannerErrorMsg = false;
      vm.laurelErrorMsg = false;
      vm.error = false;
      ffmediaApi.theme().revertChanges({ 'festivalId': vm.theme.festivalId }).then(revertChangesSuccess, onError);
      function revertChangesSuccess(result) {
        if (result.data) {
          getThemeForPreview(vm.theme.festivalId);
        } else {
          vm.theme = {};
          vm.theme.festivalId = vm.stateParams.festivalId;
        }
      }
    }
    function onError(err) {
      if (err.data.message) {
        vm.error = err.data.message;
      }
    }
    setup();
  }

  AdminFestivalThemeUpdate.$inject = [
    '$scope',
    '$stateParams',
    'Upload',
    '$uibModal',
    '$timeout',
    'ffmediaApi',
    '$state'
  ];

}(window.jQuery || window.$, window.angular));
