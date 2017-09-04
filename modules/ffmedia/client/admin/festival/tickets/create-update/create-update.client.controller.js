(function ($, angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.controller:AdminFestivalTicketUpdate
   * @description
   */
  angular.module('ffmedia').controller('AdminFestivalTicketUpdate', AdminFestivalTicketUpdate);

  function AdminFestivalTicketUpdate(
    $scope,
    $stateParams,
    Upload,
    $uibModal,
    $timeout,
    ffmediaApi,
    $state
  ){

    var vm = this;

    function setup(){
      vm.ticket = {};
      vm.uploading = {
        'thumbnail': false
      };
      vm.processing = false;
      vm.types = [
        'VIP', 'All Access', 'Subscription'
      ];
      vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      vm.format = vm.formats[0];
      vm.startDatePicker = {
        opened: false
      };
      vm.endDatePicker = {
        opened: false
      };

      viewApi();
    }

    function viewApi() {
      vm.openStartDatePicker = function () {
        vm.startDatePicker.opened = true;
      };
      vm.openEndDatePicker = function () {
        vm.endDatePicker.opened = true;
      };
      vm.uploadThumbnail = function (file, imgType) {
        uploadFile(file, 'thumbnail', imgType);
      };
      vm.changeType = function (type) {
        vm.ticket.ticketType = type;
      };
      vm.saveTicket = function (ticketData) {
        console.log(ticketData);
        saveTicket(ticketData);
      };

    }

    function saveTicket(ticketData) {
      if (Object.keys(ticketData).length) {
        ffmediaApi.ticket().saveTicket(ticketData).then(saveTicketSuccess, saveTicketError);
      }
      function saveTicketSuccess(result) {
        if (result.data) {
          vm.error = false;
        }
      }
      function saveTicketError(err) {
        if (err.data.message) {
          vm.error = err.data.message;
        }
      }
    }
    function uploadFile(file, type, imgType) {
      if (file) {
        file.upload = Upload.upload({
          url: '/api/festival/ticket/upload?type='+type,
          data: { file: file }
        });
        if (imgType === 'ticket-thumbnail') {
          if (vm.ticket.thumbnail) {
            vm.oldImage = vm.ticket.thumbnail;
          }
          vm.uploading.thumbnail = true;
          vm.processing = true;
          file.upload.then(uploadThumbnailSuccess, uploadThumbnailError);
        }
      }
      function uploadThumbnailSuccess(response) {
        vm.ticket.thumbnail = response.data.url;
        console.log(vm.ticket.thumbnail);
        vm.uploading.thumbnail = false;
        vm.processing = false;
        //@TODO For deleting old image from bucket #142
        //  if(vm.oldImage){
        //    ffmediaApi.theme().deleteImageFromBucket({ 'imageUrl':vm.oldImage }).then(deleteImageSuccess, onError);
        //  }

      }
      function uploadThumbnailError(response) {
        console.log(response);
        if (response.status > 0) {
          vm.bannerErrorMsg = response.status + ': ' + response.data.message;
          vm.uploading.thumbnail = false;
          vm.processing = false;
          vm.showRevertButton = true;
        }
      }
      //@TODO #142
      //function deleteImageSuccess(response){
      //  vm.oldImage='';
      //}
    }
    setup();
  }

  AdminFestivalTicketUpdate.$inject = [
    '$scope',
    '$stateParams',
    'Upload',
    '$uibModal',
    '$timeout',
    'ffmediaApi',
    '$state'
  ];

  }(window.jQuery || window.$, window.angular));
