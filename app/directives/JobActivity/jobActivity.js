(function () {
    'use strict';

    angular
        .module('app')
        .directive('jobActivity', jobActivity);

    function jobActivity() {
        // Usage:
        // 
        // Creates:
        //

        /* @ngInject */
        var jobAcitivityDirectiveController = ['$scope', '$http', 'ngAuthSettings', function ($scope, $http, ngAuthSettings) {
            var vm = $scope;
            vm.url = "";
            function init() {
                if (vm.hrid === undefined) {
                    vm.url = ngAuthSettings.apiServiceBaseUri + "api/JobActivity?$orderby=TimeStamp desc&$select=ActionText,HRID,TimeStamp";
                } else {
                    vm.url = ngAuthSettings.apiServiceBaseUri + "api/JobActivity?$filter=HRID eq '"+ vm.hrid +"'&$orderby=TimeStamp desc&$select=ActionText,HRID,TimeStamp";
                }
                console.log(vm.hrid)
                console.log(vm.url);
                $http({
                    method: 'GET',
                    url: vm.url
                }).then(function (response) {
                    vm.data = response.data.data;
                }, function (error) {
                    // TODO: Use proper error reporting here
                });
            }

            init();
        }];

        var directive = {            
            controller: jobAcitivityDirectiveController,            
            restrict: 'E',
            scope: {
                hrid: '=hrid'
            },
            templateUrl: 'app/directives/JobActivity/jobActivity.html'
        };
        return directive;
    }
})();