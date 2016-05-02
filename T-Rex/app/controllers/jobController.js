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
	vm.Assets = [];
	vm.markers	= [];
	vm.jobTaskStates = ["COMPLETED"];
	vm.assignAsset = ["Assign Asset"];
	vm.invoiceLink = function (HRID) {		
		return host + "api/job/"+ HRID +"/invoice";
	}

	var jobUrl = host + "api/Job?id=" + id;	
	function successCallback(response) {

		vm.job = response.data;			

		vm.jobTasks = jobFactory.populateJobTasks(vm.job);		
	 
		vm.map = jobFactory.populateMap(vm.jobTasks);				

		vm.requestedAgo = timeAgo(vm.job.CreateTime);

		vm.OrderDetails = jobFactory.OrderDetails(vm.job);

		vm.servingby = jobFactory.populateServingBy(vm.job);
		

		/* FIXME:
		this is the part to get tracking data of the assigned assets,
		would move to signlr or websocket implementation when server is ready
		*/		
		if (!$.isEmptyObject(vm.job.Assets)) {			
			
			angular.forEach(vm.job.Assets, function (value, key) {

				var asset = {
					type : "Asset",			
					asset_id : value.Id,						
					title : value.UserName,
					phoneNumber : value.PhoneNumber,
					photo : "",
					rating : 5
				};
				console.log(asset);
				vm.Assets.push(asset);
				var url = tracking_host + "api/location/" + key;	
				restCall('GET', url, null, success, error);
				function success(response) {
					asset.desc = "Last seen on ";
					asset.lat = response.data.point.coordinates[1]; 
					asset.lng = response.data.point.coordinates[0];
					mapFactory.createOverlay(asset.lat, asset.lng, asset.title);
					$scope.$apply();
				};
				function error(error) {
					value.desc = "Couldn't retrieve Last location";
					console.log(error)
				}
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



