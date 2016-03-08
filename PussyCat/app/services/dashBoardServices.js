app.factory('dashboardFactory', ['$http', 'timeAgo', function($http, timeAgo){

	var urlMaker = function (state, envelope, page, pageSize) {
		var host = "http://localhost:23873/api/Job/odata?";
		var odataQUery = "$filter=State eq " + "'" + state + "'";
		var envelope = envelope;
		var page = page;

		var url = host + odataQUery + "&envelope=" + envelope + "&page=" + page;
		console.log(url);
		return url;
	};
	
	var populateOrdersTable = function(Orders, state, envelope, page, pageSize){

		var url = urlMaker(state, envelope, page, pageSize);
		$http.get(url).then(function(response){			
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
							console.log("navigate to details : " + value._id);
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
							console.log("navigate to details : " + value._id);
						}
					};
				}				
				Orders.orders.push(newOrder);
			});
			console.log("Order : ");
			console.log(Orders);
			for (var i = 0; i < orders.pagination.TotalPages ; i++) {
				Orders.pages.push(i);
			};
 		});
	};

	var loadNextPage = function(Orders, state, envelope, page, pageSize){
		
		var url = urlMaker(state, envelope, page, pageSize);
		Orders.orders= [];
		Orders.pages = [];
		populateOrdersTable(Orders, state, envelope, page, pageSize);
	};

	return {
		populateOrdersTable : populateOrdersTable,
		loadNextPage : loadNextPage
	};
}]);
