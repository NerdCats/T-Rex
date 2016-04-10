
'use strict';

angular.module('app').factory('jobDetailsFactory', ['tracking_host', 'listToString','mapFactory', '$window','$http',
	'$mdMedia','$mdDialog', '$interval','templates','patchUpdate', 'restCall', jobDetailsFactory]);
	
	function jobDetailsFactory(tracking_host, listToString, mapFactory, $window, $http, 
		$mdMedia, $mdDialog, $interval, templates, patchUpdate, restCall){
	

 	var populateLocation = function (job, scope) {

 		var locations = []; 		
 		angular.forEach(job.Tasks, function (value, key) {
 			if (value.Type == "PackagePickUp") {
 				var packagePickUpLocation = {
 					type : "Task",
 					taskType : "PackagePickUp",
 					taskId : value.id,
 					title : "Pickup location",
 					desc : value.PickupLocation.Address,
 					lat : value.PickupLocation.Point.coordinates[1],
 					lng : value.PickupLocation.Point.coordinates[0],
 					draggable : false,
 					markerUrl : mapFactory.markerIconUri.greenMarker,
 				}
 				locations.push(packagePickUpLocation);
 			} else if (value.Type == "Delivery")
 			{
 				var deliveryLocation = {
 					type : "Task",
 					taskType : "Delivery",
 					taskId : value.id,
 					title : "Delivery location",
 					desc : value.To.Address,
 					lat : value.To.Point.coordinates[1],
 					lng : value.To.Point.coordinates[0],
 					draggable : false,
 					markerUrl : mapFactory.markerIconUri.redMarker,
 				}
 				locations.push(deliveryLocation);
 			} else if (value.Type == "FetchRide") {
 				// FIXME: basically this is an asset assign task. When we will be working
 				// with Ride order, then refactor it
 				var fetchRideTask = {
 					type : "Task",
					taskType : "FetchRide",
					taskId : value.id,
					title : "User's Destination",
					desc : job.Order.To.Address,
					lat : job.Order.To.Point.coordinates[1],
					lng : job.Order.To.Point.coordinates[0],
					draggable : false,
					markerUrl : mapFactory.markerIconUri.greenMarker,
 				};
				locations.push(fetchRideTask);
 			} else if (value.Type == "RidePickUp") {
 				var ridePickUpTask = {
 					type : "Task",
					taskType : "RidePickUp",
					taskId : value.id,
					title : "User's Location",
 					desc : value.PickupLocation.Address,
 					lat : value.PickupLocation.Point.coordinates[1],
 					lng : value.PickupLocation.Point.coordinates[0],
					draggable : false,
					markerUrl : mapFactory.markerIconUri.redMarker,
 				}
 				locations.push(ridePickUpTask);
 			}
 			
 		});

		var assetsLocation = [];
		console.log(scope);
		if (!$.isEmptyObject(job.Assets)) {			
			angular.forEach(job.Assets, function (value, key) {				
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
						locations.push(assetLocation);
						var marker = mapFactory.createMarker(
											assetLocation.lat,
											assetLocation.lng,
											assetLocation.title,
											assetLocation.draggable,
											assetLocation.desc,
											assetLocation.markerUrl);
						mapFactory.markerClickEvent(null, marker);
						scope.$apply();
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
		
		return locations;
	};

	var populateJobTaskState = function (job) {

		var success = function (response) {
			console.log("success : ");
  			console.log(response);
  			alert("success");  			
  			$window.location.reload();
  			return true;
		};

		var error = function (response) {
			console.log("error : ");
  			console.log(response);
  			alert("failed");
  			return false;
		};

		var jobStates = [];
		var findAssetTask = {
			job : "Find Asset",
			jobTaskStates : job.Tasks[0].State,
			stateChanged : function (state) {					
				console.log(this.jobTaskStates);					
				var result = patchUpdate(state, "/State", "replace", job._id, job.Tasks[0].id, success, error);
				if (result) this.jobTaskStates = state;
			}
		};
		jobStates.push(findAssetTask);
		if (job.Order.Type == "Ride") {
			
			var assetIsOnWay = {
				job : "Asset is on way",
				jobTaskStates : job.Tasks[1].State,
				stateChanged : function (state) {
					console.log(this.jobTaskStates);
					var result = patchUpdate(state, "/State", "replace", job._id, job.Tasks[1].id, success, error);
					if (result) this.jobTaskStates = state;
				}
			};
			jobStates.push(assetIsOnWay)
		} else if (job.Order.Type == "Delivery") {						
			var pickUpTask = {
				job : "Pick up",
				jobTaskStates : job.Tasks[1].State,
				stateChanged : function (state) {
					console.log(this.jobTaskStates);
					var result = patchUpdate(state, "replace", "/State", "api/job/" , job._id, job.Tasks[1].id, success, error);
					if (result) this.jobTaskStates = state;
				}
			};
			var deliveryTask = {
				job : "Delivery",
				jobTaskStates : job.Tasks[2].State,
				stateChanged : function (state) {
					console.log(this.jobTaskStates);
					var result = patchUpdate(state, "replace", "/State", "api/job/" , job._id, job.Tasks[2].id, success, error);
					if (result) this.jobTaskStates = state;
				}
			};
			jobStates.push(pickUpTask);
			jobStates.push(deliveryTask);
		}
		return jobStates;
	};
	
	var populateOrderDetailsTable = function (job) {
		var details = {
			orderId : job._id,
			user : job.OrderUser,
			phoneNumber : "01911725897",
			orderType : job.Order.Type,
			preferences : listToString(job.Order.VehiclePreference),
			eta : ""
		}
		return details;	
	};

	var populateAssetInfo = function (job) {
		var assets = [];	
		angular.forEach(job.Assets, function (value, key) {
			var asset  = {
				name : value.Profile.FirstName,
				phoneNumber : value.phoneNumber,
				currentLocation : "Banani",
				type : value.Type
			}
			assets.push(asset);			
		});
		return assets;
	};

	var populateServingBy = function(job) {
		var servingby = {
			name : "Redwan"
		};
		return servingby;
	};

	var populateMap = function (job) {
		var locations = populateLocation(job);
		
		var createMarkersCallback = function (map) {			
			angular.forEach(locations, function (value, key) {				
				var marker = mapFactory.createMarker(
											value.lat,
											value.lng,
											value.title,
											value.draggable,
											value.desc,
											value.markerUrl);
				mapFactory.markerClickEvent(map, marker);
				/*
					this is the part to get tracking data of the assigned assets,
					would move to signlr or websocket implementation when server is ready
				 */
				// markerUpdateEvent();
			});
		}

		var map = mapFactory.createMap(locations[0].lat, 
							locations[0].lng,
							'map', 16, createMarkersCallback);
		return map;							
	};

	var populateAssetAssignDialog = function (vm, event, job) {

		var success = function (response) {
			console.log("success : ");
  			console.log(response);
  			alert("success");
  			location.reload();
  			return true;
		};

		var error = function (response) {
			console.log("error : ");
  			console.log(response);
  			alert("failed");
  			return false;
		};

		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;

	    $mdDialog.show({
			controller: assetAssignDialogController,
			templateUrl: templates.availableAsset,
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose:true,
			fullscreen: useFullScreen,
			job: job
	    })
	    .then(function(selectedAssets) {		    
		    var result = patchUpdate(selectedAssets[0].Id, "replace", "/AssetRef", "api/job/", job._id, job.Tasks[0].id, success, error);			
	    }, function() {
			console.log("Asset Assign dialog canceled");
	    });

	    vm.$watch(function() {
	      return $mdMedia('xs') || $mdMedia('sm');
	    }, function(wantsFullScreen) {
	      vm.customFullscreen = (wantsFullScreen === true);
	    });	
	};

	var getAssetAddress = function (value) {	   
		var url = tracking_host + "api/location/" + value.id;
		restCall("GET", url, null, success, error);
	    
	    function success(response) {				    	
	    	var date = new Date(response.data['timestamp']['$date']);
	    	console.log(date);			    	
	    	var lat = response.data.point.coordinates[1];
	    	var lng = response.data.point.coordinates[0];

	    	var addressFoundCallback = function (address, latLng) {
	    		value.desc = address;
	    	};

	    	mapFactory.getAddress(lat, lng, addressFoundCallback);
	    	var latLng = new google.maps.LatLng(lat, lng);
	    };

	    function error(error) {
	    	console.log(error);
	    };
    	
	};


	return {		 
		populateLocation : populateLocation,
		populateJobTaskState : populateJobTaskState,
		populateOrderDetailsTable : populateOrderDetailsTable,
		populateAssetInfo : populateAssetInfo,
		populateServingBy : populateServingBy,
		populateMap : populateMap,
		populateAssetAssignDialog : populateAssetAssignDialog,
		getAssetAddress : getAssetAddress
	}
};
