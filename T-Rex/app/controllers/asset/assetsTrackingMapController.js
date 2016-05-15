'use strict';


app.controller('assetsTrackingMapController', ['$scope', '$http' , '$window', 'mapFactory', 'host', 'tracking_host', 'signlr_link', assetsTrackingMapController]); 

function assetsTrackingMapController($scope, $http, $window, mapFactory, host, tracking_host, signlr_link) {
	var vm = this;
	vm.map = mapFactory.createMap(23.7968725, 90.4083922, "tracking-map", 15);
	vm.assetsList = [];
	vm.locateMarkerOnMap = mapFactory.locateMarkerOnMap;

	var getAllAssetUrl = host + "/api/account/odata?$filter=Type eq 'BIKE_MESSENGER'&envelope=true&page=0&pageSize=25"; // this is an ugly piece of code!
	console.log(getAllAssetUrl)
	$http.get(getAllAssetUrl).then(
		function assetListFound(response) {			
			var _assetsList = response.data.data;
			angular.forEach(_assetsList, function (asset, key) {
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
			vm.assetsList = _assetsList;
		}, function assetListNotFound(error) {
			$window.location.reload();
		});

	var connection = $.hubConnection(signlr_link);
	var proxy = connection.createHubProxy('[ShadowHub]');
	 
	// receives broadcast messages from a hub function, called "broadcastMessage"
	proxy.on('SendLocation', function(asset) {
	    console.log(asset);
	});
	 
	// atempt connection, and handle errors
	connection.start()
	.done(function(){ console.log('Now connected, connection ID=' + connection.id); })
	.fail(function(){ console.log('Could not connect'); });
}