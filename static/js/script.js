angular.module('tusitaPersonal', [], function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider.when('/testRESTful', {
    templateUrl: '/partials/testRESTful.html',
    controller: testRESTfulAPICtrl
  });
});

function mainCtrl($scope) {
  $scope.userEmail = angular.element(document.getElementById('userEmail')).html();
  $scope.urlREST = '/RESTful/' + $scope.userEmail;
}

function testRESTfulAPICtrl($scope, $http, $templateCache) {
  $scope.method = 'GET';
  $scope.email = $scope.userEmail;

  function setInputFields(data) {
    $scope.name = data['name'];
    $scope.phone = data['phone'];
    $scope.address = data['address'];
    $scope.notes = data['notes'];
  };

  function getInputFieldsJSON() {
    return JSON.stringify({
             'name': $scope.name,
             'phone': $scope.phone,
             'address': $scope.address,
             'notes': $scope.notes
           });
  };

  $scope.test = function() {
    if ($scope.method == 'GET') {
      $http({method: $scope.method, url: $scope.urlREST, cache: $templateCache}).
        success(function(data, status) {
          $scope.status = status;
          $scope.data = data;
          setInputFields(data);
        }).
        error(function(data, status) {
          $scope.data = data || "Request failed";
          $scope.status = status;
      });
    } else if ($scope.method == 'POST') {
      $http({method: $scope.method, url: $scope.urlREST, data: getInputFieldsJSON(), cache: $templateCache}).
        success(function(data, status) {
          $scope.status = status;
          $scope.data = data;
        }).
        error(function(data, status) {
          $scope.data = data || "Request failed";
          $scope.status = status;
      });
    } else if ($scope.method == 'PUT') {
      $http({method: $scope.method, url: $scope.urlREST, data: getInputFieldsJSON(), cache: $templateCache}).
        success(function(data, status) {
          $scope.status = status;
          $scope.data = data;
        }).
        error(function(data, status) {
          $scope.data = data || "Request failed";
          $scope.status = status;
      });
    } else if ($scope.method == 'DELETE') {
      $http({method: $scope.method, url: $scope.urlREST, cache: $templateCache}).
        success(function(data, status) {
          $scope.status = status;
          $scope.data = data;
        }).
        error(function(data, status) {
          $scope.data = data || "Request failed";
          $scope.status = status;
      });
    } else {
      $scope.status = 'impossible to happen';
      $scope.data = 'impossible to happen';
    }
  };
}
