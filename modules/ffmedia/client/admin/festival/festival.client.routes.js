(function (angular) {

	angular.module('ffmedia').config(routes);

	function routes(
		$stateProvider
	) {

		$stateProvider.state('index.admin.festival', {
			abstract: true,
			url: '/festival/{festivalId}',
			templateUrl: 'modules/ffmedia/client/admin/festival/festival.client.view.html',
		});
	}
	routes.$inject = [
		'$stateProvider'
	];
}(window.angular));
