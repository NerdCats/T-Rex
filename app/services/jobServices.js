'use strict';

app.factory('jobFactory', ['$http', 'tracking_host', 'ngAuthSettings', 'listToString', '$window',
	'patchUpdate', 'restCall', 'dashboardFactory', jobFactory]);
	
function jobFactory($http, tracking_host, ngAuthSettings, listToString, $window, 
	patchUpdate, restCall, dashboardFactory){
	

	var job = function (id) {
	 	return {
	 		data : {},
	 		loadingPage: false,
	 		jobIsLoading: "PENDING",
	 		jobUpdating: false,	 		
	 		redMessage : null,
	 		commentStatus: '',
	 		CommentText: "",
	 		comments: [],
	 		loadJob: function () {
				this.jobIsLoading = "INPROGRESS";				
				var jobUrl = ngAuthSettings.apiServiceBaseUri + "api/job/" + id;				
				var itSelf = this;
				function successCallback(response) {
					console.log(response)
					itSelf.data = response.data;
					itSelf.jobIsLoading = "COMPLETED";					
					console.log(itSelf);
				};
				function errorCallback(error) {
					itSelf.jobIsLoading = "FAILED";
					console.log(error)
					itSelf.redMessage = error.data.Message;
				};
				restCall('GET', jobUrl, null, successCallback, errorCallback);
	 		},
	 		claim: function () {
	 			var itSelf = this;	 			
	 			itSelf.loadingPage = true;
	 			function successFulClaim(response) {
	 				console.log(response);	 					 				
	 				itSelf.loadingPage = false;
					itSelf.loadJob();
	 			}
	 			function failedClaim(error) {
	 				console.log(error);	 				
	 				itSelf.redMessage = "Unable to Claim";
	 			}
	 			console.log("claim")
	 			restCall('POST', ngAuthSettings.apiServiceBaseUri + "api/job/claim/" + this.data.Id, null, successFulClaim, failedClaim);
	 		},
	 		taskTitle: function (taskType, variant) {	 			 		
	 			if (taskType === "Delivery") {
	 				switch(variant){
	 					case "default":
	 						return  taskType + " to " + "Recipient";
	 						break;
	 					case "retry":
	 						return  "Retry" + " " + taskType + " to " + "Recipient";
	 						break;
	 					case "return":
	 						return  "Return" + " " + taskType + " to " + "Owner";
	 						break;
	 					default:
	 						return  taskType;
	 						break;
	 				}
	 			}
	 			else {
	 				return taskType;
	 			}
	 		},
	 		stateUpdate: function (task, state) {
	 			var itSelf = this;
	 			itSelf.loadingPage = true;
	 			var taskUpdate = [
				    {
						value: state,
						path: "/State",
						op: "replace"
				    }
				];				
				var url = ngAuthSettings.apiServiceBaseUri + "api/job/" + this.data.Id + "/" + task.id;
	 			$http({
	 				method: 'PATCH',
	 				url: url,
	 				data: taskUpdate
	 			}).then(function (success) {	 				
	 				itSelf.loadingPage = false;
					itSelf.loadJob();
	 			}, function (error) {
	 				console.log(error);
	 				itSelf.redMessage = error.Message;
	 			});
	 		},
	 		assigningAsset: function (taskId, assetId) {
	 			var itSelf = this;
				var url = ngAuthSettings.apiServiceBaseUri + "api/job/" + this.data.Id + "/" + taskId;
				var assetRefUpdateData = [{value: assetId, path: "/AssetRef",op: "replace"}];
				itSelf.loadingPage = true;		
				$http({
					method: 'PATCH',
					url: url,
					data: assetRefUpdateData
				}).then(function (response) {					
					itSelf.loadingPage = false;
					itSelf.loadJob();
				}, function (error) {
					itSelf.redMessage = error.Message;
					itSelf.loadingPage = false;
				})	 			
	 		},
	 		cancel: function (reason) {	 				 			
	 			var itSelf = this;
	 			itSelf.loadingPage = true;
	 			$http({
	 				method: 'POST',
	 				url: ngAuthSettings.apiServiceBaseUri + 'api/job/cancel',
	 				data: {
	 					JobId: itSelf.data.Id,
	 					Reason: reason
	 				}
	 			}).then(function (response) {	 					 				
	 				itSelf.loadingPage = false;
					itSelf.loadJob();
	 			}, function (error) {
	 				console.log(error);	 				
	 				itSelf.redMessage = error;
	 			})
	 		},
	 		restore: function () {	 			
	 			var itSelf = this;
	 			itSelf.loadingPage = true;
	 			$http({
	 				method: 'POST',
	 				url: ngAuthSettings.apiServiceBaseUri + 'api/Job/restore/' + itSelf.data.Id
	 			}).then(function (response) {	 					 				
	 				itSelf.loadingPage = false;
					itSelf.loadJob();
	 			}, function (error) {
	 				console.log(error);	 				
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
	 			var itSelf = this;	 			
	 			itSelf.loadingPage = true;
	 			$http({
	 				method: 'POST',
	 				url: ngAuthSettings.apiServiceBaseUri + 'api/payment/process/' + this.data.Id,
	 			}).then(function(response){
	 				console.log(response);	 				
	 				itSelf.loadingPage = false;
					itSelf.loadJob();
	 			}, function (error) {	 				
	 				this.redMessage = error.Message;
	 				itSelf.loadingPage = false;
	 			})
	 		},
	 		getSantizedState: function (state) {
	 			return dashboardFactory.getProperWordWithCss(state);
	 		},
	 		getDeliveryType: function () {
	 			return dashboardFactory.getDeliveryType(this.data);
	 		},
	 		getComments : function (jobId) {
	 			var itSelf = this;
	 			itSelf.loadingPage = true;
	 			$http({
	 				method: 'GET',
	 				url: ngAuthSettings.apiServiceBaseUri + 'api/Comment/Job/' + jobId
	 			}).then(function (response) {	 				
	 				itSelf.comments = response.data.data.reverse();	 					 				
	 				itSelf.loadingPage = false;					
	 			}, function (error) {	 				
	 				console.log(error);
	 				itSelf.redMessage = error.Message;
	 				itSelf.loadingPage = false;
	 			})
	 		},
	 		postComment : function () {
	 			var itSelf = this;
	 			itSelf.loadingPage = true;
	 			$http({
	 				method: 'POST',
	 				url: ngAuthSettings.apiServiceBaseUri + 'api/Comment',
	 				data: {
						RefId: itSelf.data.HRID,
						EntityType: 'Job',
						CommentText: itSelf.CommentText
					}
	 			}).then(function (response) {
	 				itSelf.CommentText = "";
	 				itSelf.loadingPage = false;
	 				itSelf.getComments(itSelf.data.HRID);					
	 			}, function (error) {	 		
		 			itSelf.loadingPage = false;		
	 				itSelf.redMessage = error.Message;
	 			})
	 		},
	 		deleteComment : function (commentId) {	 			
	 			var itSelf = this;
	 			itSelf.loadingPage = true;
	 			$http({
	 				method: 'DELETE',
	 				url: ngAuthSettings.apiServiceBaseUri + 'api/Comment/' + commentId,
	 			}).then(function (response) {	 				
	 				itSelf.loadingPage = false;					
	 				itSelf.getComments(itSelf.data.HRID);
	 			}, function (error) {
	 				itSelf.redMessage = error.Message;
	 				itSelf.loadingPage = false;
	 			})
	 		},	 			 		
	 		updateComment : function (comment) {	 			
	 			var itSelf = this;
	 			itSelf.loadingPage = true;
	 			$http({
	 				method: 'PUT',
	 				url: ngAuthSettings.apiServiceBaseUri + 'api/Comment/',
	 				data: comment
	 			}).then(function (response) {	 					 				
	 				itSelf.loadingPage = false;					
	 				itSelf.getComments(itSelf.data.HRID);
	 			}, function (error) {	 				
	 				itSelf.redMessage = error.Message;
	 				itSelf.loadingPage = false;
	 			})	
	 		}
	 	}
	 }
	 
	return {		 		
		job: job
	}
};
