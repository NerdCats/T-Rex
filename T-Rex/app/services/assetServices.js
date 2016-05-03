'use strict';

app.factory('userService', function($http, $window, restCall, host, UrlPath){

	var populateUsers = function (users, pageSize) {
		var userListUrl = host + "api/account/odata?" + "$filter=Type eq 'USER' or Type eq 'ENTERPRISE'" + "&envelope=" + true + "&page=" + 0 + "&pageSize=" + 20;
		function successCallback(response) {
			users.Collection = response.data.data;			
			for (var i = 0; i < response.data.pagination.TotalPages ; i++) {
				users.pages.push(i);
			};
		}
		function errorCallback(error) {
			console.log(error);
		}
		restCall('GET', userListUrl, null, successCallback, errorCallback);
	}

	var populateAssets = function (assets, type, envelope, page, pageSize){	
		var assetlistUrl = host + UrlPath.assets(type, envelope, page, pageSize);

		function successCallback (response) {
			assets.Collection = response.data.data;
			for (var i = 0; i < response.data.pagination.TotalPages ; i++) {
				assets.pages.push(i);
			};
		}
		restCall('GET', assetlistUrl, null, successCallback);
	};

	var registerNewAsset = function (asset){
		var successCallback = function (response) {
  			console.log("success : ");
  			console.log(response);
  			alert("")
  			$window.location.href = '#/asset';
  		};
  		
  		var errorCallback = function error(response) {
  			console.log("error : ");
  			console.log(response);
  		};
  		
		console.log(asset);
		var registerNewAssetUrl = host + "api/Account/Register";
		restCall('POST', registerNewAssetUrl, asset, successCallback, errorCallback)  	
	};

	return {
		populateAssets : populateAssets,
		registerNewAsset : registerNewAsset,
		populateUsers : populateUsers
	}
});
