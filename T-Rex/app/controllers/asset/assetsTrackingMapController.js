'use strict';


app.controller('assetsTrackingMapController', ['$scope', '$http' , '$window', 'restCall', 'mapFactory', 'host', 'tracking_host', 'signlr_link', assetsTrackingMapController]); 

function assetsTrackingMapController($scope, $http, $window, restCall, mapFactory, host, tracking_host, signlr_link) {
	var vm = this;
	vm.map = mapFactory.createMap(23.7968725, 90.4083922, "tracking-map", 15);
	vm.assetsList = [];
	vm.locateMarkerOnMap = mapFactory.locateMarkerOnMap;

	var getAllAssetUrl = host + "/api/account/odata?$filter=Type eq 'BIKE_MESSENGER'&envelope=true&page=0&pageSize=25"; // this is an ugly piece of code!

	var _signalRAssetList = {};
	$http.get(getAllAssetUrl).then(
		function assetListFound(response) {			
			var _assetsList = response.data.data;

			// adapter pattern, creating objects as we need in our application
			angular.forEach(_assetsList, function (asset, key) {
				var _assetId = asset.Id.toString();
				var _asset = {
					lat : NaN,
					lng : NaN,
					content : asset.UserName,
					online : "offline",					
				};

				_signalRAssetList[_assetId] = _asset;
			});

			var getAssetLocationCache = tracking_host + "/api/ping";
			$http.get(getAssetLocationCache).then(
				function assetLocationCacheFound(response) {
					
					angular.forEach(response.data, function (asset, key) {
						console.log("assetLocationCacheFound");
						console.log(asset);
						console.log(_signalRAssetList);

						_signalRAssetList[asset.asset_id].lat = asset.point.coordinates[1];
						_signalRAssetList[asset.asset_id].lng = asset.point.coordinates[0];
						_signalRAssetList[asset.asset_id].online = "online";
						_signalRAssetList[asset.asset_id].assetOverLay = mapFactory.createOverlay(asset.point.coordinates[1], 
																									asset.point.coordinates[0],
																									_signalRAssetList[asset.asset_id].content);
						_signalRAssetList[asset.asset_id].lastSeen = new Date( asset.timestamp).toLocaleString();						
					});

					console.log(_signalRAssetList);

				vm.assetsList = _signalRAssetList;
				$scope.$apply();
				}, function assetLocationCacheNotFound(error) {
					console.log(error);
				}
			);			
			// angular.forEach(_assetsList, function (asset, key) {
			// 	var getAssetLocationUrl = tracking_host + "/api/ping/";
			// 	var Id = asset.Id.toString();
			// 	console.log(Id);

			// 	var _asset = {					
			// 		lat : NaN,
			// 		lng : NaN,
			// 		content : asset.UserName,
			// 		// assetOverLay : mapFactory.createOverlay(lat, lng, content)
			// 	}

			// 	console.log("*******************************");
			// 	_signalRAssetList[Id] = _asset;
			// 	// console.log(asset);
				
			// 	$http.get(getAssetLocationUrl).then(
			// 		function locationFound(response) {
			// 			var assetLocation = response.data;
			// 			var lat = assetLocation.point.coordinates[1];
			// 			var lng = assetLocation.point.coordinates[0];
			// 			var content = asset.UserName;
			// 			var assetOverLay = mapFactory.createOverlay(lat, lng, content);

			// 			asset.online = "online";
			// 			asset.lat =  assetLocation.point.coordinates[1];
			// 			asset.lng =  assetLocation.point.coordinates[0];
			// 			asset.lastSeen = new Date( assetLocation.timestamp).toLocaleString();
			// 		}, function locationNotFound(error) {
			// 			asset.online = "offline"
			// 		});
			// });
			console.log(_signalRAssetList);
			// vm.assetsList = _assetsList;
		}, function assetListNotFound(error) {
			$window.location.reload();
		});

	var connection = $.hubConnection(signlr_link);
	var proxy = connection.createHubProxy('ShadowHub');
	 
	// receives broadcast messages from a hub function, called "broadcastMessage"
	proxy.on('getLocation', function(asset) {   
		console.log(asset);
		console.log(_signalRAssetList);
	    mapFactory.removeOverlays();
	    _signalRAssetList[asset.AssetId].lat = asset.Point.coordinates[1];
	    _signalRAssetList[asset.AssetId].lng = asset.Point.coordinates[0];
	    _signalRAssetList[asset.AssetId].online = "online";

	    angular.forEach(_signalRAssetList, function (value, key) {
	    	if (!isNaN(value.lat) || !isNaN(value.lng)) {
	    		console.log(value.content + " " + value.lat + " " + value.lng);
			    mapFactory.createOverlay(value.lat, value.lng, value.content);
	    	}
	    });

	    vm.assetsList = _signalRAssetList;
	    $scope.$apply();
	});

	proxy.on('sendLocation', function(asset) {
	    console.log(asset);
	});
	 
	// atempt connection, and handle errors
	connection.start()
	.done(function(){ 
		console.log('Now connected, connection ID=' + connection.id);
		console.log(connection);
		console.log(proxy);
	})
	.fail(function(){ 
		console.log('Could not connect'); });
}