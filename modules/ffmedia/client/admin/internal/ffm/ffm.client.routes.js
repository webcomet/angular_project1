(function (angular) {

	angular.module('ffmedia').config(routes);

	function routes(
		$stateProvider
	) {

		$stateProvider.state('index.admin.internal.ffm', {
			abstract: true,
			url: '/',
			templateUrl: 'modules/ffmedia/client/admin/internal/ffm/ffm.client.view.html',
		});

		$stateProvider.state('index.admin.internal.ffm.home', {
			url: 'media',
			templateUrl: 'modules/ffmedia/client/admin/internal/ffm/home/home.client.view.html',
		});

		$stateProvider.state('index.admin.internal.ffm.festivals', {
			url: 'festivals',
			templateUrl: 'modules/ffmedia/client/admin/internal/ffm/festivals/festivals.client.view.html',
		});

	}
	routes.$inject = [
		'$stateProvider'
	];
}(window.angular));
