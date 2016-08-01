'use strict';

angular
	.module('app')
	.factory('jobFactory', ['tracking_host', 'listToString','mapFactory', '$window','$http',
	'$interval','templates','patchUpdate', 'restCall', 'COLOR', jobFactory]);
	
	
	function jobFactory(tracking_host, listToString, mapFactory, $window, $http, 
		$interval, templates, patchUpdate, restCall, COLOR){
	
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
			description : job.Order.Description,	
			note: job.Order.NoteToDeliveryMan,
			State: function() {
				if (job.State=="IN_PROGRESS") {
					return "IN PROGRESS";
				}
				return job.State;
			}
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
					State: function() {
						if (task.State=="IN_PROGRESS") {
							return "IN PROGRESS";
						}
						return task.State;
					},
 					markerColor : StateColor(task.State),
					startDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					startTime : new moment.utc(task.ModifiedTime).local().format("h:mm:ss a"),
					lastModifyDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					lastModifyTime : new moment.utc(task.ModifiedTime).local().format("h:mm:ss a"),
					stateChanged : function (state) {
						patchUpdate(state, "replace", "/State", "api/job/", job.Id, task.id, stateUpdateSuccess, stateUpdateError);
					},
					updateStateDisable : updateStateButtonDisabled(task.State)
 				}; 				
 				jobTasks.push(FetchDeliveryMan);
 			} else if (task.Type == "PackagePickUp") {
 				var packagePickUp = {
 					taskType : "PackagePickUp",
 					taskId : task.id,
 					title : "Pickup",
 					address : task.PickupLocation.Address,
 					lat : NaN,
 					lng : NaN, 					
 					haveLocation : true,
 					State: function() {
						if (task.State=="IN_PROGRESS") {
							return "IN PROGRESS";
						}
						return task.State;
					},
 					markerColor : StateColor(task.State),
					startDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					startTime : new moment.utc(task.ModifiedTime).local().format("h:mm:ss a"),
					lastModifyDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					lastModifyTime : new moment.utc(task.ModifiedTime).local().format("h:mm:ss a"),
					stateChanged : function (state) {
						patchUpdate(state, "replace", "/State", "api/job/", job.Id, task.id, stateUpdateSuccess, stateUpdateError);
					},
					updateStateDisable : updateStateButtonDisabled(task.State)
 				}
 				try{
 					packagePickUp.lat = job.Order.From.Point.coordinates[1];
					packagePickUp.lng = job.Order.From.Point.coordinates[0];
 				} catch(e){
 					console.log(e);
 				}
 				jobTasks.push(packagePickUp);
 			} else if (task.Type == "Delivery") {
 				var delivery = { 					
 					taskType : "Delivery",
 					taskId : task.id,
 					title : "Delivery",
 					address : task.To.Address,
 					lat : NaN,
 					lng : NaN, 					
 					haveLocation : true,
 					State: function() {
						if (task.State=="IN_PROGRESS") {
							return "IN PROGRESS";
						}
						return task.State;
					},
 					markerColor : StateColor(task.State),
					startDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					startTime : new moment.utc(task.ModifiedTime).local().format("h:mm:ss a"),
					lastModifyDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					lastModifyTime : new moment.utc(task.ModifiedTime).local().format("h:mm:ss a"),
					stateChanged : function (state) {
						patchUpdate(state, "replace", "/State", "api/job/", job.Id, task.id, stateUpdateSuccess, stateUpdateError);
					},
					updateStateDisable : updateStateButtonDisabled(task.State)
 				}
 				try{
 					delivery.lat = job.Order.To.Point.coordinates[1];
					delivery.lng = job.Order.To.Point.coordinates[0];
					console.log(delivery);
 				} catch(e){ 					
 					console.log(e);
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
					State: function() {
						if (task.State=="IN_PROGRESS") {
							return "IN PROGRESS";
						}
						return task.State;
					},
 					markerColor : StateColor(task.State),
					startDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					startTime : new moment.utc(task.ModifiedTime).local().format("h:mm:ss a"),
					lastModifyDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					lastModifyTime : new moment.utc(task.ModifiedTime).local().format("h:mm:ss a"),
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
					State: function() {
						if (task.State=="IN_PROGRESS") {
							return "IN PROGRESS";
						}
						return task.State;
					},
 					markerColor : StateColor(task.State),
					startDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					startTime : new moment.utc(task.ModifiedTime).local().format("h:mm:ss a"),
					lastModifyDate : new moment.utc(task.ModifiedTime).format("MMMM Do"),
					lastModifyTime : new moment.utc(task.ModifiedTime).local().format("h:mm:ss a"),
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
		populateJobTasks : populateJobTasks		
	}
};
