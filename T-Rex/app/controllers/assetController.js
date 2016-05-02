'use strict';

app.controller('assetController', ['$scope', '$http', '$window', 'menus', 'templates', 'assetsFactory', assetController]);

function assetController($scope, $http, $window, menus, templates, assetsFactory) {

	var vm = this;
	vm.menus = menus;
	vm.templates = templates;
	vm.Assets = {Collection : [], pages: []};
	  
	assetsFactory.populateAssets(vm.Assets, "BIKE_MESSENGER", true, 0, 25)
	
	vm.GoToAssetsTrackerMap = function () {
		$window.location.href = '#/asset/assets-tracking-map';
	}

	vm.Register = function () {
		$window.location.href = '#/asset/create';
	};

	vm.Details = function(_id){
		$window.location.href = '#/index.html?id='+ _id;
	};
}