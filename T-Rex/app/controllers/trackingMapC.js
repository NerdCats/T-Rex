'use strict';

app.controller('trackingMapC', ['$scope', '$http' , '$window', 'restCall', 'mapFactory', 'ngAuthSettings', 'tracking_host', 'signlr_link', trackingMapC]); 

function trackingMapC($scope, $http, $window, restCall, mapFactory, ngAuthSettings, tracking_host, signlr_link) {
	var vm = this;
	vm.map = mapFactory.createMap(23.7968725, 90.4083922, "tracking-map", 15);
	vm.assetsList = [];
	vm.locateMarkerOnMap = mapFactory.locateMarkerOnMap;
	vm.totalAsset = 0;
	vm.totalOnlineAsset = 0;
	var getAllAssetUrl = ngAuthSettings.apiServiceBaseUri + "/api/account/odata?$filter=Type eq 'BIKE_MESSENGER'&envelope=true&page=0&pageSize=25"; // this is an ugly piece of code!

	var _signalRAssetList = {};
	$http.get(getAllAssetUrl).then(
		function assetListFound(response) {			
			var _assetsList = response.data.data;
			vm.totalAsset = _assetsList.length;
			console.log("total Asset " + vm.totalAsset);

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
						try{
							console.log("assetLocationCacheFound");
							console.log(asset);
							console.log(_signalRAssetList);

							_signalRAssetList[asset.asset_id].lat = asset.point.coordinates[1];
							_signalRAssetList[asset.asset_id].lng = asset.point.coordinates[0];
							_signalRAssetList[asset.asset_id].online = "online";
							vm.totalOnlineAsset += 1;
							_signalRAssetList[asset.asset_id].assetOverLay = mapFactory.createOverlay(asset.point.coordinates[1], 
																										asset.point.coordinates[0],
																										_signalRAssetList[asset.asset_id].content);
							_signalRAssetList[asset.asset_id].lastSeen = new Date( asset.timestamp).toLocaleString();
						} catch(error) {
							console.log(error);
						}					
					});

					console.log(_signalRAssetList);
					console.log("total Online " + vm.totalOnlineAsset)

				vm.assetsList = _signalRAssetList;				
				}, function assetLocationCacheNotFound(error) {
					console.log(error);
				}
			);						 
			console.log(_signalRAssetList);
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