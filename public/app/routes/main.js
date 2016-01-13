(function () {
'use strict'

angular.module('ticketyApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main', {
    templateUrl: 'routes/main.html',
    controller: 'MainCtrl'
  });
}])
.controller('MainCtrl', ['$scope', 'Auth', 'Notification', function ($scope, Auth, Notification) {

}]);

})();