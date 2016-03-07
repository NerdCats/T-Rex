'use strict';

app.controller('assetController', assetController);

function assetController($scope, $http, $window, menus, templates, assetsFactory) {

	var vm = $scope;
	vm.menus = menus;
	vm.templates = templates;
	vm.Assets = {Collection : [], pages: []};
	  
	var url = "/json/assetlist.json";
	$http.get(url).then(function(response){
		var assets = response.data;	
		console.log(assets);		
		vm.Assets = assetsFactory.populateAssets(assets, url)
	});
	
	vm.Register = function (ev) {
		$window.location.href = 'asset/create.html';
	};

	vm.Details = function(_id){
		$window.location.href = '/index.html?id='+ _id;
	};
}