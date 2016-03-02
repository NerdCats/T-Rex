'use strict'

app.controller('indexController', indexController);

function indexController($scope) {

	var vm = $scope;

	vm.sidebardVisible = true;
	vm.menuShow = function () {
		if (vm.sidebardVisible) {
			vm.sidebardVisible = false;
		} else {
			vm.sidebardVisible = true;
		}
	}
}