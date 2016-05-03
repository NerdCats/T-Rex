'use strict';

app.controller('assetController', ['$scope', '$http', '$window', 'menus', 'templates', 'userService', assetController]);

function assetController($scope, $http, $window, menus, templates, userService) {

	var vm = this;
	vm.menus = menus;
	vm.templates = templates;
	vm.Assets = {Collection : [], pages: []};
	 
	userService.populateAssets(vm.Assets, "BIKE_MESSENGER", true, 0, 25)
	
	vm.GoToAssetsTrackerMap = function () {
		$window.location.href = '#/asset/assets-tracking-map';
	}

	vm.Register = function () {
		$window.location.href = '#/asset/create';
	};

	vm.Details = function(Id){
		$window.location.href = '#/asset/details/' + Id;
	};
}