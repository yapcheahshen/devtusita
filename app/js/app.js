angular.module('tusitaPersonal', [], function($routeProvider, $locationProvider) {
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

  $routeProvider.when('/testRESTful', {
    templateUrl: '/partials/testRESTful.html',
    controller: testRESTfulAPICtrl
  });
}).directive('datepicker', function($parse) {
    // Reference:
    // http://docs.angularjs.org/guide/directive
    // http://api.jqueryui.com/datepicker/
    // http://jsfiddle.net/nnsese/xB6c2/26/
    var directiveDefinitionObject = {
      restrict: 'A',
      link: function postLink(scope, iElement, iAttrs) {
        iElement.datepicker({
          dateFormat: 'yy-mm-dd',
          onSelect: function(dateText, inst) {
            scope.$apply(function(scope){
              $parse(iAttrs.ngModel).assign(scope, dateText);
            });
          }
        });
      }
    };
    return directiveDefinitionObject;
  });
