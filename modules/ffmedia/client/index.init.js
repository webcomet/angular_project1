(function () {

  angular.module('ffmedia', [
    'ui.router',
    'ui.bootstrap',
    'ngFileUpload',
    'dndLists'
  ]).run(ffmediaReady).config(ffmediaConfig);

  function ffmediaReady() {}
  function ffmediaConfig(
  	$locationProvider,
  	$httpProvider
  ) {
  	$locationProvider.html5Mode(true).hashPrefix('!');

  	$httpProvider.interceptors.push('authInterceptor');
  }
  ffmediaConfig.$inject = [
  	'$locationProvider',
  	'$httpProvider'
  ];
}());
