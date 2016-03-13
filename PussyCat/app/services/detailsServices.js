'use strict';

angular.module('app').factory('jobDetailsFactory', ['listToString','mapFactory','$http','$mdMedia','$mdDialog','templates','patchUpdate', jobDetailsFactory]);
	
	function jobDetailsFactory(listToString, mapFactory, $http, $mdMedia, $mdDialog, templates, patchUpdate){
	
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
			title : "User's destination",
			desc : job.Order.To.Address,
			markerUrl : mapFactory.markerIconUri.redMarker				
		};
		var assetLocation = {
			// since asset module is not ready, just putting dummy location
			user : "Asset Nazrul",
			lat : 23.800490,
			lng: 90.408450,
			title : "Asset's Location",
			desc : "Somewhere Asset is",
			markerUrl : mapFactory.markerIconUri.purpleMarker				
		};

		return {
			userLocation : userLocation,
			userDestination : userDestination,
			assetLocation : assetLocation
		}
	};

	var populateJobTaskState = function (job) {

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

		var jobStates = [];
		if (job.Order.Type == "Ride") {
			var findAsset = {
				job : "Find Asset",
				jobTaskStates : job.Tasks[0].State,
				stateChanged : function (state) {					
					console.log(this.jobTaskStates);					
					var result = patchUpdate(state, "/State", "replace", job._id, job.Tasks[0].id, success, error);
					if (result) this.jobTaskStates = state;
				}
			};
			var assetIsOnWay = {
				job : "Asset is on way",
				jobTaskStates : job.Tasks[1].State,
				stateChanged : function (state) {
					console.log(this.jobTaskStates);
					var result = patchUpdate(state, "/State", "replace", job._id, job.Tasks[1].id, success, error);
					if (result) this.jobTaskStates = state;
				}
			};
			jobStates.push(findAsset)
			jobStates.push(assetIsOnWay)
		};
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
			console.log(assets)
		});
		return assets;
	};

	var populateServingBy = function(job) {
		var servingby = {
			name : "Redwan"
		};
		return servingby;	
	};

	var populateMap = function (job, map, markers) {

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
			
			var assetLocationMarker = mapFactory.createMarker(locations.assetLocation.lat,
									locations.assetLocation.lng,
									locations.assetLocation.title,
									locations.assetLocation.draggable,
									locations.assetLocation.desc,
									locations.assetLocation.markerUrl,
									map);
			mapFactory.markerClickEvent(map, assetLocationMarker);
			
			

		}

		mapFactory.createMap(locations.userLocation.lat, 
							locations.userLocation.lng,
							'map', map, 16, createMarkersCallback);	 
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
		    var result = patchUpdate(selectedAssets[0].Id, "/AssetRef", "replace", job._id, job.Tasks[0].id, success, error);			
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
