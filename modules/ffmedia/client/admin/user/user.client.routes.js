(function (angular) {

  angular.module('ffmedia').config(routes);

  function routes(
    $stateProvider
  ) {

    $stateProvider.state('index.admin.user', {
      abstract: true,
      url: '/user',
      templateUrl: 'modules/ffmedia/client/admin/user/user.client.view.html',
    });
  }
  routes.$inject = [
    '$stateProvider'
  ];
}(window.angular));
