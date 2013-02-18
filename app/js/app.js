angular.module('tusitaPersonal', ['tusitaPersonal-directives'], function($routeProvider, $locationProvider) {
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

  $routeProvider.when('/testRESTful', {
    templateUrl: '/partials/testRESTful.html',
    controller: testRESTfulAPICtrl
  });

  $routeProvider.otherwise({redirectTo: '/'});
});
