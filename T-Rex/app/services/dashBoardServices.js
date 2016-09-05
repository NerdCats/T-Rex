app.factory('dashboardFactory', ['$http', '$window', '$interval', 'timeAgo', 'restCall', 'odata', 'ngAuthSettings', dashboardFactory]);


function dashboardFactory($http, $window, $interval, timeAgo, restCall, odata, ngAuthSettings){
	
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
					Type : value.Order.Type,
					From : value.Order.From.Address,
					To : value.Order.To.Address,
					User : function () {
						var user = getProperWordWithCss(value.User.Type);
						user.value = value.User.UserName + " ("+ user.value + ")";
						return user;
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
		// else if (word == "PENDING") {
		// 	return {
		// 		value: "PENDING",
		// 		class: "pending"
		// 	};
		// }
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
		if (word == "USER") {
			return {
				value: "B2C",
				class: "b2c"
			}
		}
		if (word == "ENTERPRISE") {
			return {
				value: "B2B",
				class: "b2b"
			}
		}
		if (word == "Paid") {
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
			jobTime: function (jobTime) {				
				this.searchParam.startDate = getDate(jobTime).startDate;
				this.searchParam.endDate = getDate(jobTime).endDate;				
			},
			searchParam : {
				type: "Job",
				startDate : null,
				userId : null,
				endDate: null,
				UserName: null,
				jobState: jobState,
				orderby: {
					property : "CreateTime",
					orderbyCondition: "desc"
				},
				envelope: true,
				page: 0,
				pageSize: 10				
			},
			loadOrders: function () {
				// this.isCompleted = 'IN_PROGRESS';
				var pageUrl = odata.odataQueryMaker(this.searchParam);
				populateOrdersTable(this, pageUrl);
			},
			loadOrdersAssignedToAssets : function () {
				var pageUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/" + this.searchParam.userId + "/jobs?pageSize="+ this.searchParam.pageSize +"&page="+ this.searchParam.page +"&jobStateUpto="+ this.searchParam.jobState +"&sortDirection=Descending";
				populateOrdersTable(this, pageUrl);
			},
			loadPage: function (pageNo) {				
				this.searchParam.page = pageNo;
				// if there is an searchParam.userId, it means We need to load assigned jobs of an asset
				if (this.searchParam.userId) {
					this.loadOrdersAssignedToAssets();
				} else {
					this.loadOrders();					
				}
			},
			loadPrevPage: function () {
				console.log(this);
				console.log(this.pagination.PrevPage);
				if (this.pagination.PrevPage) {
					populateOrdersTable(this, this.pagination.PrevPage);
				}
			},
			loadNextPage: function () {
				console.log(this);
				console.log(this.pagination.NextPage);
				if (this.pagination.NextPage) {
					populateOrdersTable(this, this.pagination.NextPage);
				}
			}
		}
	};

	var getDate = function (day) {
		var thisDate = new Date().getDate();
		var thisMonth = new Date().getMonth();
		var thisYear = new Date().getFullYear();
		var dates = {
			startDate: null,
			endDate: null
		}	

		if (day == 'today') {			
			//FIXME:
			//not sure why there is T18 in ex: 2016-07-28T18:00:00.000Z ISO time string,
			//untill i find out, using this blant hack

			// dates.startDate = new Date(thisYear, thisMonth, thisDate + 1,0,0,0,0).toISOString();			
			// dates.endDate = new Date(thisYear, thisMonth, thisDate + 2,0,0,0,0).toISOString();

			dates.startDate = thisYear+"-0"+(thisMonth+1)+"-"+thisDate+"T00:00:00.000Z";
			dates.endDate = thisYear+"-0"+(thisMonth+1)+"-"+(thisDate+1)+"T00:00:00.000Z";
		} else if (day == 'nextday') {
			// dates.startDate = new Date(thisYear, thisMonth, thisDate + 2,0,0,0,0).toISOString();			
			// dates.endDate = new Date(thisYear, thisMonth, thisDate + 3,0,0,0,0).toISOString();
			dates.startDate = thisYear+"-0"+(thisMonth+1)+"-"+(thisDate+1)+"T00:00:00.000Z";
			dates.endDate = thisYear+"-0"+(thisMonth+1)+"-"+(thisDate+2)+"T00:00:00.000Z";
		}
		// console.log(day)
		// console.log(dates)
		return dates;
	}

	var autoRefresh;
	var startRefresh = function (Orders) {
		if (angular.isDefined(autoRefresh)) return;
		autoRefresh = $interval(function () {
			// Orders.isCompleted = 'IN_PROGRESS';
			// Orders.orders = [];
			// Orders.pages = [];
			Orders.loadOrders();	
		}, 60000);
	}
	

	var stopRefresh = function () {
		if (angular.isDefined(autoRefresh)) {			
			$interval.cancel(autoRefresh);
			autoRefresh = undefined;
		}
	}

	return {
		populateOrdersTable : populateOrdersTable,
		loadNextPage : loadNextPage,		
		orders: orders,
		startRefresh: startRefresh,
		stopRefresh: stopRefresh,
		getProperWordWithCss: getProperWordWithCss
	};
}


