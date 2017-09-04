(function ($, angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.controller:AdminFestivalFilmCollections
   * @description
   */
  angular.module('ffmedia').controller('AdminFestivalFilmCollections', AdminFestivalFilmCollections);

  function AdminFestivalFilmCollections(
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
      vm.showAddTypeButton = true;
      vm.layout = true; // if true, default layout will be displayed, if false dynamic types and collections will be displayed
      vm.editType = [];
      vm.editCollection = [];
      vm.errorMessage = [];
      vm.festivalId;
      vm.stateParams = $stateParams;
      var date = new Date();
      vm.year = date.getFullYear();
      if (vm.stateParams.festivalId) {
        vm.festivalId = vm.stateParams.festivalId;
      }
      getTypes();
      viewApi();
    }

    function viewApi() {
      vm.sortFilmsOfCollection = function (collection) {
        angular.forEach(collection.films, function (film, key) {
          collection.films[key].sort = key;
        });
        sortFilmsOfCollection(collection);
      };
      vm.dropCallback = function (event, index, item, external, type, allowedType) {
        return item;
      };
      vm.saveType = function (collectionType, action) {
        saveType(collectionType, action);
      };
      vm.saveCollection = function (collection, typeId, action) {
        collection.collectionTypeId = typeId;
        collection.layout = vm.layout;
        saveCollection(collection, action);
      };
      vm.deleteType = function (collectionType) {
        openDeleteConfirmationModal('Are you sure, you want to delete collection type?', confirmDeleteTypeCallback);
        function confirmDeleteTypeCallback(){
          deleteType(collectionType);
        }
      };
      vm.deleteCollection = function (typeId, collection) {
        openDeleteConfirmationModal('Are you sure, you want to delete collection?', confirmDeleteCollectionCallback);
        function confirmDeleteCollectionCallback(){
          deleteCollection(typeId, collection);
        }
      };
      vm.updateType = function (collectionType) {
        getTypeByID(collectionType);
      };
      vm.updateCollection = function (typeID, collection) {
        getCollectionByID(typeID, collection);
      };
      vm.getFilmsByCollectionId = function (collection) {
        vm.films = true;
        getFilmsByCollectionId(collection);
      };
      vm.removeFilmFromCollection = function (collection, film) {
        openDeleteConfirmationModal('Are you sure,you want to remove film from this collection?', confirmremoveFilmCallback);
        function confirmremoveFilmCallback() {
          var filmData = {
            collection: collection,
            films: film
          };
          removeFilmFromCollection(filmData);
        }
      };
    }
    // Modal for confirmation of delete type and collection
    function openDeleteConfirmationModal(message, callback) {
      var modalInstance = $uibModal.open({
        templateUrl: 'deleteConfirmationModal.script',
        controller: 'DeleteConfirmationModalController',
        controllerAs: 'vmModal',
        resolve: {
          param: function () {
            return message;
          }
        }
      });
      modalInstance.result.then(function deleteConfirmCallback(response) {
        if (response === true) {
          callback();
        }
      });
    }
    function openChooseFilmsModal(collection, noOfAddedFilms) {
      var modalInstance = $uibModal.open({
        templateUrl: 'chooseFilmsModal.script',
        controller: 'ChooseFilmsModalController',
        controllerAs: 'vmModal',
        resolve: {
          param: function () {
            return { 'allFilms': vm.allFilms, 'noOfAddedFilms': noOfAddedFilms };
          }
        }
      });
      modalInstance.result.then(function chooseFilmsCallback(selectedFilm) {
        addFilmsToCollection(collection, selectedFilm);
      });
    }
    function addFilmsToCollection(collection, film) {
      collection.films = film;
      if (Object.keys(collection).length) {
        collection.festivalId = vm.festivalId;
        ffmediaApi.collection().addFilmsToCollection(collection).then(addFilmsToCollectionSuccess, addFilmsToCollectionError);
      }
      function addFilmsToCollectionSuccess(result) {
        if (result.data) {
          vm.error = false;
          vm.errorMessage[collection._id] = '';
          getTypes();
        }
      }
      function addFilmsToCollectionError(err) {
        if (err.data.message) {
            vm.errorMessage[collection._id] = err.data.message;
        }
      }
    }
    function saveType(collectionType, action) {
      if (Object.keys(collectionType).length) {
        collectionType.festivalId = vm.festivalId;
        collectionType.typeSlug = removeSpecialCharactersFromString(collectionType.typeTitle);
        ffmediaApi.collection().saveType(collectionType).then(saveTypeSuccess, saveTypeError);
      }
      function saveTypeSuccess(result) {
        if (result.data) {
          vm.error = false;
          if (action === 'editType') {
            vm.editType[collectionType._id] = {};
            vm.errorMessage[collectionType._id] = '';
            collectionType.showEditTypeBlock = false;
            collectionType.disableEditTypeButton = false;
          } else if(action === 'addType'){
            vm.disableSaveTypeButton = false;
            vm.showAddTypeBlock = false;
            vm.errorMessage[action] = '';
            vm.addType = {};
            collectionType = {};
          }
          getTypes();
        }
      }
      function saveTypeError(err) {
        if (err.data.message) {
          if (action === 'editType') {
            vm.errorMessage[collectionType._id] = err.data.message;
            collectionType.disableEditTypeButton = false;
          }else if(action === 'addType'){
            vm.disableSaveTypeButton = false;
            vm.errorMessage[action] = err.data.message;
          }
        }
      }
    }
    function saveCollection(collection, action) {
      if (Object.keys(collection).length) {
        collection.festivalId = vm.festivalId;
        collection.collectionSlug = removeSpecialCharactersFromString(collection.collectionTitle);
        ffmediaApi.collection().saveCollection(collection).then(saveCollectionSuccess, saveCollectionError);
      }
      function saveCollectionSuccess(result) {
        if (result.data) {
          vm.error = false;
          if (action === 'editCollection') {
            vm.editCollection[collection._id] = {};
            collection.showEditCollectionBlock = false;
            collection.disableEditCollectionButton = false;
            vm.errorMessage[collection._id] = '';
          } else {
            vm.showAddCollectionBlock[collection.collectionTypeId] = false;
            vm.disableAddCollectionButton[collection.collectionTypeId] = false;
            vm.addCollections[collection.collectionTypeId] = {};
            vm.errorMessage['addCollection_'+collection.collectionTypeId] = '';
          }
          getTypes();
        }
      }
      function saveCollectionError(err) {
        if (err.data.message) {
          if (action === 'editCollection') {
            vm.errorMessage[collection._id] = err.data.message;
            collection.disableEditCollectionButton = false;
          } else {
            vm.disableAddCollectionButton[collection.collectionTypeId] = false;
            vm.errorMessage['addCollection_'+collection.collectionTypeId] = err.data.message;
          }
        }
      }
    }
    function sortFilmsOfCollection(collection) {
      if (Object.keys(collection).length) {
        collection.festivalId = vm.festivalId;
        ffmediaApi.collection().sortFilmsOfCollection(collection).then(sortFilmsOfCollectionSuccess, sortFilmsOfCollectionError);
      }
      function sortFilmsOfCollectionSuccess(result) {
        if (result.data) {
          vm.error = false;
          vm.errorMessage[collection._id] = '';
          getTypes();
        }
      }
      function sortFilmsOfCollectionError(err) {
        if (err.data.message) {
          vm.errorMessage[collection._id] = err.data.message;
        }
      }
    }
    function getTypes() {
      if (vm.festivalId) {
        ffmediaApi.collection().getTypes(vm.festivalId).then(getTypeSuccess, getTypeFailure);
      }
      function getTypeSuccess(result) {
        if (result.data) {
          if (result.data.length) {
            vm.types = result.data;
            vm.layout = false;
            vm.errorMessage = [];
          }
          vm.error = false;
        }
      }
      function getTypeFailure(err) {
        if (err.data.message) {
          vm.error = err.data.message;
        }
      }
    }
    function deleteType(collectionType) {
      collectionType.spinner = true;
      if (vm.festivalId) {
        ffmediaApi.collection().deleteType(vm.festivalId, collectionType._id).then(deleteTypeSuccess, deleteTypeError);
      }
      function deleteTypeSuccess(result) {
        if (result.data) {
          vm.error = false;
          collectionType.spinner = false;
          collectionType.showTypeDeleteButton = true;
          getTypes();
        }
      }
      function deleteTypeError(err){
        if (err.data.message) {
          vm.error = err.data.message;
        }
        collectionType.showTypeDeleteButton = true;
        collectionType.spinner = false;
      }
    }
    function deleteCollection(typeID, collection) {
      collection.spinner = true;
      if (vm.festivalId) {
        ffmediaApi.collection().deleteCollection(vm.festivalId, typeID, collection._id).then(deleteCollectionSuccess, deleteCollectionError);
      }
      function deleteCollectionSuccess(result) {
        if (result.data) {
          vm.error = false;
          collection.spinner = false;
          collection.showCollectionDeleteButton = true;
          getTypes();
        }
      }
      function deleteCollectionError(err){
        if (err.data.message) {
          vm.error = err.data.message;
        }
        collection.spinner = false;
        collection.showCollectionDeleteButton = true;
      }
    }
    function getTypeByID(collectionType) {
      if (vm.festivalId) {
        ffmediaApi.collection().getTypeByID(vm.festivalId, collectionType._id).then(getTypeByIDSuccess, getTypeByIDFailure);
      }
      function getTypeByIDSuccess(result) {
        if (result.data) {
          vm.editType[collectionType._id] = result.data;
          vm.error = false;
          collectionType.spinner = false;
        }
      }
      function getTypeByIDFailure(err) {
        if (err.data.message) {
          vm.error = err.data.message;
        }
        collectionType.spinner = false;
      }
    }
    function getCollectionByID(typeID, collection) {
      if (vm.festivalId) {
        ffmediaApi.collection().getCollectionByID(vm.festivalId, typeID, collection._id).then(getCollectionByIDSuccess, getCollectionByIDFailure);
      }
      function getCollectionByIDSuccess(result) {
        if (result.data) {
          vm.editCollection[collection._id] = result.data;
          collection.spinner = false;
          vm.error = false;
        }
      }
      function getCollectionByIDFailure(err) {
        if (err.data.message) {
          vm.error = err.data.message;
        }
        collection.spinner = false;
      }
    }
    function getFilmsByCollectionId(collection) {
      ffmediaApi.film().getFilmsByCollectionId(collection._id).then(getFilmsSuccess, onFailure);
      function getFilmsSuccess(result) {
        if (result.data) {
          vm.allFilms = result.data;
          openChooseFilmsModal(collection, collection.films.length);
          vm.error = false;
        }
      }
    }
    function removeFilmFromCollection(filmData) {
      ffmediaApi.collection().removeFilmFromCollection(filmData).then(onRemoveFilmSuccess, onFailure);
      function onRemoveFilmSuccess(result){
        if (result.data) {
          getTypes();
        }
      }
    }
    function onFailure(err) {
      if (err.data.message) {
        vm.error = err.data.message;
      }
    }
    function removeSpecialCharactersFromString(string){
      return string.replace(/[^a-zA-Z0-9_ ]/g, "").replace(/ /g, '_').trim();
    }
    setup();
  }

  AdminFestivalFilmCollections.$inject = [
    '$scope',
    '$window',
    '$http',
    '$uibModal',
    '$stateParams',
    '$timeout',
    'ffmediaApi'
  ];
  
}(window.jQuery || window.$, window.angular));
