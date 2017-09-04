(function (angular) {

  angular.module('ffmedia').config(routes);

  function routes(
    $stateProvider
  ) {

    $stateProvider.state('index.guest.ffm', {
      abstract: true,
      url: '/ffm',
      templateUrl: 'modules/ffmedia/client/guest/ffm/ffm.client.view.html',
    });

    $stateProvider.state('index.guest.ffm.home', {
      url: '/',
      templateUrl: 'modules/ffmedia/client/guest/ffm/home/home.client.view.html',
    });

    $stateProvider.state('index.guest.ffm.cart', {
      url: '/cart',
      templateUrl: 'modules/ffmedia/client/guest/ffm/cart/cart.client.view.html',
    });
  }
  routes.$inject = [
    '$stateProvider'
  ];
}(window.angular));
