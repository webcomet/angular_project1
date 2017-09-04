(function ($, angular) {
'use strict';

/**
 * @ngdoc function
 * @name ffmedia.controller:AdminMenuController
 * @description
 */
angular.module('ffmedia').controller('AdminMenuController', AdminMenuController);

function AdminMenuController(
	$state,
	Authentication,
  $http,
  ffmediaApi
) {

	var vmMenu = this;

	function setup() {

		vmMenu.state = $state;
		vmMenu.user = Authentication.user;
    vmMenu.festivals = {};
    vmMenu.showMenu = false;
    getFestivals();
		
    viewApi();
	}
	function viewApi() {}
  function getFestivals() {
    var promise = ffmediaApi.user(vmMenu.user).festivals();
    promise.then(function (result) {
      vmMenu.festivals = result.data;
    }, function (err) {
        console.error(err);
    });
  }
   
	setup();
}
AdminMenuController.$inject = [
	'$state',
  'Authentication',
  '$http',
  'ffmediaApi'
];

}(window.jQuery || window.$, window.angular));
