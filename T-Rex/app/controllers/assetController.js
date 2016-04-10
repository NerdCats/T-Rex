'use strict';

app.controller('assetController', assetController);

function assetController($scope, $http, $window, menus, templates, assetsFactory) {

	var vm = $scope;
	vm.menus = menus;
	vm.templates = templates;
	vm.Assets = {Collection : [], pages: []};
	  
	assetsFactory.populateAssets(vm.Assets, "", true, 0, 25)
	
	vm.Register = function (ev) {
		$window.location.href = 'asset/create.html';
	};

	vm.Details = function(_id){
		$window.location.href = '/index.html?id='+ _id;
	};
}