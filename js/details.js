var app = angular.module('details', ['ngMaterial']);

app.controller('detailsController', function ($scope, $http) {

	//menu options
	$scope.menus = ["Dashboard","Orders","Services","Customers","Agents","Preferences","Administration"];

	//get jobs json
	$http.get("http://localhost:23873/api/Job?id=56a5c7571510df254024dc59").then(function(response) {
		$scope.job = response.data;
		console.log($scope.job);

		$scope.usersLocation = {
			user : $scope.job.User,
			lat : $scope.job.Order.From.Point.coordinates[1],
			lng : $scope.job.Order.From.Point.coordinates[0],
			desc : $scope.job.Name
		};
		

		console.log($scope.usersLocation);
		var mapOptions = {
			zoom: 18,
			center: new google.maps.LatLng($scope.usersLocation.lat, $scope.usersLocation.lng),
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};

		

		//create map
		$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
		$scope.markers = [];

		var infoWindow = new google.maps.InfoWindow();
		var createMarker = function (info){
			var marker = new google.maps.Marker({
			  	map: $scope.map,
			  	position: new google.maps.LatLng(info.lat, info.lng),
			  	title: info.user
			});
			marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

			google.maps.event.addListener(marker, 'click', function(){
			  	infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
			  	infoWindow.open($scope.map, marker);
			});
			$scope.markers.push(marker);
		}
		
		createMarker($scope.usersLocation);
	});

});