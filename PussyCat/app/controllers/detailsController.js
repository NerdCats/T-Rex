'use strict';

app.controller('detailsController', [ '$scope', '$http', '$interval', '$mdDialog', '$mdMedia', '$location', '$window', '$routeParams',
							'menus', 'templates', 'host', 'tracking_host',
							'timeAgo', 'jobDetailsFactory', 'mapFactory', 'restCall', detailsController]);



function detailsController($scope, $http, $interval, $mdDialog, $mdMedia, $location, $window, $routeParams,
							menus, templates, host, tracking_host,
							timeAgo,jobDetailsFactory, mapFactory, restCall) {
	
	var id = $routeParams.id;	
	var vm = $scope;

	vm.menus = menus; 
	vm.job = {};
	vm.jobStates = [];
	vm.locations = [];
	vm.markers	= [];
	vm.jobTaskStates = ["IN_PROGRESS","COMPLETED"];
	vm.assignAsset = ["Assign Asset"];

	var jobUrl = host + "api/Job?id=" + id;	
	function successCallback(response) {

		vm.job = response.data;				

		vm.map = jobDetailsFactory.populateMap(vm.job);		

		// vm.locations = jobDetailsFactory.populateLocation(vm.job);

		vm.locations = jobDetailsFactory.populateLocation(vm.job);

		angular.forEach(vm.locations, function (value, index) {
			if(value.type == "Asset"){
				var addressFoundCallback = function (address, latLng) {
					vm.locations[index].desc = address;
					$scope.$apply();
				};
				mapFactory.getAddress(value.lat, value.lng, addressFoundCallback)				
			}
		});


		vm.jobStates = jobDetailsFactory.populateJobTaskState(vm.job);		

		vm.requestedAgo = timeAgo(vm.job.CreateTime);

		vm.detailsTable = jobDetailsFactory.populateJobDetailsTable(vm.job);

		vm.assets = jobDetailsFactory.populateAssetInfo(vm.job);		

		vm.servingby = jobDetailsFactory.populateServingBy(vm.job);

		/*
		this is the part to get tracking data of the assigned assets,
		would move to signlr or websocket implementation when server is ready
		 */
		angular.forEach(vm.locations.assetsLocation, function (value, index) {

			var url = tracking_host + "api/location/" + value.id;	
			function success(response) {
				value.desc = "Last seen on ";
				console.log(response)
			};
			function error(error) {
				value.desc = "Couldn't retrieve Last location";
				console.log(error)
			}
			restCall('GET', url, null, success, error);
		});			
		 


	};

	restCall('GET', jobUrl, null, successCallback);
	
	vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');


	vm.locateMarkerOnMap = function (value) {
			var latLng = new google.maps.LatLng(value.lat, value.lng);			
			vm.map.panTo(latLng);
	};
	
	vm.assetAssignPopup = function (event) {
		jobDetailsFactory.populateAssetAssignDialog(vm, event, vm.job);
	};
};



