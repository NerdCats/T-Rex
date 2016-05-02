'use strict';

angular.module('app').factory('jobFactory', ['tracking_host', 'listToString','mapFactory', '$window','$http',
	'$mdMedia','$mdDialog', '$interval','templates','patchUpdate', 'restCall', 'COLOR', jobFactory]);
	
	function jobFactory(tracking_host, listToString, mapFactory, $window, $http, 
		$mdMedia, $mdDialog, $interval, templates, patchUpdate, restCall, COLOR){
	
	var OrderDetails = function (job) {
		var details = {
			OrderId : job.HRID,
			UserName : job.User.UserName,
			PhoneNumber : job.User.PhoneNumber,
			OrderType : job.Order.Type,			
			PreferredDeliveryTime : job.PreferredDeliveryTime,
			ETA : job.Order.ETA,
			ETAMinutes : job.Order.ETAMinutes,
			PaymentMethod : job.Order.PaymentMethod,
			orderCart : job.Order.OrderCart,
		};		
		return details;	
	};

	 
	var populateServingBy = function(job) {
		var servingby = {
			name : "Redwan"
		};
		return servingby;
	};

	var populateMap = function (jobTasks) {
		var lat = 23.816577;
		var lng = 90.405150;
		var map = mapFactory.createMap(lat, lng, 'job-map', 11);
	 		
		angular.forEach(jobTasks, function (value, key) {
			if (value.haveLocation) {
				var overlay = mapFactory.createOverlay(value.lat, value.lng, value.title);				
			}			
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
		};

		function updateStateButtonDisabled(State) {
			if (State=="PENDING" || State=="COMPLETED") {
				return true;
			}
			return false;
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
					},
					updateStateDisable : updateStateButtonDisabled(task.State)
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
					},
					updateStateDisable : updateStateButtonDisabled(task.State)
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
					},
					updateStateDisable : updateStateButtonDisabled(task.State)
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
					},
					updateStateDisable : updateStateButtonDisabled(task.State)
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
					},
					updateStateDisable : updateStateButtonDisabled(task.State)
 				}
 				jobTasks.push(ridePickUp);
 			}
 		});
		console.log(jobTasks)
 		return jobTasks;
	};

	

	return {		 		
		OrderDetails : OrderDetails,
		populateServingBy : populateServingBy,
		populateMap : populateMap,
		populateAssetAssignDialog : populateAssetAssignDialog,		
		populateJobTasks : populateJobTasks		
	}
};
