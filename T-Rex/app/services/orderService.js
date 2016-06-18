app.factory('orderFactory', ['$http', '$window', 'restCall', 'mapFactory', 'host', function($http, $window, restCall, mapFactory, host){
		
	var createNewOrder = function (newOrder, ordersIsBeingCreated) {
		ordersIsBeingCreated = true;
		var successCallback = function (response) {
			console.log("success : ");
			console.log(response);
			alert("success");
			$window.location.href = '#/';
		};
		
		var errorCallback = function error(response) {
			console.log("error : ");
			console.log(response);
			alert("error");
			ordersIsBeingCreated = false;
		};

		var createNewOrderUrl = host + "api/Order/";
		restCall('POST', createNewOrderUrl, newOrder, successCallback, errorCallback);
	};

	return {		
		createNewOrder : createNewOrder,		
	}
}]);