(function (angular) {

  angular.module('ffmedia').config(routes);

  function routes(
    $stateProvider
  ) {

    $stateProvider.state('index.admin.festival.films', {
      abstract: true,
      url: '/films',
      templateUrl: 'modules/ffmedia/client/admin/festival/films/films.client.view.html',
    });

    $stateProvider.state('index.admin.festival.films.films', {
      url: '/films',
      templateUrl: 'modules/ffmedia/client/admin/festival/films/films/films.client.view.html',
    });

    $stateProvider.state('index.admin.festival.films.createUpdate', {
      url: '/create-update/{film_id}',
      templateUrl: 'modules/ffmedia/client/admin/festival/films/create-update/create-update.client.view.html',
    });

    $stateProvider.state('index.admin.festival.films.collections', {
      url: '/collections',
      templateUrl: 'modules/ffmedia/client/admin/festival/films/collections/collections.client.view.html',
    });

    $stateProvider.state('index.admin.festival.films.invite', {
      url: '/invite',
      templateUrl: 'modules/ffmedia/client/admin/festival/films/invite/invite.client.view.html',
      controller: 'AdminFestivalFilmInviteFilmMaker as vmAdminFestivalFilmInviteFilmMaker'
    });
    
    $stateProvider.state('index.admin.festival.films.submissions', {
      url: '/submissions',
      templateUrl: 'modules/ffmedia/client/admin/festival/films/submissions/submissions.client.view.html',
    });
  }
  routes.$inject = [
    '$stateProvider'
  ];
}(window.angular));
