'use strict';

angular.module('app').factory('jobFactory', ['tracking_host', 'listToString','mapFactory', '$window','$http',
	'$mdMedia','$mdDialog', '$interval','templates','patchUpdate', 'restCall', 'COLOR', jobFactory]);
	
	function jobFactory(tracking_host, listToString, mapFactory, $window, $http, 
		$mdMedia, $mdDialog, $interval, templates, patchUpdate, restCall, COLOR){
	

 	var populateLocation = function (job) {

 		var locations = []; 		
 		angular.forEach(job.Tasks, function (value, key) {
 			if (value.Type == "PackagePickUp") {
 				var packagePickUpLocation = {
 					type : "Task",
 					taskType : "PackagePickUp",
 					taskId : value.id,
 					title : "Pickup",
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
 					title : "Delivery",
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
					title : "User's",
 					desc : value.PickupLocation.Address,
 					lat : value.PickupLocation.Point.coordinates[1],
 					lng : value.PickupLocation.Point.coordinates[0],
					draggable : false,
					markerUrl : mapFactory.markerIconUri.redMarker,
 				}
 				locations.push(ridePickUpTask);
 			}
 			
 		});
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
				var result = patchUpdate(state, "/State", "replace", job.HRID, job.Tasks[0].id, success, error);
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
					var result = patchUpdate(state, "/State", "replace", job.HRID, job.Tasks[1].id, success, error);
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
					var result = patchUpdate(state, "replace", "/State", "api/job/" , job.HRID, job.Tasks[1].id, success, error);
					if (result) this.jobTaskStates = state;
				}
			};
			var deliveryTask = {
				job : "Delivery",
				jobTaskStates : job.Tasks[2].State,
				stateChanged : function (state) {
					console.log(this.jobTaskStates);
					var result = patchUpdate(state, "replace", "/State", "api/job/" , job.HRID, job.Tasks[2].id, success, error);
					if (result) this.jobTaskStates = state;
				}
			};
			jobStates.push(pickUpTask);
			jobStates.push(deliveryTask);
		}
		return jobStates;
	};
	
	var OrderDetails = function (job) {
		var details = {
			OrderId : job.HRID,
			UserName : job.User.UserName,
			PhoneNumber : "01911725897",
			OrderType : job.Order.Type,			
			ETA : ""
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
		
		var lat = 23.816577;
		var lng = 90.405150;
		var map = mapFactory.createMap(lat, lng, 'job-map', 11);
	 		
		angular.forEach(locations, function (value, key) {				
			var overlay = mapFactory.createOverlay(value.lat, value.lng, value.title);			
			/*
				this is the part to get tracking data of the assigned assets,
				would move to signlr or websocket implementation when server is ready
			 */
			// markerUpdateEvent();
		});
 

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
		    var result = patchUpdate(selectedAssets[0].Id, "replace", "/AssetRef", "api/job/", job.Id, job.Tasks[0].id, success, error);			
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


	var populateJobTasks = function (job) {

		var jobTasks = [];
		var stateUpdateSuccess = function (response) {
			console.log("stateUpdateSuccess : ");
  			console.log(response);
  			alert("success");  			
  			$window.location.reload();
  			return true;
		};

		var stateUpdateError = function (response) {
			console.log("stateUpdateError : ");
  			console.log(response);
  			alert("failed");
  			return false;
		};

		function StateColor(state) {
			if (state = "PENDING")
				return COLOR.red;
			else if (state = "IN_PROGRESS")
				return COLOR.yellow;
			else if (state = "COMPLETED")
				return COLOR.green;
		}
		angular.forEach(job.Tasks, function (task, key) {
			
			if (task.Type == "FetchDeliveryMan") {
 				var FetchDeliveryMan = {
 					taskType : "FetchDeliveryMan",
 					taskId : task.id,
 					title : "Find Asset",
 					haveLocation : false,
					state : task.State,
 					markerColor : StateColor(task.State),
					startDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					startTime : new moment.utc(task.ModifiedTime).format("h:mm:ss a"),
					completionDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					completionTime : new moment.utc(task.CompletionTime).format("h:mm:ss a"),
					stateChanged : function (state) {
						patchUpdate(state, "replace", "/State", "api/job/", job.Id, task.id, stateUpdateSuccess, stateUpdateError);
					}
 				};
 				console.log(FetchDeliveryMan.startTime);
 				jobTasks.push(FetchDeliveryMan);
 			} else if (task.Type == "PackagePickUp") {
 				var packagePickUp = {
 					taskType : "PackagePickUp",
 					taskId : task.id,
 					title : "Pickup",
 					address : task.PickupLocation.Address,
 					lat : task.PickupLocation.Point.coordinates[1],
 					lng : task.PickupLocation.Point.coordinates[0], 					
 					haveLocation : true,
 					state : task.State,
 					markerColor : StateColor(task.State),
					startDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					startTime : new moment.utc(task.ModifiedTime).format("h:mm:ss a"),
					completionDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					completionTime : new moment.utc(task.CompletionTime).format("h:mm:ss a"),
					stateChanged : function (state) {
						patchUpdate(state, "replace", "/State", "api/job/", job.Id, task.id, stateUpdateSuccess, stateUpdateError);
					}
 				}
 				jobTasks.push(packagePickUp);
 			} else if (task.Type == "Delivery") {
 				var delivery = { 					
 					taskType : "Delivery",
 					taskId : task.id,
 					title : "Delivery",
 					address : task.To.Address,
 					lat : task.To.Point.coordinates[1],
 					lng : task.To.Point.coordinates[0], 					
 					haveLocation : true,
 					state : task.State,
 					markerColor : StateColor(task.State),
					startDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					startTime : new moment.utc(task.ModifiedTime).format("h:mm:ss a"),
					completionDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					completionTime : new moment.utc(task.CompletionTime).format("h:mm:ss a"),
					stateChanged : function (state) {
						patchUpdate(state, "replace", "/State", "api/job/", job.Id, task.id, stateUpdateSuccess, stateUpdateError);
					}
 				}
 				jobTasks.push(delivery);
 			} else if (task.Type == "FetchRide") {
 				// FIXME: basically this is an asset assign task. When we will be working
 				// with Ride order, then refactor it
 				var fetchRide = { 					
					taskType : "FetchRide",
					taskId : task.id,
					title : "User's Destination",
					address : job.Order.To.Address,
					lat : job.Order.To.Point.coordinates[1],
					lng : job.Order.To.Point.coordinates[0],
					haveLocation : true,
					state : task.State,
 					markerColor : StateColor(task.State),
					startDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					startTime : new moment.utc(task.ModifiedTime).format("h:mm:ss a"),
					completionDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					completionTime : new moment.utc(task.CompletionTime).format("h:mm:ss a"),
					stateChanged : function (state) {
						patchUpdate(state, "replace", "/State", "api/job/", job.Id, task.id, stateUpdateSuccess, stateUpdateError);
					}
 				};
				jobTasks.push(fetchRide);
 			} else if (task.Type == "RidePickUp") {
 				var ridePickUp = { 					
					taskType : "RidePickUp",
					taskId : task.id,
					title : "User's",
 					address : task.PickupLocation.Address,
 					lat : task.PickupLocation.Point.coordinates[1],
 					lng : task.PickupLocation.Point.coordinates[0],
 					haveLocation : true,
					state : task.State,
 					markerColor : StateColor(task.State),
					startDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					startTime : new moment.utc(task.ModifiedTime).format("h:mm:ss a"),
					completionDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					completionTime : new moment.utc(task.CompletionTime).format("h:mm:ss a"),
					stateChanged : function (state) {
						patchUpdate(state, "replace", "/State", "api/job/", job.Id, task.id, stateUpdateSuccess, stateUpdateError);
					}
 				}
 				jobTasks.push(ridePickUp);
 			}
 		});
		console.log(jobTasks)
 		return jobTasks;
	}

	return {		 
		populateLocation : populateLocation,
		populateJobTaskState : populateJobTaskState,
		OrderDetails : OrderDetails,
		populateAssetInfo : populateAssetInfo,
		populateServingBy : populateServingBy,
		populateMap : populateMap,
		populateAssetAssignDialog : populateAssetAssignDialog,
		getAssetAddress : getAssetAddress,
		populateJobTasks : populateJobTasks
	}
};
