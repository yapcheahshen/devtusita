function mainCtrl($scope, $http, $templateCache, $location) {
  $scope.userEmail = angular.element(document.getElementById('userEmail')).html();
  $scope.urlREST = '/RESTful/' + $scope.userEmail;
  $scope.userData = {}
  $scope.isUserDataReady = false;

  $scope.isDevServer = (function() {
    return $location.host() == 'localhost';
  })();

  $scope.$on('userDataSavedEvent', function(event, data) {
    $scope.userData = angular.copy(data);
    $scope.isUserDataReady = true;
  });

  // check whether user logged in
  $scope.isLogin = (function() {
    // test whether email is valid
    var patt=/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/;
    return patt.test($scope.userEmail);
  })();

  if ($scope.isLogin) {
    // user already logged in, retrieve user data from server.
    $http({method: 'GET', url: $scope.urlREST, cache: $templateCache}).
      success(function(data, status) {
        // retrieve user data successfully
        $scope.userData = angular.copy(data);
        $scope.isUserDataReady = true;
      }).
      error(function(data, status) {
        // fail to retrieve user data => redirect user to fill in basic user data.
        $location.path('/userdata');
    });
  }
}

function welcomeCtrl($scope) {
  $scope.span8width = angular.element(document.getElementById('tstBanner')).width();
}

function userdataCtrl($scope, $http, $templateCache, $location) {
  // redirect to / if user is not logged in
  if (!$scope.isLogin) $location.path('/');

  $scope.email = $scope.userEmail;

  // callback if user press 'SAVE' button
  $scope.update = function(user) {
    $scope.savingUserData = true;
    $scope.userData = angular.copy(user);

    // save user data to server through RESTful API
    var httpMethod = 'POST';
    if ($scope.isUserDataReady) httpMethod = 'PUT';
    $http({method: httpMethod,
           url: $scope.urlREST,
           data: JSON.stringify($scope.userData),
           cache: $templateCache}).
      success(function(data, status) {
        // save successfully
        $scope.savingUserData = undefined;
        $scope.failToSaveUserData = undefined;
        $scope.$emit('userDataSavedEvent', $scope.userData)
        $location.path('/');
      }).
      error(function(data, status) {
        // failed to save user data
        $scope.savingUserData = undefined;
        $scope.failToSaveUserData = true;
    });
  };
 
  // callback if user press 'RESET' button
  $scope.reset = function() {
    $scope.user = angular.copy($scope.userData);
  };
 
  $scope.isUnchanged = function(user) {
    return angular.equals(user, $scope.userData);
  };
 
  $scope.reset();
}

function applyCtrl($scope, $http, $templateCache, $location) {
  // redirect to / if user is not logged in
  if (!$scope.isLogin) $location.path('/');

  $scope.applicationData = {'joined': 'no',
                            'srIll': 'no',
                            'mtIll': 'no',
                            'adct': 'no'};
  $scope.user = angular.copy($scope.applicationData);
  $scope.urlRESTApply = $scope.urlREST + '/apply'

  // callback if user press 'SUBMIT' button
  $scope.submit = function(user) {
    $scope.savingUserData = true;

    // save user data to server through RESTful API
    $http({method: 'POST',
           url: $scope.urlRESTApply,
           data: JSON.stringify(user),
           cache: $templateCache}).
      success(function(data, status) {
        // save successfully
        $scope.savingUserData = undefined;
        $scope.failToSaveUserData = undefined;
        $scope.applicationData = angular.copy(user);
        $('#saveAppFormModal').modal();
      }).
      error(function(data, status) {
        // failed to save user data
        $scope.savingUserData = undefined;
        $scope.failToSaveUserData = true;
        $('#saveAppFormModal').modal();
    });
  };

  // callback if user press 'RESET' button
  $scope.reset = function() {
    $scope.user = angular.copy($scope.applicationData);
  };
 
  $scope.isUnchanged = function(user) {
    return angular.equals(user, $scope.applicationData);
  };
 
  $scope.reset();
}

function recordCtrl($scope, $http, $templateCache) {
  $scope.isLoadingRecord = true;
  $scope.urlREST = $scope.urlREST + '/apply';

  $scope.showAppForm = function(urlsafe) {
    $scope.appForm = undefined;
    for (var i=0; i < $scope.appForms.length; i++) {
      if ($scope.appForms[i].urlsafe == urlsafe)
        $scope.appForm = $scope.appForms[i];
    }
    $('#showAppFormModal').modal();
  };

  // read data from server
  $http({method: 'GET',
         url: $scope.urlREST,
         cache: $templateCache}).
    success(function(data, status) {
      // read successfully
      $scope.isLoadingRecord = undefined;
      $scope.appForms = data;
    }).
    error(function(data, status) {
      // failed to read user data
      $scope.isLoadingRecord = undefined;
  });
}

function retreatCtrl($scope) {
  $scope.message = "retreat";
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