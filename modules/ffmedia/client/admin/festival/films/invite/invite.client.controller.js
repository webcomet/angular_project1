(function ($, angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.controller:AdminFestivalFilmInviteFilmMaker
   * @description
   */
  angular.module('ffmedia').controller('AdminFestivalFilmInviteFilmMaker', AdminFestivalFilmInviteFilmMaker);

  function AdminFestivalFilmInviteFilmMaker(
    $scope,
    $window,
    $http,
    $uibModal,
    $stateParams,
    $timeout,
    ffmediaApi
    ) {

    var vm = this;
    function setup() {
      vm.stateParams = $stateParams;
      if (vm.stateParams.festivalId) {
        vm.festivalId = vm.stateParams.festivalId;
        getInvitedFilmmakers();
      }
      vm.inviteAllSpinner = false;
      vm.inviteCheckedSpinner = false;
      vm.reInviteAllspinner = false;
      vm.reInviteCheckedspinner = false;
      vm.inviteFilmMaker = {};
      vm.newInviteFilmMaker =[];
      vm.invitedFilmMakers = {};
      vm.bulkInvite = [];
      vm.bulkReInvite = [];
      viewApi();
    }

    function viewApi() {
      
      vm.addNewInvite = function(){
        vm.newInviteFilmMaker.push({ filmTitle: '', inviteEmail: '', firstName: '', lastName: '', tempId: generateRandomNumber(), editMode: true });
      };
      vm.deleteSentInvite = function(filmmaker){
        deleteSentInvite(filmmaker);
      };
      vm.createNewInvite = function (inviteFilmmakerData) {
        createNewInvite(inviteFilmmakerData);
      };
      vm.inviteAllFilmmaker = function (csvContents) {
        vm.bulkInvite = {};
        vm.inviteAllSpinner = true;
        inviteAllFilmmaker(csvContents);
      };
      vm.inviteCheckedFilmmaker = function (csvContents) {
        vm.inviteCheckedSpinner = true;
        inviteAllFilmmaker(csvContents);
      };
      vm.setImportFilmMaker = function (response) {
        
        setImportFilmMaker(response);
      };
      vm.reInviteFilmMaker = function (filmMakerData) {
        reInviteFilmMaker(filmMakerData);
      };
      vm.bulkInviteFilmMakerList = function (filmMaker) {
        bulkInviteFilmMakerList(filmMaker);
      };
      vm.bulkReInviteFilmMakerList = function (filmMaker) {
        bulkReInviteFilmMakerList(filmMaker);
      };
    }
    function generateRandomNumber(){
      var N = 4;
      return Array(N + 1).join((Math.random().toString(36) + '00000000000000000').slice(2, 18)).slice(0, N);
    }
    function deleteSentInvite(filmmaker){
      if (Object.keys(filmmaker).length) {
        filmmaker.removeSpinner = true;
        filmmaker.festivalId = vm.festivalId;
        ffmediaApi.festivals().films().invite().deleteSentInvite(filmmaker).then(deleteSentInviteSuccess, deleteSentInviteError);
      }
      function deleteSentInviteSuccess(response){
        vm.error = '';
        getInvitedFilmmakers();
      }
      function deleteSentInviteError(err){
        if (err.data.message) {
          vm.error = err.data.message;
          filmmaker.removeSpinner = false;
        }
      }
    }
    function setImportFilmMaker(response) {
      if (response.error) {
        vm.error = response.data;
      } else {
        var csvContents = response.data;
        vm.bulkInvite = [];
        angular.forEach(csvContents, function (filmMaker, index) {
          angular.forEach(Object.keys(filmMaker), function (key, index) {
            var newKey = key.replace(/_([a-z])/g, function (g) {
              return g[1].toUpperCase();
            });
            filmMaker[newKey] = filmMaker[key];
          });
          filmMaker.editMode = false;
          filmMaker.tempId = generateRandomNumber();
          vm.newInviteFilmMaker.push(filmMaker);
        });
      }
    }
    function createNewInvite(inviteFilmMakerData) {
      if (Object.keys(inviteFilmMakerData).length) {
        inviteFilmMakerData.spinner = true;
        inviteFilmMakerData.festivalId = vm.festivalId;
        ffmediaApi.festivals().films().invite().createNewInvite(inviteFilmMakerData).then(createNewInviteSuccess, createNewInviteError);
      }
      function createNewInviteSuccess(response) {
        inviteFilmMakerData.spinner = false;
        vm.error = '';
        if (response.data) {
          vm.inviteFilmMaker = {};
          if (vm.newInviteFilmMaker.length) {
            var index = vm.newInviteFilmMaker.findIndex(function (filmMaker) {
              return filmMaker.tempId === inviteFilmMakerData.tempId;
            });
            index !== -1 ? vm.newInviteFilmMaker.splice(index, 1) : '';
          }
          getInvitedFilmmakers();
        }
      }
      function createNewInviteError(err) {
        if (err.data.message) {
          vm.inviteFilmMaker = {};
          inviteFilmMakerData.spinner = false;
          vm.error = err.data.message;
          getInvitedFilmmakers();
        }
      }
    }
    
    function bulkInviteFilmMakerList(checkedFilmMaker) {
      var index = vm.bulkInvite.findIndex(function(filmMaker) { 
       return filmMaker.tempId === checkedFilmMaker.tempId; 
      });
      index !== -1 ? vm.bulkInvite.splice(index, 1) : vm.bulkInvite.push(checkedFilmMaker);
    }
    
    function getInvitedFilmmakers() {
      ffmediaApi.festivals().films().invite().getInvitedFilmmakers(vm.festivalId).then(getInvitedFilmmakersSuccess, getInvitedFilmmakersError);
      function getInvitedFilmmakersSuccess(response) {
        if (response.data) {
          vm.invitedFilmMakers = response.data;
          vm.bulkReInvite = [];
          vm.invitedFilmMakers.length ? angular.copy(vm.invitedFilmMakers, vm.bulkReInvite) : '';
        }
      }
      function getInvitedFilmmakersError(err) {
        if (err.data.message) {
          vm.error = err.data.message;
        }
      }
    }
    
    function inviteAllFilmmaker(filmmakers) {
      if (filmmakers) {
        angular.forEach(filmmakers, function (value) {
          value.festivalId = vm.stateParams.festivalId;
        });
        ffmediaApi.festivals().films().invite().inviteAllFilmmaker(filmmakers).then(inviteAllFilmmakerSuccess, inviteAllFilmmakerError);
        vm.newInviteFilmMaker = vm.newInviteFilmMaker.filter(function (i1) {
          return !vm.bulkInvite.some(function (i2) {
            return i1.tempId === i2.tempId;
          });
        });
      }
      function inviteAllFilmmakerSuccess(response) {
        vm.error = '';
        vm.inviteAllSpinner = false;
        vm.newInviteFilmMaker = {};
        vm.inviteCheckedSpinner = false;
        getInvitedFilmmakers();
      }
      function inviteAllFilmmakerError(err) {
        if (err.data.message) {
          vm.error = err.data.message;
          vm.inviteAllSpinner = false;
          vm.inviteCheckedSpinner = false;
          getInvitedFilmmakers();
        }
      }
    }
    
    function reInviteFilmMaker(allFilmMakerData) {
      ffmediaApi.festivals().films().invite().reInviteFilmmaker(allFilmMakerData).then(reInviteFilmMakerSuccess, reInviteFilmMakerError);
      function reInviteFilmMakerSuccess(response) {
        vm.reInviteAllspinner = false;
        vm.reInviteCheckedspinner = false;
        if(allFilmMakerData.spinner){
          allFilmMakerData.spinner = false;
        }
        vm.error = '';
        getInvitedFilmmakers();
      }
      function reInviteFilmMakerError(err) {
        if (err.data.message) {
          vm.reInviteAllspinner = false;
          vm.reInviteCheckedspinner = false;
          vm.error = err.data.message;
          if (allFilmMakerData.spinner) {
            allFilmMakerData.spinner = false;
          }
        }
      }
    }
    
    function bulkReInviteFilmMakerList(checkedFilmMaker) {
      var index = vm.bulkReInvite.findIndex(function(filmMaker) { 
       return filmMaker._id === checkedFilmMaker._id; 
      });
      index !== -1 ? vm.bulkReInvite.splice(index, 1) : vm.bulkReInvite.push(checkedFilmMaker);
    }
    setup();
  }

  AdminFestivalFilmInviteFilmMaker.$inject = [
    '$scope',
    '$window',
    '$http',
    '$uibModal',
    '$stateParams',
    '$timeout',
    'ffmediaApi'
  ];

}(window.jQuery || window.$, window.angular));
