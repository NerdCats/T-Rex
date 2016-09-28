// From this source
// http://jsfiddle.net/raving/hybave3y/

app.directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.assetRegistration.Password.$viewValue
                console.log(noMatch + "  " + viewValue);
                console.log(elm)
                ctrl.$setValidity('noMatch', !noMatch)                
            })
        }
    }
});