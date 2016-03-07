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
