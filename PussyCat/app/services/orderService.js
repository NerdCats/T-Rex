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
		var mapOptions = {
			zoom : 16,
			center : new google.maps.LatLng(23,90),
			mapTypeId : google.maps.MapTypeId.TERRAIN
		};
		map = new google.maps.Map(document.getElementById('map'), mapOptions);
		// var infoWindows = new google.maps.InfoWindow();

		// var create
	};

	return {
		hello : hello,
		createNewOrder : createNewOrder,
		populateMap : populateMap
	}
}]);