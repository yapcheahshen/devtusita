function mainCtrl($scope, $http, $templateCache, $location) {
  $scope.userEmail = angular.element(document.getElementById('userEmail')).html();
  $scope.urlREST = '/RESTful/' + $scope.userEmail;
  $scope.userData = {}
  $scope.isUserDataReady = false;

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

function applyCtrl($scope, $http, $location) {
  // redirect to / if user is not logged in
  if (!$scope.isLogin) $location.path('/');

  $scope.urlRESTRetreat = $scope.urlREST + '/retreat'
  $scope.isRetreatDataReady = false;
  // Get Retreat Data
  $http({method: 'GET',
         url: $scope.urlRESTRetreat}).
    success(function(data, status) {
      // get retreat data successfully
      $scope.retreats = data;
      $scope.isRetreatDataReady = true;
    }).
    error(function(data, status) {
      // failed to get retreat data
      // FIXME: do better error showing
      alert('fail to get retreat data');
      $location.path('/');
  });

  // set default option value of application form
  $scope.applicationData = {'joined': 'no',
                            'srIll': 'no',
                            'mtIll': 'no',
                            'adct': 'no'};
  $scope.user = angular.copy($scope.applicationData);
  $scope.urlRESTApply = $scope.urlREST + '/apply'

  // callback if user press 'SUBMIT' button
  $scope.submit = function(user) {
    $scope.savingUserData = true;

    // save meditation application data to server through RESTful API
    $http({method: 'POST',
           url: $scope.urlRESTApply,
           data: JSON.stringify(user)}).
      success(function(data, status) {
        // save successfully
        $scope.savingUserData = undefined;
        $scope.failToSaveUserData = undefined;
        $scope.applicationData = angular.copy(user);
        $('#saveAppFormModal').modal();
      }).
      error(function(data, status) {
        // failed to save meditation application
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

// show meditation application data of the user
function recordCtrl($scope, $http, $location) {
  // redirect to / if user is not logged in
  if (!$scope.isLogin) $location.path('/');

  $scope.isLoadingRecord = true;
  $scope.urlRESTApply = $scope.urlREST + '/apply';

  $scope.showAppForm = function(urlsafe) {
    $scope.appForm = undefined;
    for (var i=0; i < $scope.appForms.length; i++) {
      if ($scope.appForms[i].urlsafe == urlsafe)
        $scope.appForm = $scope.appForms[i];
    }
    $('#showAppFormModal').modal();
  };

  // read meditation application data from server
  $http({method: 'GET',
         url: $scope.urlRESTApply}).
    success(function(data, status) {
      // read successfully
      $scope.isLoadingRecord = undefined;
      $scope.appForms = data;
    }).
    error(function(data, status) {
      // failed to read meditation application data
      $scope.isLoadingRecord = undefined;
  });
}

function retreatCtrl($scope, $http, $templateCache, $location) {
  // redirect to / if user is not logged in
  if (!$scope.isLogin) $location.path('/');

  $scope.retreatData = {'receiverEmail': $scope.userEmail};
  $scope.retreat = angular.copy($scope.retreatData);
  $scope.urlRESTRetreat = $scope.urlREST + '/retreat'

  // callback if user press 'SUBMIT' button
  $scope.submit = function(retreat) {
    $scope.savingRetreatData = true;

    // save retreat data to server through RESTful API
    $http({method: 'POST',
           url: $scope.urlRESTRetreat,
           data: JSON.stringify(retreat),
           cache: $templateCache}).
      success(function(data, status) {
        // save successfully
        $scope.savingRetreatData = undefined;
        $scope.failToSaveRetreatData = undefined;
        $scope.retreatData = angular.copy(retreat);
        $('#saveAppFormModal').modal();
      }).
      error(function(data, status) {
        // failed to save retreat data
        $scope.savingRetreatData = undefined;
        $scope.failToSaveRetreatData = true;
        $('#saveAppFormModal').modal();
    });
  };

  $scope.isUnchanged = function(retreat) {
    return angular.equals(retreat, $scope.retreatData);
  };
}

function manageRetreatsCtrl($scope, $http, $location) {
  // redirect to / if user is not logged in
  if (!$scope.isLogin) $location.path('/');

  $scope.urlRESTRetreat = $scope.urlREST + '/retreat'
  $scope.isRetreatDataReady = false;
  // Get Retreat Data
  $http({method: 'GET',
         url: $scope.urlRESTRetreat}).
    success(function(data, status) {
      // get retreat data successfully
      $scope.retreats = data;
      $scope.isRetreatDataReady = true;
    }).
    error(function(data, status) {
      // failed to get retreat data
      // FIXME: do better error showing
      alert('fail to get retreat data');
      $location.path('/');
  });
}
manageRetreatsCtrl.$inject = ['$scope', '$http', '$location'];
