
'use strict';

angular.module('app').factory('jobDetailsFactory', ['tracking_host', 'listToString','mapFactory', '$window','$http','$mdMedia','$mdDialog', '$interval','templates','patchUpdate', 'restCall', jobDetailsFactory]);
	
	function jobDetailsFactory(tracking_host, listToString, mapFactory, $window, $http, $mdMedia, $mdDialog, $interval, templates, patchUpdate, restCall){
	

 	var populateLocation = function (job) {
		var userLocation  = {
			user : job.Order.From.Address,
			lat : job.Order.From.Point.coordinates[1],
			lng : job.Order.From.Point.coordinates[0],
			draggable : true,
			title : "User's location",
			desc : job.Order.From.Address,
			markerUrl : mapFactory.markerIconUri.greenMarker			
		};

		var userDestination = {
			user : job.User,
			lat : job.Order.To.Point.coordinates[1],
			lng : job.Order.To.Point.coordinates[0],
			draggable : true,
			title : "User's destination",
			desc : job.Order.To.Address,
			markerUrl : mapFactory.markerIconUri.redMarker			
		};

		var assetsLocation = [];
		if (!$.isEmptyObject(job.Assets)) {			
			angular.forEach(job.Assets, function (value, key) {				
				var assetLocation = {					
					id : value.Id,
					user : value.Profile.FirstName,
					lat : 23.800490,
					lng: 90.408450,
					draggable : false,
					title : value.Profile.FirstName + "'s Location",
					desc : "",
					markerUrl : mapFactory.markerIconUri.purpleMarker					
				};
				assetsLocation.push(assetLocation);
			});
		}
		

		return {
			userLocation : userLocation,
			userDestination : userDestination,
			assetsLocation : assetsLocation
		}
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
	
	var populateJobDetailsTable = function (job) {
		var details = {
			orderId : job._id,
			user : job.User,
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
			var userLocationMarker = mapFactory.createMarker(locations.userLocation.lat,
									locations.userLocation.lng,
									locations.userLocation.title,
									locations.userLocation.draggable,
									locations.userLocation.desc,
									locations.userLocation.markerUrl,
									map);
			mapFactory.markerClickEvent(map, userLocationMarker);
			
			var destinationMarker = mapFactory.createMarker(locations.userDestination.lat,
									locations.userDestination.lng,
									locations.userDestination.title,
									locations.userDestination.draggable,
									locations.userDestination.desc,
									locations.userDestination.markerUrl,
									map);

			mapFactory.markerClickEvent(map, destinationMarker);

			angular.forEach(locations.assetsLocation, function (value, key) {
				
				var assetLocationMarker = mapFactory.createMarker(
											value.lat,
											value.lng,
											value.title,
											value.draggable,
											value.desc,
											value.markerUrl,
											map);				
				mapFactory.markerClickEvent(map, assetLocationMarker);

				var markerUpdateEvent = function () {	   

					var url = tracking_host + "api/location/" + value.id;
					// var url = "http://127.0.0.1:8080/json/assetLocation.json";				    
					restCall("GET", url, null, success, error);
				    
				    function success(response) {
				    	// console.log(response.data);
				    	var date = new Date(response.data['timestamp']['$date']);
				    	console.log(date);			    	
				    	var lat = response.data.point.coordinates[1];
				    	var lon = response.data.point.coordinates[0];
				    	var latLng = new google.maps.LatLng( lat, lon );
				    	
				        assetLocationMarker.setPosition(latLng);
				        // map.panTo(latLng);
				        // console.log(map);
				    };
				    function error(error) {
				    	console.log(error);
				    };
			    	
				};
				$interval(markerUpdateEvent, 10000)
			});
		}

		var map = mapFactory.createMap(locations.userLocation.lat, 
							locations.userLocation.lng,
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


	return {		 
		populateLocation : populateLocation,
		populateJobTaskState : populateJobTaskState,
		populateJobDetailsTable : populateJobDetailsTable,
		populateAssetInfo : populateAssetInfo,
		populateServingBy : populateServingBy,
		populateMap : populateMap,
		populateAssetAssignDialog : populateAssetAssignDialog
	}
};
