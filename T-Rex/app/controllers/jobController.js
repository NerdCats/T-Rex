'use strict';

app.controller('jobController', [ '$scope', '$http', '$interval', '$window', '$mdDialog', '$mdMedia', '$location', '$routeParams',
							'menus', 'templates', 'host', 'tracking_host',
							'timeAgo', 'jobFactory', 'mapFactory', 'restCall', jobController]);



function jobController($scope, $http, $interval, $window, $mdDialog, $mdMedia, $location, $routeParams,
							menus, templates, host, tracking_host,
							timeAgo,jobFactory, mapFactory, restCall) {
	
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

		vm.jobTasks = jobFactory.populateJobTasks(vm.job);	

		vm.locations = jobFactory.populateLocation(vm.job);
	 
		vm.map = jobFactory.populateMap(vm.job);		
 
		vm.jobStates = jobFactory.populateJobTaskState(vm.job);		

		vm.requestedAgo = timeAgo(vm.job.CreateTime);

		vm.oderDetailsTable = jobFactory.populateOrderDetailsTable(vm.job);

		vm.assets = jobFactory.populateAssetInfo(vm.job);		

		vm.servingby = jobFactory.populateServingBy(vm.job);

		/* FIXME:
		this is the part to get tracking data of the assigned assets,
		would move to signlr or websocket implementation when server is ready
		*/		
		if (!$.isEmptyObject(vm.job.Assets)) {			
			angular.forEach(vm.job.Assets, function (value, key) {				
				var url = tracking_host + "api/location/" + key;	
				function success(response) {
					value.desc = "Last seen on ";
					value.lat = response.data.point.coordinates[1]; 
					value.lng = response.data.point.coordinates[0];
					console.log(value.lat+", "+value.lng);
					var addressFoundCallback = function (address, latLng) {
						// vm.locations[index].desc = address;
						var assetLocation = {		
							type : "Asset",			
							asset_id : value.Id,						
							title : value.Profile.FirstName + "'s Location",
							lat : latLng.lat(),
							lng: latLng.lng(),
							draggable : false,
							desc : address,
							markerUrl : mapFactory.markerIconUri.purpleMarker					
						};
						var overlay = mapFactory.createOverlay(
											assetLocation.lat,
											assetLocation.lng,
											assetLocation.title);
						// mapFactory.markerClickEvent(null, overlay);						
						vm.locations.push(assetLocation);
						$scope.$apply();
					};
					mapFactory.getAddress(value.lat, value.lng, addressFoundCallback);					
				};
				function error(error) {
					value.desc = "Couldn't retrieve Last location";
					console.log(error)
				}
				restCall('GET', url, null, success, error);
			});
		}
		
	};

	function errorCallback(error) {
		$window.location.reload();	
	};

	restCall('GET', jobUrl, null, successCallback);
	
	vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');


	vm.locateMarkerOnMap = function (value) {
			mapFactory.locateMarkerOnMap(value);			
	};
	
	vm.assetAssignPopup = function (event) {
		jobFactory.populateAssetAssignDialog(vm, event, vm.job);
	};
};



