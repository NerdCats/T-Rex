app.factory('dashboardFactory', ['$http', '$window', '$interval', 'timeAgo', 'restCall', 'queryService', 'ngAuthSettings', dashboardFactory]);


function dashboardFactory($http, $window, $interval, timeAgo, restCall, queryService, ngAuthSettings){
	
	var getUserNameList = function (type, Users) {
		function success(response) {
			Users.push("all");
			angular.forEach(response.data.data, function (value, keys) {
				Users.push(value.UserName);
			});			
		}
		function error(error) {
			console.log(error);
		}
		var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/odata?$filter=Type eq '"+ type +"'&PageSize=50";
		restCall('GET', getUsersUrl, null, success, error);
	}

	var populateOrdersTable = function(Orders, jobListUrl){
		function successCallback(response){
			Orders.orders = [];
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
					Id : value.HRID,
					Name : value.Name,					
					Type :  function(){
						if (value.Order.Type === "ClassifiedDelivery" && value.Order.Variant === "default") {
							return "3rd Party Delivery";
						} else if (value.Order.Type === "ClassifiedDelivery" && value.Order.Variant === "Enterprise") {
							return "B2B Delivery";
						}
					},
					FromArea: value.Order.From.Locality,
					ToArea: value.Order.To.Locality,
					From : value.Order.From.Address,
					To : value.Order.To.Address,
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
					TotalToPay: value.Order.OrderCart.TotalToPay,
					NoteToDeliveryMan: value.Order.NoteToDeliveryMan,
					User : function () {
						var user = getProperWordWithCss(value.User.Type);
						user.value = value.User.UserName;// + " ("+ user.value + ")";
						return user;
					},
					Assets: function () {						
						return Object.keys(value.Assets).map(function(id, index){ return value.Assets[id] } )
					},
					PaymentStatus : getProperWordWithCss(value.PaymentStatus),
					CreateTime : value.CreateTime,
					RequestedAgo : timeAgo(value.CreateTime),
					JobState : function () {
						return getProperWordWithCss(value.State);	
					},
					PickUpState: function () {
						return getProperWordWithCss(value.Tasks[1].State);
					},
					DeliveryState: function () {
						return getProperWordWithCss(value.Tasks[2].State);	
					},
					SecureDeliveryState: function () {
						if (value.Tasks[3]) {
							return getProperWordWithCss(value.Tasks[3].State);
						}
						return {value: "N/A", class: "not-applicable"};
					},
					Details : function(){
						$window.location.href = '#/job/'+ value.HRID;
					}
				};			 	
				Orders.orders.push(newOrder);
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

 		// Orders.orders = [];
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
		return word;
	}

	var loadNextPage = function(Orders, nextPageUrl){		
		populateOrdersTable(Orders, nextPageUrl);
	};

	// the isCompleted value of the orders has 4 states IN_PROGRESS, SUCCESSFULL, EMPTY, FAILED
	// these states indicates the http request's state and content of the page
	var orders = function (jobState) {
		return {
			orders: [], 
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
			loadOrders: function () {				
				var pageUrl;
				// if there is an searchParam.userId, it means We need to load assigned jobs of an asset
				if (this.searchParam.userId) {
					pageUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/" + this.searchParam.userId + "/jobs?pageSize="+ this.searchParam.pageSize +"&page="+ this.searchParam.page +"&jobStateUpto="+ this.searchParam.jobState +"&sortDirection=Descending";
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
		getIsoDate: getIsoDate
	};
}


