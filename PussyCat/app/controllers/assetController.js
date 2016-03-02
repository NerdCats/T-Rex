angular
	.module('app')
	.controller('assetController', assetController);


function assetController($scope, menus, templates, populateAssetTable) {

	var vm = $scope;
	vm.menus = menus;
	vm.templates = templates;
	vm.Assets = {Collection : [], pages: []};
	  
	var url = "/json/assetlist.json";
	
	populateAssetTable(vm.Assets, url);	
	console.log(vm.Assets);

	vm.Register = function (ev) {
		$window.location.href = 'asset/create.html';
	};
}