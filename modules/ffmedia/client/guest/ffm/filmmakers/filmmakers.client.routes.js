(function (angular) {

  angular.module('ffmedia').config(routes);

  function routes(
    $stateProvider
  ) {

    $stateProvider.state('index.guest.ffm.filmmakers', {
      abstract: true,
      url: '/filmmakers',
      templateUrl: 'modules/ffmedia/client/guest/ffm/filmmakers/filmmakers.client.view.html',
    });

    $stateProvider.state('index.guest.ffm.filmmakers.how-it-works', {
      url: '/how-it-works',
      templateUrl: 'modules/ffmedia/client/guest/ffm/filmmakers/how-it-works/how-it-works.client.view.html',
    });
  }
  routes.$inject = [
    '$stateProvider'
  ];
}(window.angular));
