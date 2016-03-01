'use strict';

app.controller('detailsController', detailsController);

function detailsController($scope, $http, $interval, $mdDialog, $mdMedia, $location, $window, $routeParams, 
							menus, templates,  markerIconUri, 
							timeAgo, 
							populateLocation, populateTaskState, populateJobDetailsTable, populateAssetInfo, populateServingBy, populateMap, populateAssetAssignDialog) {
	
	var id = $routeParams.id;	
	var vm = $scope;

	vm.menus = menus; 
	vm.job = {};
	vm.jobStates = [];
	vm.locations = [];
	vm.map;
	vm.markers	= [];
	vm.jobTaskStates = ["PENDING","IN_PROGRESS","COMPLETED"];
	vm.jobState = ["ENQUEUED","IN_PROGRESS","COMPLETED"];
	vm.assignAsset = ["Assign new Asset", "Change current Asset"];
	 
	vm.jobStateChanged = function (state) {
		vm.job.State = state;
	};
	
	var url1 = "http://localhost:23873/api/Job?id="+id;
	var url2 = "http://127.0.0.1:8080/json/order.json"
	$http.get(url1).then(function(response) {
		vm.job = response.data;				
		vm.locations = populateLocation(vm.job);
		vm.jobStates = populateTaskState(vm.job);		
		vm.requestedAgo = timeAgo(vm.job.CreateTime);
		vm.detailsTable = populateJobDetailsTable(vm.job);
		vm.asset = populateAssetInfo(vm.job);
		vm.servingby = populateServingBy(vm.job);
		populateMap(vm.map, vm.markers, vm.locations);
	});
	vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	vm.assetAssignPopup = function (event) {
		populateAssetAssignDialog(vm,event);
	};
};



