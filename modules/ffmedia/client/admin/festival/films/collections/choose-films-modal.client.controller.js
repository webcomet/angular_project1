(function ($, angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name ffmedia.controller:ChooseFilmsModalController
   * @description
   */
  angular.module('ffmedia').controller('ChooseFilmsModalController', ChooseFilmsModalController);
  
  function ChooseFilmsModalController(
    $uibModalInstance, 
    param
    ) {
    
    var vm = this;
    function setup() {
      vm.allFilms = param.allFilms;
      vm.noOfAddedFilms = param.noOfAddedFilms;
      vm.selectedFilms = [];
      vm.selectedFilm = [];
      viewApi();
    }
    function viewApi() {
      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
      vm.accepts = function () {
        $uibModalInstance.close(vm.selectedFilms);
      };
      vm.selectFilm = function (film) {
        vm.selectedFilm.push(film);
        vm.selectedFilms.push({ film: film, sort: vm.noOfAddedFilms++ });
      };
      vm.removeSelectionOfFilm = function (deselectedFilm) {
        vm.selectedFilm.splice(vm.selectedFilm.indexOf(deselectedFilm), 1);
        vm.selectedFilms.forEach(function (film, index) {
          if (film.film._id === deselectedFilm._id) {
            vm.selectedFilms.splice(index, 1);
          }
        });
      };
    }
    setup();
  }
  ChooseFilmsModalController.$inject = [
    '$uibModalInstance',
    'param'
  ];
}(window.jQuery || window.$, window.angular));
