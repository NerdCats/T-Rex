'use strict';

app.controller('detailsController', [ '$scope', '$http', '$interval', '$mdDialog', '$mdMedia', '$location', '$window', '$routeParams',
							'menus', 'templates', 
							'timeAgo', 'jobDetailsFactory', 'restCall', detailsController]);



function detailsController($scope, $http, $interval, $mdDialog, $mdMedia, $location, $window, $routeParams,
							menus, templates, 
							timeAgo,jobDetailsFactory, restCall) {
	
	var id = $routeParams.id;	
	var vm = $scope;

	vm.menus = menus; 
	vm.job = {};
	vm.jobStates = [];
	vm.locations = [];
	vm.markers	= [];
	vm.jobTaskStates = ["PENDING","IN_PROGRESS","COMPLETED"];
	vm.jobState = ["ENQUEUED","IN_PROGRESS","COMPLETED"];
	vm.assignAsset = ["Assign new Asset", "Change current Asset"];
	 
	vm.jobStateChanged = function (state) {
		vm.job.State = state;
	};
	
	var url1 = "http://localhost:23873/api/Job?id="+id;
	var url2 = "http://127.0.0.1:8080/json/order.json";
	$http.get(url1).then(function(response) {

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

				var url = "http://gobdshadowcat.cloudapp.net/api/location/" + value.id;	
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



	});
	
	vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

	vm.locateMarkerOnMap = function (value) {
			var latLng = new google.maps.LatLng(value.lat, value.lon);
			console.log("latLng");
			console.log(latLng);
			// console.log(vm.map);
			vm.map.panTo(latLng);
	}
	vm.assetAssignPopup = function (event) {
		jobDetailsFactory.populateAssetAssignDialog(vm, event, vm.job);
	};
};



