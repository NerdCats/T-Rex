app.directive('confirmPassword', function () {
	return {
        require: "ngModel",
        scope: {
            otherModelValue: "=confirmPassword"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.confirmPassword = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
})

