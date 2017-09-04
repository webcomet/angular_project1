(function (angular) {

  angular.module('ffmedia').config(routes);

  function routes(
    $stateProvider
  ) {
    
    $stateProvider.state('index.admin.festival.tickets', {
      abstract: true,
      url: '/tickets',
      templateUrl: 'modules/ffmedia/client/admin/festival/tickets/tickets.client.view.html',
    });

    $stateProvider.state('index.admin.festival.tickets.tickets', {
      url: '/tickets',
      templateUrl: 'modules/ffmedia/client/admin/festival/tickets/tickets/tickets.client.view.html',
    });

    $stateProvider.state('index.admin.festival.tickets.createUpdate', {
      url: '/create-update',
      templateUrl: 'modules/ffmedia/client/admin/festival/tickets/create-update/create-update.client.view.html',
    });

    $stateProvider.state('index.admin.festival.tickets.invite', {
      url: '/invite',
      templateUrl: 'modules/ffmedia/client/admin/festival/tickets/invite/invite.client.view.html',
    });

    $stateProvider.state('index.admin.festival.tickets.holders', {
      url: '/holders',
      templateUrl: 'modules/ffmedia/client/admin/festival/tickets/holders/holders.client.view.html',
    });
  }
  routes.$inject = [
    '$stateProvider'
  ];
}(window.angular));
