angular
	.module('app')
	.controller('assetController', assetController);


function assetController($http,$interval,$mdDialog,$mdMedia,$location,$window,menus,templates) {

	var vm = this;
	vm.menus = menus;
	vm.templates = templates;
	  
	var url = "/json/assetlist.json";
	vm.populateTable = function(url){
		$http.get(url).then(function(response){
			var assets = response.data;			
			angular.forEach(assets.data, function(value, key){
				var asset = {
					Username : value.Username,
					Type : value.Type,
					Phone : value.Phone,
					CurrentLocation : value.CurrentLocation,
					AreaOfOperation : value.AreaOfOperation,
					IsAvailable : value.IsAvailable,
					State : value.State,
					Details : function(){
						$window.location.href = '/index.html?id='+ value._id;
					}
				};
				vm.Collection.push(asset);
			});
			console.log(vm.Collection)
			vm.pages = function(){
				var arr = [];
				for (var i = 0; i < assets.pagination.TotalPages ; i++) {
					arr.push(i);
				};
				return arr;
			};
			console.log(vm.pages())
		});
	};



	vm.Collection = [];
	vm.populateTable(url);	
	console.log(vm.Collection);

	vm.Register = function (ev) {
		$window.location.href = 'asset/create.html';
	};
}