angular.module('tusitaPersonal', ['tusitaPersonal-directives', 'tusita.i18n'], function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider.when('/', {
    templateUrl: '/partials/welcome.html',
    controller: welcomeCtrl
  });

  $routeProvider.when('/userdata', {
    templateUrl: '/partials/userdata.html',
    controller: userdataCtrl
  });

  $routeProvider.when('/apply', {
    templateUrl: '/partials/apply.html',
    controller: applyCtrl
  });

  $routeProvider.when('/record', {
    templateUrl: '/partials/record.html',
    controller: recordCtrl
  });

  $routeProvider.when('/retreat', {
    templateUrl: '/partials/retreat.html',
    controller: retreatCtrl
  });

  $routeProvider.when('/manageRetreats', {
    templateUrl: '/partials/manageRetreats.html',
    controller: manageRetreatsCtrl
  });

  $routeProvider.otherwise({redirectTo: '/'});
});
