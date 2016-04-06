app.factory('dashboardFactory', ['$http', 'timeAgo', 'restCall', 'host', function($http, timeAgo, restCall, host){

	var jobListUrlMaker = function (state, envelope, page, pageSize) {
		var path = "api/Job/odata?";
		var odataQUery = "$filter=State eq " + "'" + state + "'" + "&$orderby=CreateTime desc";	
		var jobListOdataUrl = host + path + odataQUery + "&envelope=" + envelope + "&page=" + page + "pageSize=" + pageSize;		
		return jobListOdataUrl;
	};
	
	var populateOrdersTable = function(Orders, state, envelope, page, pageSize){

		var jobListUrl = jobListUrlMaker(state, envelope, page, pageSize);	
		function successCallback(response){
			var orders = response.data;
			angular.forEach(orders.data, function(value, key){
				try{
					var newOrder = {
						Id : value._id,
						Name : value.Name,
						Type : value.Order.Type,
						From : value.Order.From.Address,
						To : value.Order.To.Address,
						User : value.Order.User,
						RequestedAgo : timeAgo(value.CreateTime),
						State : value.State,
						Details : function(){
							$location.path('/details/'+ value._id);							
						}
					};
				} catch (e){
					var newOrder = {
						Id : value._id,
						Name : value.Name,
						Type : value.Order.Type,
						// this ridiculus things has been done to protect the app from 'From' 'To' null value, need to have a better mechanism
						User : value.Order.User,
						RequestedAgo : timeAgo(value.CreateTime),
						State : value.State,
						Details : function(){
							$location.path('/details/'+ value._id);							
						}
					};
				}				
				Orders.orders.push(newOrder);
			});						
			for (var i = 0; i < orders.pagination.TotalPages ; i++) {
				Orders.pages.push(i);
			};
 		};
 		function errorCallback(response) {
 			console.log(response);
 		}
 		restCall('GET', jobListUrl, null, successCallback, errorCallback);
	};

	var loadNextPage = function(Orders, state, envelope, page, pageSize){		
		// Orders.orders= [];
		// Orders.pages = [];
		populateOrdersTable(Orders, state, envelope, page, pageSize);
	};

	return {
		populateOrdersTable : populateOrdersTable,
		loadNextPage : loadNextPage
	};
}]);
