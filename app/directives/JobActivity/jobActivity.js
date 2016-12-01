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
        var jobAcitivityDirectiveController = ['$http', function ($http) {
            var vm = this;
            function init() {
                vm.text = "done!";

                $http({
                    method: 'GET',
                    url: vm.taskcatbase + "api/JobActivity?$orderby=TimeStamp desc&$select=ActionText,HRID,TimeStamp"
                }).then(function (response) {
                    vm.data = response.data.data;
                }, function (error) {
                    // TODO: Use proper error reporting here
                });
            }

            init();
        }];

        var directive = {
            bindToController: true,
            controller: jobAcitivityDirectiveController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                taskcatbase: '@'
            },
            templateUrl: 'app/directives/JobActivity/jobActivity.html'
        };
        return directive;
    }
})();