(function (angular) {

  angular.module('ffmedia').config(routes);

  function routes(
    $stateProvider
  ) {

    $stateProvider.state('index.guest.ffm.festivals', {
      url: '/festivals',
      templateUrl: 'modules/ffmedia/client/guest/ffm/festivals/festivals.client.view.html',
      abstract: true,
    });

    $stateProvider.state('index.guest.ffm.festivals.how-it-works', {
      url: '/how-it-works',
      templateUrl: 'modules/ffmedia/client/guest/ffm/festivals/how-it-works/how-it-works.client.view.html',
    });
    
    $stateProvider.state('index.guest.ffm.festivals.features', {
      url: '/features',
      templateUrl: 'modules/ffmedia/client/guest/ffm/festivals/features/features.client.view.html',
    });

    $stateProvider.state('index.guest.ffm.festivals.id', {
      url: '/id/{festival_id}',
      templateUrl: 'modules/ffmedia/client/guest/ffm/festivals/id/id.client.view.html',
    });
  }
  routes.$inject = [
    '$stateProvider'
  ];
}(window.angular));
