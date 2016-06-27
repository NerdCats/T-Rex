app.factory('dashboardFactory', ['$http', '$window','timeAgo', 'restCall', 'host', function($http, $window, timeAgo, restCall, host){

	var jobListUrlMaker = function (state, envelope, page, pageSize) {
		var path = "api/Job/odata?";
		var odataQUery = "$filter=State eq " + "'" + state + "'" + "&$orderby=CreateTime desc";	
		var jobListOdataUrl = host + path + odataQUery + "&envelope=" + envelope + "&page=" + page + "pageSize=" + pageSize;		
		return jobListOdataUrl;
	};
	
	var populateOrdersTable = function(Orders, jobListUrl){
		
		function successCallback(response){
			Orders.orders = [];
			Orders.pages = [];
			var orders = response.data;
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
				Orders.pages.push(i);
			};
			Orders.total = orders.pagination.Total;
 		};
 		function errorCallback(response) {
 			console.log(response);
 		}
 		restCall('GET', jobListUrl, null, successCallback, errorCallback);
	};

	var loadNextPage = function(Orders, state, envelope, page, pageSize){		
		Orders.orders= [];
		Orders.pages = [];
		var jobListUrl = jobListUrlMaker(state, envelope, page, pageSize);	
		populateOrdersTable(Orders, jobListUrl);
	};

	return {
		populateOrdersTable : populateOrdersTable,
		loadNextPage : loadNextPage,
		jobListUrlMaker : jobListUrlMaker
	};
}]);
