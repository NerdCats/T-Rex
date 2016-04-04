app.factory('dashboardFactory', ['$http', 'timeAgo', 'restCall', function($http, timeAgo, restCall){

	var jobListPathMaker = function (state, envelope, page, pageSize) {
		var path = "/api/Job/odata?";
		var odataQUery = "$filter=State eq " + "'" + state + "'" + "&$orderby=CreateTime desc";

		var envelope = envelope;
		var page = page;
		
		path = path + odataQUery + "&envelope=" + envelope + "&page=" + page;		
		return path;
	};
	
	var populateOrdersTable = function(Orders, state, envelope, page, pageSize){

		var jobListPath = jobListPathMaker(state, envelope, page, pageSize);	
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
 		restCall('GET', jobListPath, null, successCallback);
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
