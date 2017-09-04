(function (angular) {

  angular.module('ffmedia').config(routes);

  function routes(
    $stateProvider
  ) {

    $stateProvider.state('index.guest.ftv', {
      abstract: true,
      templateUrl: 'modules/ffmedia/client/guest/ftv/ftv.client.view.html',
    });

    $stateProvider.state('index.guest.ftv.home', {
      url: '/',
      templateUrl: 'modules/ffmedia/client/guest/ftv/home/home.client.view.html',
    });

    $stateProvider.state('index.guest.ftv.policy', {
      url: '/policy',
      templateUrl: 'modules/ffmedia/client/guest/ftv/policy/policy.client.view.html',
    });

    $stateProvider.state('index.guest.ftv.close-captioning', {
      url: '/close-captioning',
      templateUrl: 'modules/ffmedia/client/guest/ftv/close-captioning/close-captioning.client.view.html',
    });

    $stateProvider.state('index.guest.ftv.faq', {
      url: '/faq',
      templateUrl: 'modules/ffmedia/client/guest/ftv/faq/faq.client.view.html',
    });

    $stateProvider.state('index.guest.ftv.about', {
      url: '/about',
      templateUrl: 'modules/ffmedia/client/guest/ftv/about/about.client.view.html',
    });

    $stateProvider.state('index.guest.ftv.terms-of-service', {
      url: '/terms-of-service',
      templateUrl: 'modules/ffmedia/client/guest/ftv/terms-of-service/terms-of-service.client.view.html',
    });

    $stateProvider.state('index.guest.ftv.ways-to-stream', {
      url: '/ways-to-stream',
      templateUrl: 'modules/ffmedia/client/guest/ftv/ways-to-stream/ways-to-stream.client.view.html',
    });

  }
  routes.$inject = [
    '$stateProvider'
  ];
}(window.angular));
