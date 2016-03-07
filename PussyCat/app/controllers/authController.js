'use strict';

angular
  .module('app')
  .controller('authController', authController);

authController.$inject = ['$scope', 'authService'];

function authController($scope, authService) {
  var vm = this;
  vm.loginData = {};
  vm.loginData.username = "";
  vm.loginData.password = "";
  vm.loginData.email = "";
  // FIXME: This should be in the config somewhere, not hardcoded in the controller
  // may be in the service, but not in the controller
  vm["client_Id"] = "GoFetchDevWebApp"

  vm.loginData.useRefreshTokens = false;
  vm.login = login;

  activate();

  function activate() {

  }

  function login() {
    authService.login(vm.loginData).then(function(response) {
        $location.path('/home');
      },
      function(err) {
        console.log(err);
        $scope.message = err.error_description;
      });
  }
}
