angular.module('app').factory('populateOrdersTable', function ($http, timeAgo) {
	return function(url, Orders, state){
		$http.get(url).then(function(response){			
			var orders = response.data;
			angular.forEach(orders.data, function(value, key){
				console.log(value._id);
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

				if (value.State == state)
					Orders.orders.push(newOrder);
			});
			console.log("Order : ");
			console.log(Orders);
			for (var i = 0; i < orders.pagination.TotalPages ; i++) {
				Orders.pages.push(i);
			};
 		});
	};
});

angular.module('app').factory('loadNextPage', function(populateOrdersTable) {
	return function(Orders, page,state){
		var host = "http://localhost:23873/api/Job?";
		var parameter = "envelope=true&page="+page;
		var url = host + parameter;
		Orders.orders= [];
		Orders.pages = [];
		populateOrdersTable(url, Orders, state);
	};
});