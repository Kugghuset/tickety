(function () {
'use strict'

angular.module('customerEngineApp')
.directive('ceCardArea', function () {
  return {
    templateUrl: 'app/directives/ceCardArea/ceCardArea.html',
    restrict : 'EA',
    transclude: true,
    scope:  {
      childClass: '@'
    },
    link: function (scope, element, attrs) {
      
    }
  }
});

})();