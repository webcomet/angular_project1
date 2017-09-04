(function (angular) {

  angular.module('ffmedia').config(routes);

  function routes(
    $stateProvider
  ) {

    $stateProvider.state('index.admin.festival.theme', {
      abstract: true,
      url: '/theme',
      templateUrl: 'modules/ffmedia/client/admin/festival/theme/theme.client.view.html',
    });

    $stateProvider.state('index.admin.festival.theme.theme', {
      url: '/theme',
      templateUrl: 'modules/ffmedia/client/admin/festival/theme/theme/theme.client.view.html',
    });
  }
  routes.$inject = [
    '$stateProvider'
  ];
}(window.angular));
