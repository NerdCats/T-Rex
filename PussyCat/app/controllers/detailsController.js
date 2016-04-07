'use strict';

app.controller('detailsController', [ '$scope', '$http', '$interval', '$mdDialog', '$mdMedia', '$location', '$window', '$routeParams',
							'menus', 'templates', 'host', 'tracking_host',
							'timeAgo', 'jobDetailsFactory', 'restCall', detailsController]);



function detailsController($scope, $http, $interval, $mdDialog, $mdMedia, $location, $window, $routeParams,
							menus, templates, host, tracking_host,
							timeAgo,jobDetailsFactory, restCall) {
	
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

		vm.locations = jobDetailsFactory.populateLocation(vm.job);

		vm.jobStates = jobDetailsFactory.populateJobTaskState(vm.job);		

		vm.requestedAgo = timeAgo(vm.job.CreateTime);

		vm.detailsTable = jobDetailsFactory.populateJobDetailsTable(vm.job);

		vm.assets = jobDetailsFactory.populateAssetInfo(vm.job);		

		vm.servingby = jobDetailsFactory.populateServingBy(vm.job);

		$interval(function () {
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
		}, 10000);
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



