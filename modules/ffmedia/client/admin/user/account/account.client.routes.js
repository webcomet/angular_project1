(function (angular) {

  angular.module('ffmedia').config(routes);

  function routes(
    $stateProvider
  ) {

    $stateProvider.state('index.admin.user.account', {
      abstract: true,
      url: '/account',
      templateUrl: 'modules/ffmedia/client/admin/user/account/account.client.view.html',
    });

    $stateProvider.state('index.admin.user.account.editProfile', {
      url: '/edit-profile',
      templateUrl: 'modules/ffmedia/client/admin/user/account/edit-profile/edit-profile.client.view.html',
      data: {
        permissions: ['profile']
      }
    });

    $stateProvider.state('index.admin.user.account.purchases', {
      url: "/purchases",
      templateUrl: 'modules/ffmedia/client/admin/user/account/purchases/purchases.client.view.html'
    });

    $stateProvider.state('index.admin.user.account.support', {
      url: "/support",
      templateUrl: 'modules/ffmedia/client/admin/user/account/support/support.client.view.html'
    });

    $stateProvider.state('index.admin.user.account.checkout', {
      url: "/checkout",
      templateUrl: 'modules/ffmedia/client/admin/user/account/checkout/checkout.client.view.html',
      controller: 'AdminCheckoutController',
      controllerAs: 'checkout'  
    });
  }
  routes.$inject = [
    '$stateProvider'
  ];
}(window.angular));
