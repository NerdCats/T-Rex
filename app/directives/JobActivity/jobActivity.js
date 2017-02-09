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
                if (vm.taskcatbase === undefined) {
                    vm.url = ngAuthSettings.apiServiceBaseUri + "api/JobActivity?$orderby=TimeStamp desc&$select=ActionText,HRID,TimeStamp";
                } else {
                    vm.url = ngAuthSettings.apiServiceBaseUri + "api/JobActivity?$filter=HRID eq '"+ vm.taskcatbase +"'&$orderby=TimeStamp desc&$select=ActionText,HRID,TimeStamp";
                }
                console.log(vm.taskcatbase)
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
                taskcatbase: '=taskcatbase'
            },
            templateUrl: 'app/directives/JobActivity/jobActivity.html'
        };
        return directive;
    }
})();