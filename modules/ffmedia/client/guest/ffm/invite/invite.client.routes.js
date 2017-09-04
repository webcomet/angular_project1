(function (angular) {

  angular.module('ffmedia').config(routes);

  function routes(
    $stateProvider
  ) {

    $stateProvider.state('index.guest.ffm.inviteFilmmaker', {
      url: '/invite/filmmaker/:code',
      templateUrl: 'modules/ffmedia/client/guest/ffm/invite/filmmaker/filmmaker.client.view.html',
      controller: 'GuestFestivalInviteFilmMaker as vmGuestFestivalInviteFilmMaker'
    });
  }
  routes.$inject = [
    '$stateProvider'
  ];
}(window.angular));
