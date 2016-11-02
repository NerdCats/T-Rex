'use strict';

app.factory('jobFactory', ['$http', 'tracking_host', 'ngAuthSettings', 'listToString', '$window',
	'patchUpdate', 'restCall', 'dashboardFactory', jobFactory]);
	
function jobFactory($http, tracking_host, ngAuthSettings, listToString, $window, 
	patchUpdate, restCall, dashboardFactory){
	

	var job = function (id) {
	 	return {
	 		data : {},
	 		jobIsLoading: "PENDING",
	 		jobUpdating: false,
	 		modifying: '',
	 		commentStatus: '',
	 		redMessage : null,
	 		comments: [],
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
					itSelf.redMessage = error.data.Message;
				};
				var jobUrl = ngAuthSettings.apiServiceBaseUri + "api/job/" + id;
				restCall('GET', jobUrl, null, successCallback, errorCallback);	 			
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
	 			restCall('POST', ngAuthSettings.apiServiceBaseUri + "api/job/claim/" + this.data.Id, null, successFulClaim, failedClaim);
	 		},
	 		stateUpdate: function (taskId, state, task) {
	 			if (task === "FetchDeliveryMan") this.modifying = "FetchDeliveryMan_UPDATING";
	 			else if (task === "PackagePickUp") this.modifying = "PackagePickUp_UPDATING";
	 			else if (task === "Delivery") this.modifying = "Delivery_UPDATING";
	 			else if (task === "SecureDelivery") this.modifying = "SecureDelivery_UPDATING";
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
	 				url: ngAuthSettings.apiServiceBaseUri + 'api/job/cancel',
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
	 				url: ngAuthSettings.apiServiceBaseUri + 'api/Job/restore/' + itSelf.data.Id
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
	 			this.modifying = 'PAYMENT_UPDATING';
	 			$http({
	 				method: 'POST',
	 				url: ngAuthSettings.apiServiceBaseUri + 'api/payment/process/' + this.data.Id,
	 			}).then(function(response){
	 				console.log(response);
	 				$window.location.reload();
	 			}, function (error) {
	 				this.modifying = "";
	 				this.redMessage = error;
	 			})
	 		},
	 		getSantizedState: function (state) {
	 			return dashboardFactory.getProperWordWithCss(state);
	 		},
	 		getComments : function (jobId) {
	 			var itSelf = this;	 			
	 			$http({
	 				method: 'GET',
	 				url: ngAuthSettings.apiServiceBaseUri + 'api/Comment/Job/' + jobId
	 			}).then(function (response) {	 				
	 				itSelf.comments = response.data.data.reverse();	 				
	 				itSelf.commentStatus = '';
	 				console.log(itSelf.comments)
	 			}, function (error) {
	 				itSelf.commentStatus = 'COMMENTI_LOADING_FAILED';
	 				console.log(error);
	 			})
	 		},
	 		postComment : function (comment) {
	 			var itSelf = this;
	 			itSelf.commentStatus = 'COMMENTI_MODIFYING';
	 			$http({
	 				method: 'POST',
	 				url: ngAuthSettings.apiServiceBaseUri + 'api/Comment',
	 				data: {
						RefId: itSelf.data.HRID,
						EntityType: 'Job',
						CommentText: comment
					}
	 			}).then(function (response) {
	 				itSelf.getComments(itSelf.data.HRID);
	 				itSelf.commentStatus = '';
	 			}, function (error) {
	 				itSelf.commentStatus = '';
	 				alert("Couldn't add comment, server error!");
	 			})
	 		},
	 		deleteComment : function (commentId) {
	 			console.log(commentId)
	 			var itSelf = this;
	 			itSelf.commentStatus = 'COMMENTI_MODIFYING';
	 			$http({
	 				method: 'DELETE',
	 				url: ngAuthSettings.apiServiceBaseUri + 'api/Comment/' + commentId,
	 			}).then(function (response) {
	 				itSelf.commentStatus = '';
	 				itSelf.getComments(itSelf.data.HRID);
	 			}, function (error) {
	 				alert("Sorry, couldn't delete : " + error.Message);
	 				itSelf.commentStatus = '';
	 			})
	 		}
	 	}
	 }


	return {		 		
		job: job
	}
};
