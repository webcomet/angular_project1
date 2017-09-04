(function ($, angular) {
  'use strict';

	/**
	 * @ngdoc function
	 * @name ffmedia.controller:AdminCheckoutController
	 * @description 
	 */
	angular.module('ffmedia').controller('AdminCheckoutController', AdminCheckoutController);

	function AdminCheckoutController(
		$q,
		Authentication,
		ffmediaApi
	) {

		var vm = this;

		function setup() {
			vm.user = Authentication.user;
			vm.pageFlow = 'address';
		}

		setup();
	}

	AdminCheckoutController.$inject = [
		'$q',
		'Authentication',
		'ffmediaApi'
	];

}(window.jQuery || window.$, window.angular));
