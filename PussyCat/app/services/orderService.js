app.factory('orderFactory', ['$http', 'restCall', 'mapFactory', function($http, restCall, mapFactory){
	
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

	var populateMap = function (map) {
		
		var createMarkersCallback = function (map) {
			
		}
		mapFactory.createMap(23,90, 'map', map, 16, createMarkersCallback);
	};

	return {
		hello : hello,
		createNewOrder : createNewOrder,
		populateMap : populateMap
	}
}]);