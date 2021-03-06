(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceModalConfirm', ['$uibModal', '$timeout', function ($uibModal, $timeout) {
  return {
    template: '<div></div>',
    restrict : 'EA',
    scope: {
      openModal: '=',
      modalIsOpen: '='
    },
    link: function (scope, element, attrs, ctrl) {
      
      var modalInstance;
      
      scope.openModal = function (title, question, callback) {
        
        if (scope.modalIsOpen) {
          // Only one instance can be open.
          return;
        }
        
        $timeout(function () {
          scope.modalIsOpen = true;
        });
        
        modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'directives/ceModalConfirm/ceModalConfirm.html',
          controller: 'ConfirmModalInstanceCtrl',
          resolve: {
            title: function () {
              return title;
            },
            question: function () {
              return question;
            }
          }
        });
        
        // Set the confirm result
        modalInstance.result.then(function (res) {
          $timeout(function () {
            scope.modalIsOpen = false;
          });
          if (callback) { callback(true); }
        })
        ['catch'](function (res) {
          $timeout(function () {
            scope.modalIsOpen = false;
          });
          if (callback) { callback(false); }
        });
      };
      
      scope.$on('$destroy', function (event) {
        if (modalInstance) {
          modalInstance.close();
        }
      });
      
    }
  }
}])
.controller('ConfirmModalInstanceCtrl', ['$scope', '$uibModalInstance', 'title', 'question',
  function ($scope, $uibModalInstance, title, question) {
  
  if (!title) { $scope.title = 'Confirm'; }
  
  if (!question) { $scope.question = 'Are you sure?'; }
  
  $scope.title = title;
  $scope.question = question;
  
  $scope.ok = function () {
    $uibModalInstance.close(true);
  };
  
  $scope.cancel = function () {
    $uibModalInstance.dismiss(false);
  }
  
}]);

})();
