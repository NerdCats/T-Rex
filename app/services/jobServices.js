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
				restCall('GET', jobUrl1, null, successCallback, errorCallback);
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
	 			if (task === "FetchDeliveryMan") {
	 				this.modifying = "FetchDeliveryMan_UPDATING";
	 				patchUpdate(state, "replace", "/State", "api/job/", this.data.Id, taskId, stateUpdateSuccess, stateUpdateError);
	 			}
	 			else if (task === "PackagePickUp") {
	 				this.modifying = "PackagePickUp_UPDATING";
	 				patchUpdate(state, "replace", "/State", "api/job/", this.data.Id, taskId, stateUpdateSuccess, stateUpdateError);
	 			}
	 			else if (task === "Delivery") {
	 				this.modifying = "Delivery_UPDATING";
	 				if (this.data.Tasks[3] === undefined) {
	 					function _stateUpdateSuccess(response) {
			 				itSelf.modifying = "";
			 				patchUpdate(state, "replace", "/State", "api/job/", itSelf.data.Id, taskId, stateUpdateSuccess, stateUpdateError);
			 			}	 					
	 					patchUpdate(state, "replace", "/State", "api/job/", this.data.Id, this.data.Tasks[0].id, _stateUpdateSuccess, stateUpdateError);
	 				} else {
	 					patchUpdate(state, "replace", "/State", "api/job/", this.data.Id, taskId, stateUpdateSuccess, stateUpdateError);
	 				}
	 			}
	 			else if (task === "SecureDelivery") {
	 				this.modifying = "SecureDelivery_UPDATING";
	 				function _stateUpdateSuccess(response) {
		 				itSelf.modifying = "";
		 				patchUpdate(state, "replace", "/State", "api/job/", itSelf.data.Id, taskId, stateUpdateSuccess, stateUpdateError);
		 			}	
	 				patchUpdate(state, "replace", "/State", "api/job/", this.data.Id, this.data.Tasks[0].id, _stateUpdateSuccess, stateUpdateError);
	 			}
	 			
	 		},
	 		assigningAsset: function (taskIndex) {
	 			if (taskIndex === 0) this.modifying = "FetchDeliveryMan_UPDATING";
	 			else if (taskIndex === 1) {
	 				this.modifying = "PackagePickUp_UPDATING";
	 				// Whenver we are assigning asset to pick up task, this task should go to in progress state
	 				this.stateUpdate(this.data.Tasks[1].id, "IN_PROGRESS", "PackagePickUp");
	 			}
	 			else if (taskIndex === 2) this.modifying = "Delivery_UPDATING";
	 			else if (taskIndex === 3) this.modifying = "SecureDelivery_UPDATING";
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
