(function (angular) {

  angular.module('ffmedia').config(routes);

  function routes(
    $stateProvider,
    $urlRouterProvider
  ) {

    $stateProvider.state('index', {
      abstract: true,
      templateUrl: 'modules/ffmedia/client/index.client.view.html',
      controller: 'IndexController as index',
    });

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('index.guest.not-found', null, {
        location: false
      });
    });
  }
  routes.$inject = [
    '$stateProvider',
    '$urlRouterProvider'
  ];
}(window.angular));
