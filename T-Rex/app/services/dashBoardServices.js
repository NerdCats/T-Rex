app.factory('dashboardFactory', ['$http', '$window','timeAgo', 'restCall', 'host', function($http, $window, timeAgo, restCall, host){

	var jobListUrlMaker = function (state, envelope, page, pageSize) {
		var path = "api/Job/odata?";
		var odataQUery = "$filter=State eq " + "'" + state + "'" + "&$orderby=CreateTime desc";	
		var jobListOdataUrl = host + path + odataQUery + "&envelope=" + envelope + "&page=" + page + "&pageSize=" + pageSize;		
		return jobListOdataUrl;
	};
	
	var populateOrdersTable = function(Orders, jobListUrl){
		console.log(Orders);
		function successCallback(response){
			// Orders.orders = [];
			// Orders.pages = [];
			Orders.isCompleted = 'SUCCESSFULL';
			var orders = response.data;			
			if (orders.data.length == 0) {
				Orders.isCompleted = 'EMPTY';
			}
			console.log(response)
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
					RequestedAgo : timeAgo(value.CreateTime),
					State : function () {
						if (value.State == "IN_PROGRESS") {
							return "IN PROGRESS";
						}
						return value.State;
					},
					Details : function(){
						$window.location.href = '#/job/'+ value.HRID;
					}
				};			 	
				Orders.orders.push(newOrder);
			});				
			for (var i = 0; i < orders.pagination.TotalPages ; i++) {
				var page = {
					pageNo : i,
					isCurrentPage : ""
				}
				if (orders.pagination.Page == i) {
					page.isCurrentPage = "active" // current page css class set on pagination list item
				}
				Orders.pages.push(page);
			};
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

	var loadNextPage = function(Orders, nextPageUrl){		
		populateOrdersTable(Orders, nextPageUrl);
	};

	return {
		populateOrdersTable : populateOrdersTable,
		loadNextPage : loadNextPage,
		jobListUrlMaker : jobListUrlMaker
	};
}]);
