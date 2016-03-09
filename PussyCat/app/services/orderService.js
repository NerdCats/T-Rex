app.factory('orderFactory', ['$http', 'restCall', function($http, restCall){
	
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

  		var url = "http://localhost:23873/api/Order/";
		//restCall('POST', url, newOrder, successCallback, errorCallback);
		console.log(newOrder);
	};

	return {
		hello : hello,
		createNewOrder : createNewOrder
	}
}]);