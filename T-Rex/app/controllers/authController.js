'use strict';

app.controller('authController', authController);

authController.$inject = ['$scope', 'authService', '$location', '$window'];

function authController($scope, authService, $location, $window) {
    var vm = this;
    vm.loginData = {};
    vm.loginData.username = "";
    vm.loginData.password = "";
    vm.loginData.email = "";        
    vm.isLogging = false;
    vm.logginFailed = false;
    vm.logginSuccedded = false;
    vm.message = "";

    vm.loginData.useRefreshTokens = false;
    vm.login = login;

    activate();

    function activate() {
        if ($window.location.hash == '#/login'){
            vm.sidebarVisible = false;
            vm.shouldShowMenuAndFooter = false;
        }
    }

    function login() {        
        vm.message = "";
        vm.logginFailed = false;
        vm.isLogging = true;
        authService.login(vm.loginData).then(function(response) {            
            vm.logginSuccedded = true;
            vm.isLogging = false;
            console.log(response);
            $window.location.reload();            
        },
        function(err) {            
            console.log(err);
            vm.logginFailed = true;
            vm.isLogging = false;
            vm.message = err.error_description;
        });
    }
}
