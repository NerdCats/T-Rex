'use strict'

app.controller('indexController', indexController);

indexController.$inject = ['$scope', '$location', 'menus', 'templates', '$window', 'authService'];

function indexController($scope, $location, menus, templates, $window, authService) {
	console.log($window.location.hash);
	var vm = $scope;

	vm.sidebarVisible = true;
	vm.shouldShowMenuAndFooter = true;

	vm.menus = menus;
	vm.templates = templates.sidebar;

	vm.logout = function () {
		console.log("logout");
		authService.logOut();
		$window.location.reload();
	};


	activate();

	vm.menuShow = function () {
		vm.sidebarVisible = !vm.sidebarVisible;
	}

	function activate()
	{
		if ($window.location.hash == '#/login'){
			vm.sidebarVisible = false;
			vm.shouldShowMenuAndFooter = false;
		}
	}

}
