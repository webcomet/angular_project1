(function (angular) {

  angular.module('ffmedia').config(routes);

  function routes(
    $stateProvider
  ) {

    $stateProvider.state('index.guest.ffm.festivals.id.home', {
      url: '/home',
      templateUrl: 'modules/ffmedia/client/guest/ffm/festivals/id/home/home.client.view.html',
    });
    $stateProvider.state('index.guest.ffm.festivals.id.preview', {
      url: '/preview',
      templateUrl: 'modules/ffmedia/client/guest/ffm/festivals/id/home/home.client.view.html',
    });
    $stateProvider.state('index.guest.ffm.festivals.id.film', {
      url: '/film/{film_id}',
      templateUrl: 'modules/ffmedia/client/guest/ffm/festivals/id/film/film.client.view.html',
      controller: 'GuestFestivalFilm',
      controllerAs: 'vmFilm'
    });
    $stateProvider.state('index.guest.ffm.festivals.id.tickets', {
      url: '/tickets/{ticket_id}',
      templateUrl: 'modules/ffmedia/client/guest/ffm/festivals/id/tickets/tickets.client.view.html',
    });
  }
  routes.$inject = [
    '$stateProvider'
  ];
}(window.angular));
