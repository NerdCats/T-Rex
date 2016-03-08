'use strict';

app.factory('assetsFactory', function($http, $window, restCall){
	
	var urlMaker = function (type, envelope, page, pageSize) {
		var host = "http://localhost:23873/api/Account?";
		var envelope = envelope;
		var page = page;

		var url = host + "envelope=" + envelope + "&page=" + page + "&pageSize=" + pageSize;
		console.log(url);
		return url;
	};

	var populateAssets = function (assets, type, envelope, page, pageSize){	

		var url = urlMaker(type, envelope, page, pageSize);
		$http.get(url).then(function (response) {
			angular.forEach(response.data.data, function(value, key){
				console.log(value);
				var asset = {
					_id : value._id,
					Username : value.Profile.FirstName,
					Type : value.Type,
					Phone : value.PhoneNumber,
					CurrentLocation : value.CurrentLocation,
					AreaOfOperation : value.AreaOfOperation,
					IsAvailable : value.IsAvailable,
					State : value.State,
				};

				assets.Collection.push(asset);
			});

			for (var i = 0; i < response.data.pagination.TotalPages ; i++) {
				assets.pages.push(i);
			};
		});
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
		var url = "http://localhost:23873/api/Account/Register";
		restCall('POST', url, asset, successCallback, errorCallback)  	
	};

	return {
		populateAssets : populateAssets,
		registerNewAsset : registerNewAsset
	}
});
