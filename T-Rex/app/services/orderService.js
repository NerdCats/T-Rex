app.factory('orderFactory', ['$http', '$window', 'restCall', 'mapFactory', 'host', function($http, $window, restCall, mapFactory, host){
	
	var hello = "hello tareq!";

	var createNewOrder = function (newOrder) {
		
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
		};

		var createNewOrderUrl = host + "api/Order/";
		restCall('POST', createNewOrderUrl, newOrder, successCallback, errorCallback);
	};

	return {
		hello : hello,
		createNewOrder : createNewOrder,		
	}
}]);