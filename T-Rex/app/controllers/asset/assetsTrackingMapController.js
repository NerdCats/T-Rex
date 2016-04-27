'use strict';


app.controller('assetsTrackingMapController', ['$scope', '$http' , '$window', 'mapFactory', 'host', 'tracking_host', assetsTrackingMapController]); 

function assetsTrackingMapController($scope, $http, $window, mapFactory, host, tracking_host) {
	var vm = this;
	vm.map = mapFactory.createMap(23.7968725, 90.4083922, "tracking-map", 15);
	vm.assetsList = [];
	vm.locateMarkerOnMap = mapFactory.locateMarkerOnMap;

	var getAllAssetUrl = host + "/api/account";
	$http.get(getAllAssetUrl).then(
		function assetListFound(response) {			
			vm.assetsList = response.data;
			angular.forEach(vm.assetsList, function (asset, key) {
				var getAssetLocationUrl = tracking_host + "/api/location/" + asset.Id;
				console.log(asset)
				$http.get(getAssetLocationUrl).then(
					function locationFound(response) {
						var assetLocation = response.data;
						var lat = assetLocation.point.coordinates[1];
						var lng = assetLocation.point.coordinates[0];
						var content = asset.UserName;
						var assetOverLay = mapFactory.createOverlay(lat, lng, content);

						asset.online = "online";
						asset.lat =  assetLocation.point.coordinates[1];
						asset.lng =  assetLocation.point.coordinates[0];
						asset.lastSeen = new Date( assetLocation.timestamp).toLocaleString();
					}, function locationNotFound(error) {
						asset.online = "offline"
					});
			});
		}, function assetListNotFound(error) {
			$window.location.reload();
		});
}