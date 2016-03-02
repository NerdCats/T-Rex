angular
	.module('app')
	.controller('assetController', assetController);


function assetController(menus, templates, populateAssetTable) {

	var vm = this;
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