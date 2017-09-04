(function (angular) {

  angular.module('ffmedia').config(routes);

  function routes(
    $stateProvider
  ) {

    $stateProvider.state('index.admin.internal', {
      abstract: true,
      url: '/internal',
      templateUrl: 'modules/ffmedia/client/admin/internal/internal.client.view.html',
    });

  }
  routes.$inject = [
    '$stateProvider'
  ];
}(window.angular));
