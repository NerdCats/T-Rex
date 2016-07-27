app.factory('dashboardFactory', ['$http', '$window', '$interval', 'timeAgo', 'restCall', 'host', function($http, $window, $interval, timeAgo, restCall, host){

	var jobListUrlMaker = function (state, envelope, page, pageSize) {
		var path = "api/Job/odata?";
		var odataQUery = "$filter=State eq " + "'" + state + "'" + "&$orderby=CreateTime desc";	
		var jobListOdataUrl = host + path + odataQUery + "&envelope=" + envelope + "&page=" + page + "&pageSize=" + pageSize;		
		return jobListOdataUrl;
	};
	
	var populateOrdersTable = function(Orders, jobListUrl){
		function successCallback(response){
			// Orders.orders = [];
			// Orders.pages = [];
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
					User : value.User.UserName,
					PaymentStatus : value.PaymentStatus,
					CreateTime : value.CreateTime,
					RequestedAgo : timeAgo(value.CreateTime),
					JobState : function () {
						return State(value.State);	
					},
					PickUpState: function () {
						return State(value.Tasks[1].State);	
					},
					DeliveryState: function () {
						return State(value.Tasks[2].State);	
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

 		Orders.orders= [];
		Orders.pages = [];
		Orders.isCompleted = 'IN_PROGRESS';
 		restCall('GET', jobListUrl, null, successCallback, errorCallback);
	};

	var State = function (State) {
		if (State == "ENQUEUED") {
			return {
				value: "PENDING",
				class: "pending"
			};
		}
		else if (State == "PENDING") {
			return {
				value: "PENDING",
				class: "pending"
			};
		}
		else if (State == "IN_PROGRESS") {
			return {
				value: "IN PROGRESS",
				class: "in-progress"
			}
		}
		else if (State == "COMPLETED") {
			return {
				value: "COMPLETED",
				class: "completed"
			}
		}
		return State;
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
			perPageTotal: 0,
			pages:[],
			total: 0, 
			isCompleted : '',
			jobTime: '',			
			state: jobState,
			loadOrders: function () {
				this.isCompleted = 'IN_PROGRESS';
				getDate(this.jobTime)
				var pageUrl = jobListUrlMaker(jobState, true, 0, this.perPageTotal);				
				populateOrdersTable(this, pageUrl);
			},
			loadPage: function (pageNo) {			
				var pageUrl = jobListUrlMaker(this.state, true, pageNo, this.perPageTotal);
				console.log(pageNo);
				console.log(pageUrl);
				console.log(this);
				populateOrdersTable(this, pageUrl);
			},
			loadPrevPage: function () {
				console.log(this);
				console.log(this.pagination.PrevPage);
				if (prevPageUrl) {
					populateOrdersTable(this, this.pagination.PrevPage);
				}
			},
			loadNextPage: function () {
				console.log(this);
				console.log(this.pagination.NextPage);
				if (nextPageUrl) {
					populateOrdersTable(this, this.pagination.NextPage);			
				}
			}
		}
	};

	var getDate = function (day) {
		var thisDate = new Date().getDate();
		var thisMonth = new Date().getMonth();
		var thisYear = new Date().getFullYear();
						

		if (day == 'today') {			
			var toDay = new Date(thisYear, thisMonth, thisDate + 1).toISOString();			
			var nextDay = new Date(thisYear, thisMonth, thisDate + 2).toISOString();						
			return {
				day1: toDay,
				day2: nextDay
			}
		} else if (day == 'nextday') {
			var nextDay = new Date(thisYear, thisMonth, thisDate + 2).toISOString();			
			var nextnextDay = new Date(thisYear, thisMonth, thisDate + 3).toISOString();						
			return {
				day1: nextDay,
				day2: nextnextDay
			}
		}
		else return;
	}

	var autoRefresh;
	var startRefresh = function (Orders) {
		if (angular.isDefined(autoRefresh)) return;
		autoRefresh = $interval(function () {
			Orders.isCompleted = 'IN_PROGRESS';
			Orders.orders= [];
			Orders.pages = [];
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
		jobListUrlMaker : jobListUrlMaker,
		orders: orders,
		startRefresh: startRefresh,
		stopRefresh: stopRefresh
	};
}]);
