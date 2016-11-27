app.factory('dashboardFactory', ['$http', '$window', '$interval', 'timeAgo', 'restCall', 'queryService', 'ngAuthSettings', dashboardFactory]);


function dashboardFactory($http, $window, $interval, timeAgo, restCall, queryService, ngAuthSettings){
	
	var getUserNameList = function (type, Users) {
		function success(response) {
			// Users.push("all");
			angular.forEach(response.data.data, function (value, keys) {
				Users.push(value.UserName);
			});			
		}
		function error(error) {
			console.log(error);
		}
		var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/odata?$filter=Type eq '"+ type +"'&pageSize=50&$select=UserName";
		restCall('GET', getUsersUrl, null, success, error);
	}

	var getDeliveryType = function (value) {		
		if (!value.hasOwnProperty("Order")) {			
			return "";
		}
		if (value.Order.Type === "ClassifiedDelivery" && value.Order.Variant === "default") {
			return "B2B + Cash Delivery";
		} 
		if (value.Order.Type === "ClassifiedDelivery" && value.Order.Variant === "Enterprise" && value.User.UserName === "B2C") {
			return "B2C Delivery"
		} 
		if (value.Order.Type === "ClassifiedDelivery" && value.Order.Variant === "Enterprise") {
			return "B2B Delivery";
		} 
		if (value.Order.Type === "Delivery") {			
			return "B2B Delivery";
		} 
		return "Delivery"		
	}

	var populateOrdersTable = function(Orders, jobListUrl){
		function successCallback(response){
			Orders.data = [];
			Orders.pages = [];
			Orders.isCompleted = 'SUCCESSFULL';
			var orders = response.data;
			if (orders.data.length == 0) {
				Orders.isCompleted = 'EMPTY';
			}
			if (response.data.pagination) {				
				Orders.pagination = response.data.pagination;
			}
			angular.forEach(orders.data, function(value, key){
				var newOrder = {
					data: value,					
					Type :  function(){
						if (value.Order.Type === "ClassifiedDelivery" && value.Order.Variant === "default") {
							return "B2B + Cash Delivery";
						} else if (value.Order.Type === "ClassifiedDelivery" && value.Order.Variant === "Enterprise") {
							return "B2B Delivery";
						}
					},					
					isAssigningPickUpAsset : false,
					isAssigningDeliveryAsset : false,
					isAssigningSecureCashDeliveryAsset : false,					
					ETA : function () {
						var eta = "";
						if (value.Order.ETA) {
							eta += "ETA : " + new Date(value.Order.ETA).toUTCString("EEE MMM d, y h:mm:ss a") + " *** ";
						}
						if (value.Order.JobTaskETAPreference) {
							angular.forEach(value.Order.JobTaskETAPreference, function (etaTime, index) {								
								eta += etaTime.Type + " : " + new Date(etaTime.ETA).toUTCString("EEE MMM d, y h:mm:ss a") + " *** ";
							});
						}
						return eta;
					},
					PackageDescription: function () {
						var description = "";
						angular.forEach(value.Order.OrderCart.PackageList, function (item, index) {
							description += item.Item + "\n";
						});
						return description;
					},					
					RequestedAgo : timeAgo(value.CreateTime)
				};			 	
				Orders.data.push(newOrder);
			});
			if (orders.pagination.TotalPages > 1) {
				for (var i = 0; i < orders.pagination.TotalPages ; i++) {
					var page = {
						pageNo : i,
						isCurrentPage : ""
					}
					if (orders.pagination.Page == i) {
						page.isCurrentPage = "selected-page" // current page css class set on pagination list item
					}
					Orders.pages.push(page);
				};	
			}
			
			Orders.total = orders.pagination.Total;
 		};
 		function errorCallback(response) {
 			 Orders.isCompleted = 'FAILED';
 		}

 		// Orders.data = [];
		// Orders.pages = [];
		// Orders.isCompleted = 'IN_PROGRESS';
 		restCall('GET', jobListUrl, null, successCallback, errorCallback);
	};

	var getProperWordWithCss = function (word) {
		if (word == "ENQUEUED" || word == "PENDING" || word == "Pending") {
			return {
				value: "PENDING",
				class: "pending"
			};
		}
		else if (word == "IN_PROGRESS") {
			return {
				value: "IN PROGRESS",
				class: "in-progress"
			}
		}
		else if (word == "COMPLETED") {
			return {
				value: "COMPLETED",
				class: "completed"
			}
		}
		else if (word == "CANCELLED") {
			return {
				value: "CANCELLED",
				class: "cancelled"
			}
		}
		else if (word == "USER") {
			return {
				value: "B2C",
				class: "b2c"
			}
		}
		else if (word == "ENTERPRISE") {
			return {
				value: "B2B",
				class: "b2b"
			}
		}
		else if (word == "BIKE_MESSENGER") {
			return {
				value: "Asset",
				class: "b2c"
			}
		}
		else if (word == "Paid") {
			return {
				value: "PAID",
				class: "completed"
			}
		}
		return {
			value: "N/A",
			class: "not-applicable"
		};
	}

	var loadNextPage = function(Orders, nextPageUrl){		
		populateOrdersTable(Orders, nextPageUrl);
	};

	// the isCompleted value of the orders has 4 states IN_PROGRESS, SUCCESSFULL, EMPTY, FAILED
	// these states indicates the http request's state and content of the page
	var orders = function (jobState) {
		return {
			data: [], 
			pagination: null,
			pages:[],
			total: 0, 
			isCompleted : '',			
			searchParam : {
				type: "Job",
				userId : null,
				UserName : null,
				CreateTime : {
					startDate : null,
					endDate : null,
				},
				DeliveryArea: null,
				PickupArea: null,
				CompletionTime : {
					startDate : null,
					endDate : null,
				},
				jobState : jobState,
				orderby : {
					property : "CreateTime",
					orderbyCondition : "desc"
				},
				envelope: true,
				page: 0,
				pageSize: 50				
			},
			getProperWordWithCss : function (word) {
				return getProperWordWithCss(word);
			},
			loadOrders: function () {				
				var pageUrl;
				// if there is an searchParam.userId, it means We need to load assigned jobs of an asset
				if (this.searchParam.userId) {
					pageUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/" + this.searchParam.userId + "/jobs?pageSize="+ this.searchParam.pageSize +"&page="+ this.searchParam.page +"&sortDirection=Descending";
				} else {
					pageUrl = queryService.getOdataQuery(this.searchParam);
				}
				populateOrdersTable(this, pageUrl);
			},
			loadPage: function (pageNo) {
				this.isCompleted = 'IN_PROGRESS';		
				this.searchParam.page = pageNo;				
				this.loadOrders();			
			},
			loadPrevPage: function () {
				this.isCompleted = 'IN_PROGRESS';
				console.log(this);
				console.log(this.pagination.PrevPage);
				if (this.pagination.PrevPage) {
					populateOrdersTable(this, this.pagination.PrevPage);
				}
			},
			loadNextPage: function () {
				this.isCompleted = 'IN_PROGRESS';
				console.log(this);
				console.log(this.pagination.NextPage);
				if (this.pagination.NextPage) {
					populateOrdersTable(this, this.pagination.NextPage);
				}
			},
			assign: {
				showPickupAssign: false,
				showdeliveryAssign: false,
				showsecuredeliveryAssign: false,
				assetRef: null				
			},
			assignAssetToTask: function (jobid, taskid, index, orders) {
				function isAssigningAsset(flag, taskid, index, orders) {
					angular.forEach(orders.data[index].data.Tasks, function (task, key) {
						if (task.id === taskid && key === 1) {
							orders.data[index].isAssigningPickUpAsset = flag;						
						}
						else if (task.id === taskid && key === 2) {
							orders.data[index].isAssigningDeliveryAsset = flag;													
						}
						else if (task.id === taskid && key === 3) {
							orders.data[index].isAssigningSecureCashDeliveryAsset = flag;
						}
					})
				}
				
				var assetAssignUrl = ngAuthSettings.apiServiceBaseUri + "api/job/" + jobid + "/" + taskid;
				var jobUrl = ngAuthSettings.apiServiceBaseUri + "api/job/" + orders.data[index].data.HRID;
				var value = [{value: this.assign.assetRef, path: "/AssetRef", op: "replace"}, {value: "IN_PROGRESS", path: "/State", op: "replace"}];				
				console.log(value)
				isAssigningAsset(true, taskid, index, orders);
				$http({
					method: "PATCH",
					url: assetAssignUrl,
					data: value
				}).then(function (response) {
					console.log(response)
					// $window.location.reload();
					$http({
						method: "GET",
						url: jobUrl
					}).then(function (response) {
						orders.data[index].data = response.data;			
						isAssigningAsset(false, taskid, index, orders);
					}, function (error) {					
						console.log(error);
					})
					isAssigningAsset(false, taskid, index, orders);
				}, function (error) {
					console.log(error);
					isAssigningAsset(false, taskid, index, orders);				
				})

			}
		}
	};	 

	var autoRefresh;
	var startRefresh = function (Orders) {
		if (angular.isDefined(autoRefresh)) return;
		autoRefresh = $interval(function () {			
			Orders.loadOrders();	
		}, 60000);
	}
	

	var stopRefresh = function () {
		if (angular.isDefined(autoRefresh)) {			
			$interval.cancel(autoRefresh);
			autoRefresh = undefined;
		}
	}

	var getIsoDate = function (date, hour, min, sec) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, min, sec).toISOString();
	}

	return {
		getUserNameList : getUserNameList,
		populateOrdersTable : populateOrdersTable,
		loadNextPage : loadNextPage,		
		orders: orders,
		startRefresh: startRefresh,
		stopRefresh: stopRefresh,
		getProperWordWithCss: getProperWordWithCss,
		getIsoDate: getIsoDate,
		getDeliveryType: getDeliveryType
	};
}


