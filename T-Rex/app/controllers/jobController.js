'use strict';

app.controller('jobController', [ '$scope', '$http', '$interval', '$window', '$routeParams',
							'menus', 'templates', 'host', 'tracking_host', 'tracking_link',
							'timeAgo', 'jobFactory', 'mapFactory', 'restCall', jobController]);



function jobController($scope, $http, $interval, $window, $routeParams,
							menus, templates, host, tracking_host, tracking_link,
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

	var jobUrl = host + "api/job/" + id;	
	function successCallback(response) {

		vm.job = response.data;

		vm.publicTrackingLink = tracking_link + vm.job.HRID;

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
		// $window.location.reload();	
		console.log(error);
	};

	restCall('GET', jobUrl, null, successCallback, errorCallback);

	vm.locateMarkerOnMap = function (value) {
			mapFactory.locateMarkerOnMap(value);			
	};
	
	vm.assetAssignPopup = function (event) {
		jobFactory.populateAssetAssignDialog(vm, event, vm.job);
	};

	vm.paymentStatusUpdate = function () {
		var url = host + "api/payment/process/" + vm.job.Id;
		function successCallback(response) {
			$window.location.reload();
		}
		function errorCallback(error) {
			alert("Couldn't update the payment status!")
		}
		restCall("POST", url, null, successCallback, errorCallback);

	}

};



