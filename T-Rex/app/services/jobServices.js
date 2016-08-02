'use strict';

app.factory('jobFactory', ['tracking_host', 'host', 'listToString','mapFactory', '$window','$http',
	'$interval','templates','patchUpdate', 'restCall', 'COLOR', 'dashboardFactory', jobFactory]);
	
function jobFactory(tracking_host, host, listToString, mapFactory, $window, $http, 
	$interval, templates, patchUpdate, restCall, COLOR, dashboardFactory){
	

	var job = function (id) {
	 	return {
	 		data : {},
	 		jobIsLoading: "PENDING",
	 		jobUpdating: false,
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
	 			
	 		},
	 		stateUpdate: function (taskId, state) {
	 			function stateUpdateSuccess(response) {
	 				$window.location.reload();
	 			}
	 			function stateUpdateError(error) {
	 				this.redMessage = error.message;
	 			}
	 			patchUpdate(state, "replace", "/State", "api/job/", this.data.Id, taskId, stateUpdateSuccess, stateUpdateError);
	 		},
	 		assignAsset: function (assetRef) {
	 			
	 		},
	 		cancel: function (reason) {
	 			
	 		},
	 		restore: function () {
	 			
	 		},
	 		getInvoice: function () {
	 			
	 		},
	 		mapZoomIn: function (coordinate) {
	 			
	 		},
	 		edit: function () {
	 			
	 		},
	 		trackingLink: function () {
	 			
	 		},
	 		updatePaymentStatus: function () {
	 			
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
