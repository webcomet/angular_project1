(function (angular) {

	angular.module('ffmedia').config(routes);

	function routes(
		$stateProvider
	) {

		$stateProvider.state('index.admin', {
			abstract: true,
			url: '/admin',
			templateUrl: 'modules/ffmedia/client/admin/admin.client.view.html',
		});
	}
	routes.$inject = [
		'$stateProvider'
	];
}(window.angular));
