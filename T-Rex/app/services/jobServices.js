'use strict';

app.factory('jobFactory', ['tracking_host', 'host', 'listToString','mapFactory', '$window','$http',
	'$interval','templates','patchUpdate', 'restCall', 'COLOR', jobFactory]);
	
function jobFactory(tracking_host, host, listToString, mapFactory, $window, $http, $interval, templates, patchUpdate, restCall, COLOR){
	

	var getJob = function (id, data, jobIsLoading, redMessage) {
		
	}
	var job = function (id) {
	 	return {
	 		data : {},
	 		jobIsLoading: false,
	 		jobUpdating: false,
	 		redMessage : null,
	 		loadJob: function () {
				this.jobIsLoading = true;
				console.log(this.data)
				var itSelf = this;
				function successCallback(response) {
					itSelf.data = response.data;
					itSelf.jobIsLoading = false;
					console.log(itSelf);
				};
				function errorCallback(error) {
					itSelf.jobIsLoading = false;
					itSelf.redMessage = error;
				};
				restCall('GET', host + "api/job/" + id, null, successCallback, errorCallback);	 			
	 		},	 		
	 		claim: function () {
	 			
	 		},
	 		stateUpdate: function (taskId, value) {
	 			
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
	 			return state;
	 		},
	 		getStateCssClass: function (state) {
	 			return "pending";
	 		}
	 	}
	 }


	return {		 		
		 job: job,
		 getJob:getJob
	}
};
