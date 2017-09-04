(function ($, angular) {
'use strict';

	/**
	 * @ngdoc function
	 * @name ffmedia.controller:AdminEditProfileController
	 * @description
	 */
	angular.module('ffmedia').controller('AdminEditProfileController', AdminEditProfileController);

	function AdminEditProfileController(
		$q,
		Authentication,
		ffmediaApi,
		$uibModal,
		$http
	) {

	var vm = this;

	function setup() {

		vm.user = Authentication.user;
		
		viewApi();
	}
	function viewApi() {

		vm.saveProfile = function(user) {
			updateUser(user);
		};
		vm.deleteProfile = function(user) {
			deleteUser(user);
		};
	}
	function updateUser(user) {

		user.saving = true;
		user.apiError = undefined;
		user.apiSuccess = undefined;

		return $q(updateUserPromise);

		function updateUserPromise(updateUserResolve, updateUserReject) {
			ffmediaApi.user(user).profile().update().then(updateUserSuccess, updateUserError);

			function updateUserSuccess(response) {
				user.saving = undefined;
				user.apiSuccess = response.data.message;
				updateUserResolve(response);
			}
			function updateUserError(response) {

				user.saving = undefined;
				user.apiError = response.data.message;
				updateUserReject(response);
			}
		}
	}

	function deleteUser(user) {

		deleteUserDisplayConfirmationModal(user);

		function deleteUserDisplayConfirmationModal(user) {

			var modalInstance = $uibModal.open({
				templateUrl: 'deleteConfirmationModal.script',
				controller: 'DeleteUserModalController',
				controllerAs: 'vmModal',
				resolve: {
					param: function () {
						return null;
					}
				}
			});

		}

	}

		setup();
	}

	AdminEditProfileController.$inject = [
		'$q',
		'Authentication',
		'ffmediaApi',
		'$uibModal',
		'$http'
	];

}(window.jQuery || window.$, window.angular));
