app.factory('orderFactory', ['$http', '$window', 'restCall', 'mapFactory', function($http, $window, restCall, mapFactory){
	
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
		restCall('POST', url, newOrder, successCallback, errorCallback);
		console.log(newOrder);
	};

	var populateVmCallback = function () {
			
	};

	var populateMap = function (map) {
		
		var createMarkersCallback = function (map) {
			var fromMarker = mapFactory.createMarker(23.345345, 90.239434, "From", true, "User is here", mapFactory.markerIconUri.greenMarker, map);
			mapFactory.markerDragEvent(fromMarker);
			var toMarker = mapFactory.createMarker(23.345345, 90.239434, "To", true, "User's destination", mapFactory.markerIconUri.redMarker, map);
			mapFactory.markerDragEvent(toMarker);
		};

		mapFactory.createMap(23,90, 'map', map, 16, createMarkersCallback);
	};

	return {
		hello : hello,
		createNewOrder : createNewOrder,
		populateMap : populateMap
	}
}]);