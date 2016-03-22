'use strict';

angular
  .module('app')
  .controller('authController', authController);

authController.$inject = ['$scope', 'authService', '$location', '$window'];

function authController($scope, authService, $location, $window) {
  var vm = this;
  vm.loginData = {};
  vm.loginData.username = "";
  vm.loginData.password = "";
  vm.loginData.email = "";

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
	authService.login(vm.loginData).then(function(response) {
		console.log("log in success");
		console.log(response);
		$window.location.reload();
	  },
	  function(err) {
		console.log(err);
		$scope.message = err.error_description;
	  });
  }
}
