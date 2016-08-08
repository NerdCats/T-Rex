'use strict';

app.factory('jobFactory', ['$http', 'tracking_host', 'host', 'listToString','mapFactory', '$window',
	'$interval','templates','patchUpdate', 'restCall', 'COLOR', 'dashboardFactory', jobFactory]);
	
function jobFactory($http, tracking_host, host, listToString, mapFactory, $window, 
	$interval, templates, patchUpdate, restCall, COLOR, dashboardFactory){
	

	var job = function (id) {
	 	return {
	 		data : {},
	 		jobIsLoading: "PENDING",
	 		jobUpdating: false,
	 		modifying: "",
	 		redMessage : null,	 		
	 		loadJob: function () {
				this.jobIsLoading = "INPROGRESS";
				console.log(this.data)
				var itSelf = this;
				function successCallback(response) {
					itSelf.data = response.data;
					itSelf.jobIsLoading = "COMPLETED";					
					console.log(itSelf);
				};
				function errorCallback(error) {
					itSelf.jobIsLoading = "FAILED";
					console.log(error)
					itSelf.redMessage = error.Message;
				};
				restCall('GET', host + "api/job/" + id, null, successCallback, errorCallback);	 			
	 		},	 		
	 		claim: function () {
	 			var itSelf = this;
	 			itSelf.modifying = "CLAIMING";
	 			function successFulClaim(response) {
	 				console.log(response);
	 				itSelf.modifying = "";
	 				$window.location.reload();
	 			}
	 			function failedClaim(error) {
	 				console.log(error);
	 				itSelf.modifying = "";
	 				itSelf.redMessage = "Unable to Claim";
	 			}
	 			console.log("claim")
	 			restCall('POST', host + "api/job/claim/" + this.data.Id, null, successFulClaim, failedClaim);
	 		},
	 		stateUpdate: function (taskId, state, task) {	 			
	 			if (task === "PackagePickUp") this.modifying = "PackagePickUp_UPDATING"
	 			else if (task === "Delivery") this.modifying = "Delivery_UPDATING"
	 			else if (task === "SecureDelivery") this.modifying = "SecureDelivery_UPDATING"
	 			var itSelf = this;
	 			function stateUpdateSuccess(response) {
	 				itSelf.modifying = "";
	 				$window.location.reload();
	 			}
	 			function stateUpdateError(error) {
	 				console.log(error)
	 				itSelf.modifying = "FAILED";
	 				itSelf.redMessage = error.data.Message;
	 			}
	 			patchUpdate(state, "replace", "/State", "api/job/", this.data.Id, taskId, stateUpdateSuccess, stateUpdateError);
	 		},
	 		assigningAsset: function (assigning) {
	 			if (assigning) this.modifying = "FetchDeliveryMan_UPDATING";
	 			else this.modifying = "";
	 		},
	 		cancel: function (reason) {	 			
	 			this.modifying = "CANCELLING";
	 			var itSelf = this;
	 			$http({
	 				method: 'POST',
	 				url: host + 'api/job/cancel',
	 				data: {
	 					JobId: itSelf.data.Id,
	 					Reason: reason
	 				}
	 			}).then(function (response) {
	 				itSelf.modifying = "";
	 				$window.location.reload();
	 			}, function (error) {
	 				console.log(error);
	 				itSelf.modifying = "";
	 				itSelf.redMessage = error;
	 			})
	 		},
	 		restore: function () {
	 			this.modifying = "RESTORING";
	 			var itSelf = this;
	 			$http({
	 				method: 'POST',
	 				url: host + 'api/Job/restore/' + itSelf.data.Id
	 			}).then(function (response) {
	 				itSelf.modifying = "";
	 				$window.location.reload();
	 			}, function (error) {
	 				console.log(error);
	 				itSelf.modifying = "";
	 				itSelf.redMessage = error;
	 			})
	 		},
	 		mapZoomIn: function (coordinate) {
	 			
	 		},
	 		edit: function () {	 			
	 			$window.location.href = "#/order/create/" + this.data.HRID;
	 		},
	 		trackingLink: function () {
	 			
	 		},
	 		updatePaymentStatus: function () {
	 			this.modifying = "PAYMENT_UPDATING";
	 			$http({
	 				method: 'POST',
	 				url: host + 'api/payment/process/' + this.data.Id,
	 			}).then(function(response){
	 				this.modifying = "";
	 				$window.location.reload();
	 			}, function (error) {
	 				this.modifying = "";
	 				this.redMessage = error;
	 			})
	 		},
	 		getSantizedState: function (state) {
	 			return dashboardFactory.state(state);
	 		}
	 	}
	 }


	return {		 		
		job: job
	}
};
