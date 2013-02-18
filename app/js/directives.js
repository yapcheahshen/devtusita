angular.module('tusitaPersonal-directives', []).
  directive('datepicker', function($parse) {
    // Reference:
    // http://docs.angularjs.org/guide/directive
    // http://api.jqueryui.com/datepicker/
    // http://jsfiddle.net/nnsese/xB6c2/26/
    var directiveDefinitionObject = {
      restrict: 'A',
      link: function postLink(scope, iElement, iAttrs) {
        iElement.datepicker({
          changeYear: true,
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
