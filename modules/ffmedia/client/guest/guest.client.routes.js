(function (angular) {

  angular.module('ffmedia').config(routes);

  function routes(
    $stateProvider
  ) {
    // public routes
    $stateProvider.state('index.guest', {
      abstract: true,
      templateUrl: 'modules/ffmedia/client/guest/guest.client.view.html',
    });

    $stateProvider.state('index.guest.not-found', {
      url: '/not-found',
      template: '<h1>Not Found</h1>',
    });
    
    authentication();

    function authentication(){

      $stateProvider.state('index.guest.authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/ffmedia/client/guest/authentication/authentication.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm'
      });
      $stateProvider.state('index.guest.authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/ffmedia/client/guest/authentication/signup/signup.client.view.html',
        controller: 'AuthenticationSignupController',
        controllerAs: 'signup',
        data: {
          pageTitle: 'Signup'
        }
      });
      $stateProvider.state('index.guest.authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/ffmedia/client/guest/authentication/signin/signin.client.view.html',
        controller: 'AuthenticationSigninController',
        controllerAs: 'signin',
        data: {
          pageTitle: 'Signin'
        }
      });
    }

    $stateProvider.state('index.guest.forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/ffmedia/client/guest/forbidden/forbidden.client.view.html',
      data: {
        ignoreState: true,
        pageTitle: 'Forbidden'
      }
    });
  }
  routes.$inject = [
    '$stateProvider'
  ];
}(window.angular));
