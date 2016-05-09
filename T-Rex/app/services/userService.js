'use strict';

app.factory('userService', ["$http", "$window", "restCall", "host", "UrlPath", function($http, $window, restCall, host, UrlPath){

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
		console.log(assetlistUrl);
		function successCallback (response) {
			assets.Collection = response.data.data;
			for (var i = 0; i < response.data.pagination.TotalPages ; i++) {
				assets.pages.push(i);
			};
		}
		function errorCallback(error) {
			console.log(error);
		}
		restCall('GET', assetlistUrl, null, successCallback, errorCallback);
	};


	var populateUserDetails = function (user, userId) {
		var userUrl = host + "api/account/profile/" + userId;
		function successCallback(response) {
			user = response.data;
			console.log(user);			
		}
		function errorCallback(error) {
			console.log(error)
		}
		restCall('GET', userUrl, null, successCallback, errorCallback);
	}

	var registerNewUser = function (asset){
		var successCallback = function (response) {
  			console.log("success : ");
  			console.log(response);
  			alert("Success")
  			$window.location.href = '#/asset';
  		};
  		
  		var errorCallback = function error(response) {
  			console.log("error : ");
  			console.log(response);
  		};

		console.log(asset);
		var registerNewUserUrl = host + "api/Account/Register";
		restCall('POST', registerNewUserUrl, asset, successCallback, errorCallback)  	
	};

	return {
		populateAssets : populateAssets,
		registerNewUser : registerNewUser,
		populateUsers : populateUsers,
		populateUserDetails : populateUserDetails
	}
}]);
