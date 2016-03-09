'use strict'

app.controller('indexController', indexController);

indexController.$inject = ['$scope', '$location'];

function indexController($scope, $location) {

	var vm = $scope;

	vm.sidebarVisible = true;
	vm.shouldShowMenuAndFooter = true;

	activate();

	vm.menuShow = function () {
		vm.sidebarVisible = !vm.sidebarVisible;
	}

	function activate()
	{
		vm.sidebarVisible = vm.shouldShowMenuAndFooter = $location.path() !== '/login';
	}

}
