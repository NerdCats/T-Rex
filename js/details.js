var app = angular.module('details', ['ngMaterial']);

app.controller('detailsController', function ($scope, $http) {
	console.log("Found You!!");
	var mapOptions = {
		zoom: 18,
		center: new google.maps.LatLng(23.797103, 90.408428),
		mapTypeId: google.maps.MapTypeId.TERRAIN
	}

	$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

	$scope.menus = ["Dashboard","Orders","Services","Customers","Agents","Preferences","Administration"];

	$http.get("http://localhost:23873/api/Job?id=56a5c7571510df254024dc59").then(function(response) {
		$scope.job = response.data;
		console.log($scope.job);
	})
});